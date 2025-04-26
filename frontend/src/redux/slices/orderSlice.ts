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
  orderId: "ORDER00123",
  customerName: "John Doe",
  customerAddress: "Kadawatha",
  customerPhone: "+94771234567",
  customerEmail: "movin@gmaill.com",
  restaurantName: "Pizza House",
  restaurantAddress: "Kiribathgoda",
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
