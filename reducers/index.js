import { combineReducers } from "redux";
import cartItemsReducer from "./cartItems";

export default combineReducers({
  cartItems: cartItemsReducer,
});
