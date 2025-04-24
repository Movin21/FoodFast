// driverSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDriver: false,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.isDriver = true;
    },
    clearDriver: (state) => {
      state.isDriver = false;
    },
  },
});

export const { setDriver, clearDriver } = driverSlice.actions;

export default driverSlice.reducer;
