import { ADD_TO_CART } from "./types";

export const fetchData = () => (dispatch) => {
  dispatch({
    type: FETCH_DATA,
    payload: "data",
  });
};
