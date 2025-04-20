import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // persist auth and cart
};

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  order: orderReducer,
  cart: cartReducer,
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
