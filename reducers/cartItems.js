import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/types";

const initialState = {
  cart: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        theme: action.payload,
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
}
