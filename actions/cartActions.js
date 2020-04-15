import { ADD_TO_CART, REMOVE_FROM_CART } from "./types";

export const addToCart = () => (dispatch) => {
  dispatch({
    type: ADD_TO_CART,
    payload: {},
  });
};

export const removeFromCart = () => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: {},
  });
};
