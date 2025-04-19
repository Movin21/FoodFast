import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  amount: number;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  restaurantName: string;
  restaurantAddress: string;
}

const initialState: OrderState = {
  amount: 0,
  orderId: "",
  customerName: "",
  customerAddress: "",
  customerPhone: "",
  restaurantName: "",
  restaurantAddress: "",
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
