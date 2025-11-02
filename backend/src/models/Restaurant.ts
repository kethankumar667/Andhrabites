import mongoose, { Document, Schema } from 'mongoose';
import { IRestaurant, IAddress, IOperatingHour } from '@/types';

interface IRestaurantDocument extends IRestaurant, Document {}

const operatingHourSchema = new Schema<IOperatingHour>({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  openTime: {
    type: String,
    required: function(this: IOperatingHour) {
      return !this.isClosed;
    },
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  closeTime: {
    type: String,
    required: function(this: IOperatingHour) {
      return !this.isClosed;
    },
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  isClosed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const restaurantSchema = new Schema<IRestaurantDocument>({
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantPartner',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisine: [{
    type: String,
    required: true,
    trim: true,
    enum: ['Andhra', 'Telangana', 'South Indian', 'North Indian', 'Chinese', 'Continental', 'Biryani', 'Street Food', 'Desserts', 'Beverages']
  }],
  logo: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  address: {
    streetAddress: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'other'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  operatingHours: [operatingHourSchema],
  averagePreparationTime: {
    type: Number,
    required: true,
    min: [5, 'Preparation time must be at least 5 minutes'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  minimumOrderAmount: {
    type: Number,
    required: true,
    min: [0, 'Minimum order amount cannot be negative']
  },
  deliveryRadius: {
    type: Number,
    required: true,
    min: [1, 'Delivery radius must be at least 1 km'],
    max: [50, 'Delivery radius cannot exceed 50 km']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
restaurantSchema.index({ partnerId: 1 });
restaurantSchema.index({ 'address.coordinates': '2dsphere' }); // Geospatial index
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ featured: 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ name: 'text', description: 'text' });

// Virtual for menu items
restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurantId'
});

// Virtual for menu categories
restaurantSchema.virtual('menuCategories', {
  ref: 'MenuCategory',
  localField: '_id',
  foreignField: 'restaurantId'
});

// Static method to find restaurants within delivery radius
restaurantSchema.statics.findWithinRadius = function(latitude: number, longitude: number, radiusKm: number) {
  return this.find({
    isActive: true,
    'address.coordinates': {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusKm / 6371] // Earth's radius in km
      }
    }
  });
};

// Static method to search restaurants
restaurantSchema.statics.searchRestaurants = function(searchTerm: string, filters: any = {}) {
  const query: any = {
    isActive: true,
    ...filters
  };

  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  return this.find(query)
    .populate('menuCategories')
    .sort({ featured: -1, 'rating.average': -1 });
};

const Restaurant = mongoose.model<IRestaurantDocument>('Restaurant', restaurantSchema);

export default Restaurant;