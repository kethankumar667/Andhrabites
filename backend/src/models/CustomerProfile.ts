import mongoose, { Document, Schema } from 'mongoose';
import { ICustomerProfile, IAddress } from '@/types';

interface ICustomerProfileDocument extends ICustomerProfile, Document {}

const addressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true
  },
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
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const customerProfileSchema = new Schema<ICustomerProfileDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  addresses: [addressSchema],
  preferences: {
    vegOnly: {
      type: Boolean,
      default: false
    },
    favoriteCuisines: [{
      type: String,
      trim: true
    }],
    dietaryRestrictions: [{
      type: String,
      trim: true
    }]
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
customerProfileSchema.index({ userId: 1 });
customerProfileSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Pre-save middleware to ensure only one default address
customerProfileSchema.pre('save', function(next) {
  const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
  if (defaultAddresses.length > 1) {
    // Keep only the first default address, make others non-default
    this.addresses.forEach((addr, index) => {
      if (index > 0 && addr.isDefault) {
        addr.isDefault = false;
      }
    });
  }
  next();
});

const CustomerProfile = mongoose.model<ICustomerProfileDocument>('CustomerProfile', customerProfileSchema);

export default CustomerProfile;