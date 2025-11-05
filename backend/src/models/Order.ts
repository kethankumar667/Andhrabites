import mongoose, { Document, Schema } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from '@/types';

interface IOrderDocument extends IOrder, Document {
  orderNumber: string;
}

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

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  customizations: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    option: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Customization price cannot be negative']
    }
  }]
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  deliveryPartnerId: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    default: null
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: [0, 'Delivery fee cannot be negative']
    },
    taxes: {
      type: Number,
      required: true,
      min: [0, 'Taxes cannot be negative']
    },
    couponDiscount: {
      type: Number,
      required: true,
      min: [0, 'Coupon discount cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    }
  },
  delivery: {
    address: addressSchema,
    estimatedTime: {
      type: Number,
      required: true,
      min: [5, 'Estimated delivery time must be at least 5 minutes']
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Delivery instructions cannot exceed 200 characters']
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: {
      type: String,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      default: null
    }
  },
  timestamps: {
    placedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    confirmedAt: {
      type: Date,
      default: null
    },
    preparingAt: {
      type: Date,
      default: null
    },
    readyAt: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Order notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ deliveryPartnerId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'timestamps.placedAt': -1 });
orderSchema.index({ 'payment.status': 1 });

// Compound indexes for common queries
orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ deliveryPartnerId: 1, status: 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update timestamps based on status
orderSchema.pre('save', function(next) {
  const now = new Date();

  if (this.isModified('status')) {
    switch (this.status) {
      case 'confirmed':
        if (!this.timestamps.confirmedAt) {
          this.timestamps.confirmedAt = now;
        }
        break;
      case 'preparing':
        if (!this.timestamps.preparingAt) {
          this.timestamps.preparingAt = now;
        }
        break;
      case 'ready_for_pickup':
        if (!this.timestamps.readyAt) {
          this.timestamps.readyAt = now;
        }
        break;
      case 'delivered':
        if (!this.timestamps.deliveredAt) {
          this.timestamps.deliveredAt = now;
        }
        break;
      case 'cancelled':
        if (!this.timestamps.cancelledAt) {
          this.timestamps.cancelledAt = now;
        }
        break;
    }
  }

  next();
});

// Virtual for customer details
orderSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id'
});

// Virtual for restaurant details
orderSchema.virtual('restaurant', {
  ref: 'Restaurant',
  localField: 'restaurantId',
  foreignField: '_id'
});

// Virtual for delivery partner details
orderSchema.virtual('deliveryPartner', {
  ref: 'DeliveryPartner',
  localField: 'deliveryPartnerId',
  foreignField: '_id'
});

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function(customerId: string, page: number = 1, limit: number = 10) {
  return this.find({ customerId })
    .populate('restaurant', 'name logo cuisine rating')
    .sort({ 'timestamps.placedAt': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to find orders by restaurant
orderSchema.statics.findByRestaurant = function(restaurantId: string, status?: string) {
  const query: any = { restaurantId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('customer', 'firstName lastName phoneNumber')
    .sort({ 'timestamps.placedAt': -1 });
};

// Static method to find orders by delivery partner
orderSchema.statics.findByDeliveryPartner = function(deliveryPartnerId: string, status?: string) {
  const query: any = { deliveryPartnerId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('restaurant', 'name address')
    .populate('customer', 'firstName lastName phoneNumber')
    .sort({ 'timestamps.placedAt': -1 });
};

const Order = mongoose.model<IOrderDocument>('Order', orderSchema);

export default Order;