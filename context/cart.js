import React, { useState } from 'react';

const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProductsToDisplay, setcartProductsToDisplay] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    settotalPrice(totalPrice + parseFloat(item.product.price));
  };

  const removeFromCart = (item) => {
    console.log('item removed');
  };

  const addToCartProductsDisplay = (item) => {
    setcartProductsToDisplay([...cartProductsToDisplay, item]);
    settotalPrice(totalPrice + item.price);
  };

  const removeFromCartProductsDisplay = (item) => {
    console.log('item removed');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        addToCartProductsDisplay,
        removeFromCartProductsDisplay,
        cartProductsToDisplay,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => React.useContext(CartContext);
