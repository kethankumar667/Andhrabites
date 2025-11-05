// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer' | 'admin' | 'restaurant_partner' | 'delivery_partner';
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Address types
export interface Address {
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

// Restaurant types
export interface Restaurant {
  _id: string;
  partnerId: string;
  name: string;
  description?: string;
  cuisine: string[];
  logo?: string;
  coverImage?: string;
  address: Address;
  contactNumber: string;
  operatingHours: OperatingHour[];
  averagePreparationTime: number;
  minimumOrderAmount: number;
  deliveryRadius: number;
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  featured: boolean;
}

export interface OperatingHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Menu types
export interface MenuCategory {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CustomizationOption {
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    name: string;
    price: number;
  }[];
}

export interface MenuItem {
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
  preparationTime: number;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra_hot';
  customizations: CustomizationOption[];
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

// Order types
export interface Order {
  _id: string;
  customerId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    couponDiscount: number;
    totalAmount: number;
  };
  delivery: {
    address: Address;
    estimatedTime: number;
    instructions?: string;
  };
  payment: {
    method: 'razorpay' | 'wallet' | 'cod';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  timestamps: {
    placedAt: string;
    confirmedAt?: string;
    preparingAt?: string;
    readyAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
  };
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  customizations: {
    name: string;
    option: string;
    price: number;
  }[];
}

export interface CartItem extends OrderItem {
  menuItem: {
    _id: string;
    name: string;
    description?: string;
    images: string[];
    isVeg: boolean;
  };
}

// API Response types
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

// Auth types
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

// Form types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface InputProps {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}