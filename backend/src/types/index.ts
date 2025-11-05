export interface IUser {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer' | 'admin' | 'restaurant_partner' | 'delivery_partner';
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerProfile {
  _id: string;
  userId: string;
  addresses: IAddress[];
  preferences: {
    vegOnly: boolean;
    favoriteCuisines: string[];
    dietaryRestrictions: string[];
  };
  walletBalance: number;
  loyaltyPoints: number;
}

export interface IAddress {
  type: 'home' | 'work' | 'other';
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface IRestaurantPartner {
  _id: string;
  userId: string;
  businessName: string;
  businessType: 'restaurant' | 'cloud_kitchen';
  licenseNumber?: string;
  gstNumber?: string;
  bankAccount: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  businessAddress: IAddress;
  isApproved: boolean;
  approvalDate?: Date;
  commissionRate: number;
}

export interface IDeliveryPartner {
  _id: string;
  userId: string;
  vehicleType: 'bike' | 'cycle' | 'car';
  vehicleNumber: string;
  drivingLicense: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
  isAvailable: boolean;
  earnings: {
    totalEarned: number;
    thisWeek: number;
    thisMonth: number;
  };
  ratings: {
    average: number;
    count: number;
  };
}

export interface IRestaurant {
  _id: string;
  partnerId: string;
  name: string;
  description?: string;
  cuisine: string[];
  logo?: string;
  coverImage?: string;
  address: IAddress;
  contactNumber: string;
  operatingHours: IOperatingHour[];
  averagePreparationTime: number; // in minutes
  minimumOrderAmount: number;
  deliveryRadius: number; // in km
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  featured: boolean;
}

export interface IOperatingHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface IMenuCategory {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ICustomizationOption {
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    name: string;
    price: number;
  }[];
}

export interface IMenuItem {
  _id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra_hot';
  customizations: ICustomizationOption[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
}

export interface IOrder {
  _id: string;
  customerId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    couponDiscount: number;
    totalAmount: number;
  };
  delivery: {
    address: IAddress;
    estimatedTime: number; // in minutes
    instructions?: string;
  };
  payment: {
    method: 'razorpay' | 'wallet' | 'cod';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  timestamps: {
    placedAt: Date;
    confirmedAt?: Date;
    preparingAt?: Date;
    readyAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
  };
  notes?: string;
}

export interface IOrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  customizations: {
    name: string;
    option: string;
    price: number;
  }[];
}

export interface ICoupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  applicableRestaurants: string[];
  isActive: boolean;
}

export interface ICartItem extends IOrderItem {
  menuItem: {
    _id: string;
    name: string;
    description?: string;
    images: string[];
    isVeg: boolean;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer' | 'restaurant_partner' | 'delivery_partner';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}