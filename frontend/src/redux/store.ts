import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";
import driverReducer from "./slices/driverSlice";


const persistConfig = {
  key: "root",
  storage,

  whitelist: ["auth", "driver","cart"], // only auth will be persisted

};

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  order: orderReducer,
  cart: cartReducer,
  driver: driverReducer,

  // Add other reducers here as needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
