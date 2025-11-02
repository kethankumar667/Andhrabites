import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurant: string | null;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  coupon: string | null;
  discount: number;
  total: number;
}

const initialState: CartState = {
  items: [],
  restaurant: null,
  subtotal: 0,
  deliveryFee: 0,
  taxes: 0,
  coupon: null,
  discount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: MenuItem; quantity: number; customizations?: any[] }>) => {
      const { item, quantity, customizations = [] } = action.payload;

      // Check if adding from different restaurant
      if (state.restaurant && state.restaurant !== item.restaurantId) {
        // Clear cart if adding from different restaurant
        state.items = [];
        state.restaurant = item.restaurantId;
      } else if (!state.restaurant) {
        state.restaurant = item.restaurantId;
      }

      // Check if item already exists with same customizations
      const existingItemIndex = state.items.findIndex(
        cartItem =>
          cartItem.menuItemId === item._id &&
          JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          menuItemId: item._id,
          quantity,
          price: item.price,
          customizations,
          menuItem: {
            _id: item._id,
            name: item.name,
            description: item.description,
            images: item.images,
            isVeg: item.isVeg,
          }
        });
      }

      // Recalculate totals
      calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const menuItemId = action.payload;
      state.items = state.items.filter(item => item.menuItemId !== menuItemId);

      // Clear restaurant if cart is empty
      if (state.items.length === 0) {
        state.restaurant = null;
      }

      calculateTotals(state);
    },

    updateQuantity: (state, action: PayloadAction<{ menuItemId: string; quantity: number }>) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.menuItemId !== menuItemId);
          if (state.items.length === 0) {
            state.restaurant = null;
          }
        } else {
          item.quantity = quantity;
        }
      }

      calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.taxes = 0;
      state.coupon = null;
      state.discount = 0;
      state.total = 0;
    },

    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
      calculateTotals(state);
    },

    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      calculateTotals(state);
    },

    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
      calculateTotals(state);
    },
  },
});

// Helper function to calculate totals
const calculateTotals = (state: CartState) => {
  state.subtotal = state.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const customizationsTotal = item.customizations.reduce(
      (acc, custom) => acc + custom.price, 0
    );
    return total + itemTotal + customizationsTotal;
  }, 0);

  state.taxes = Math.round(state.subtotal * 0.05); // 5% tax
  state.total = Math.max(0, state.subtotal + state.deliveryFee + state.taxes - state.discount);
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setDeliveryFee,
} = cartSlice.actions;

export default cartSlice.reducer;