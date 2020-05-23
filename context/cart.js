import React, { useState } from "react";

const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProductsToDisplay, setcartProductsToDisplay] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);
  const [orderCart, setOrderCart] = useState({
    cartInfo: undefined, // available
    customerId: undefined, // available
    paymentMethodId: 1,
    stripeCustomerId: 1,
    addressId: 1,
    fulFillmentInfo: {
      time: {
        from: "",
        to: "",
      },
      date: "",
      type: "DELIVERY",
    },
    pricing: {
      itemTotal: 0,
      discount: 0,
      tip: 0,
      tax: 0,
      totalPrice: 0,
    },
  });

  const addToCart = (item) => {
    if (item.type == "comboProducts") {
      let comboItemPrice = 0;
      console.log(item.products);
      item.products.forEach((product) => {
        comboItemPrice = comboItemPrice + parseFloat(product.product.price);
      });
      item["price"] = comboItemPrice;
      settotalPrice(totalPrice + parseFloat(comboItemPrice));
    } else {
      settotalPrice(totalPrice + parseFloat(item.product.price));
    }
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (product) => {
    let new_price = totalPrice - parseFloat(product.price);
    if (isNaN(new_price) || new_price < 0) {
      new_price = 0;
    }
    settotalPrice(new_price);
    let newCartItems = cartItems.filter(
      (item) => item.cartItemId !== product.cartItemId
    );
    setCartItems(newCartItems);
  };

  const addToCartProductsDisplay = (item) => {
    setcartProductsToDisplay([...cartProductsToDisplay, item]);
    settotalPrice(totalPrice + item.price);
  };

  const removeFromCartProductsDisplay = (item) => {
    console.log("item removed");
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
