import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Verify your Andhra Bites account',
    templateId: process.env.SENDGRID_VERIFICATION_TEMPLATE_ID,
    dynamicTemplateData: {
      verificationLink,
      userName: email.split('@')[0],
      supportEmail: process.env.FROM_EMAIL
    }
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error.message);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Reset your Andhra Bites password',
    templateId: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID,
    dynamicTemplateData: {
      resetLink,
      userName: email.split('@')[0],
      supportEmail: process.env.FROM_EMAIL,
      expiryHours: 1
    }
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error.message);
    throw new Error('Failed to send password reset email');
  }
};

export const sendOrderConfirmationEmail = async (email: string, orderDetails: any) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: `Order Confirmed - ${orderDetails.orderNumber}`,
    templateId: process.env.SENDGRID_ORDER_CONFIRMATION_TEMPLATE_ID,
    dynamicTemplateData: {
      orderNumber: orderDetails.orderNumber,
      restaurantName: orderDetails.restaurant.name,
      items: orderDetails.items,
      totalAmount: orderDetails.totalAmount,
      estimatedDelivery: orderDetails.estimatedDelivery,
      deliveryAddress: orderDetails.deliveryAddress
    }
  };

  try {
    await sgMail.send(msg);
    console.log(`Order confirmation email sent to ${email}`);
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error.message);
    // Don't throw error for order confirmation emails
  }
};