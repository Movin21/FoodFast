import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  amount: number;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  restaurantName: string;
  restaurantAddress: string;
}

const initialState: OrderState = {
  amount: 2000,
  orderId: "ORD12345",
  customerName: "John Doe",
  customerAddress: "123 Main St, Colombo",
  customerPhone: "0771234567",
  customerEmail: "john.doe@example.com",
  restaurantName: "Pizza House",
  restaurantAddress: "456 Market St, Colombo",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<Partial<OrderState>>) => {
      return { ...state, ...action.payload };
    },
    clearOrderDetails: () => initialState,
  },
});

export const { setOrderDetails, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
