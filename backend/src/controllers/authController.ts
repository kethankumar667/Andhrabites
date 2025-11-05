import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '@/models/User';
import CustomerProfile from '@/models/CustomerProfile';
import { asyncHandler } from '@/middleware/errorHandler';
import { RegisterData, LoginCredentials, ApiResponse } from '@/types';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/services/emailService';
import { setCache, deleteCache } from '@/config/redis';

// Generate JWT tokens
const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phoneNumber, role }: RegisterData = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }]
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'USER_EXISTS',
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      }
    } as ApiResponse);
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role
  });

  await user.save();

  // Create customer profile for customer role
  if (role === 'customer') {
    const customerProfile = new CustomerProfile({
      userId: user._id
    });
    await customerProfile.save();
  }

  // Generate verification token
  const verificationToken = generateVerificationToken();

  // Cache verification token with expiry
  await setCache(`verification:${verificationToken}`, user._id.toString(), 24 * 60 * 60); // 24 hours

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });

  // Cache user session
  await setCache(`session:${user._id}`, {
    userId: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  }, 7 * 24 * 60 * 60); // 7 days

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture
      },
      accessToken
    },
    message: 'Registration successful. Please check your email to verify your account.'
  } as ApiResponse);
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginCredentials = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    } as ApiResponse);
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'ACCOUNT_INACTIVE',
        message: 'Your account has been deactivated'
      }
    } as ApiResponse);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    } as ApiResponse);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });

  // Cache user session
  await setCache(`session:${user._id}`, {
    userId: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  }, 7 * 24 * 60 * 60); // 7 days

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture
      },
      accessToken
    },
    message: 'Login successful'
  } as ApiResponse);
});

// Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_REFRESH_TOKEN',
        message: 'Refresh token is required'
      }
    } as ApiResponse);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token'
        }
      } as ApiResponse);
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Update cached session
    await setCache(`session:${user._id}`, {
      userId: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }, 7 * 24 * 60 * 60);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      },
      message: 'Token refreshed successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired refresh token'
      }
    } as ApiResponse);
  }
});

// Logout user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    try {
      // Decode token to get user ID
      const decoded = jwt.decode(refreshToken) as any;

      // Remove cached session
      await deleteCache(`session:${decoded.userId}`);
    } catch (error) {
      // Ignore errors during logout
    }
  }

  // Clear refresh token cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/'
  });

  res.json({
    success: true,
    message: 'Logout successful'
  } as ApiResponse);
});

// Verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'Verification token is required'
      }
    } as ApiResponse);
  }

  // Get user ID from cache
  const { getCache } = await import('@/config/redis');
  const userId = await getCache(`verification:${token}`);

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired verification token'
      }
    } as ApiResponse);
  }

  // Find user and update verification status
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      }
    } as ApiResponse);
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'ALREADY_VERIFIED',
        message: 'Email is already verified'
      }
    } as ApiResponse);
  }

  user.isVerified = true;
  await user.save();

  // Delete verification token from cache
  await deleteCache(`verification:${token}`);

  res.json({
    success: true,
    message: 'Email verified successfully'
  } as ApiResponse);
});

// Forgot password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists for security
    return res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    } as ApiResponse);
  }

  // Generate reset token
  const resetToken = generateVerificationToken();

  // Cache reset token with expiry
  await setCache(`reset:${resetToken}`, user._id.toString(), 60 * 60); // 1 hour

  // Send password reset email
  try {
    await sendPasswordResetEmail(email, resetToken);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: 'Failed to send password reset email'
      }
    } as ApiResponse);
  }

  res.json({
    success: true,
    message: 'Password reset link has been sent to your email'
  } as ApiResponse);
});

// Reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_FIELDS',
        message: 'Reset token and new password are required'
      }
    } as ApiResponse);
  }

  // Get user ID from cache
  const { getCache } = await import('@/config/redis');
  const userId = await getCache(`reset:${token}`);

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired reset token'
      }
    } as ApiResponse);
  }

  // Find user and update password
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      }
    } as ApiResponse);
  }

  user.password = newPassword;
  await user.save();

  // Delete reset token from cache
  await deleteCache(`reset:${token}`);

  // Delete all user sessions (force logout from all devices)
  await deleteCache(`session:${userId}`);

  res.json({
    success: true,
    message: 'Password reset successful. Please login with your new password'
  } as ApiResponse);
});