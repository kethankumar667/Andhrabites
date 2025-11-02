import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  orderStatus: {
    [key: string]: string;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderStatus: {},
};

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: any) => {
    // This would be implemented with actual API call
    return null;
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (params?: { status?: string; page?: number; limit?: number }) => {
    // This would be implemented with actual API call
    return { orders: [], hasMore: true };
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string) => {
    // This would be implemented with actual API call
    return null;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: string }>) => {
      const { orderId, status } = action.payload;
      state.orderStatus[orderId] = status;

      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order._id === orderId);
      if (orderIndex >= 0) {
        state.orders[orderIndex].status = status as any;
      }

      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === orderId) {
        state.currentOrder.status = status as any;
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.orderStatus = {};
    },
  },
  extraReducers: (builder) => {
    // Place order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        if (action.payload) {
          state.orders.unshift(action.payload);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to place order';
      });

    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  },
});

export const { clearError, setCurrentOrder, updateOrderStatus, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;