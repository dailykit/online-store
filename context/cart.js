import React, { useState } from 'react';

const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);

  // From keycloak
  const [user, setUser] = useState({ email: '', keycloakId: '' });
  // From Hasura
  const [customer, setCustomer] = useState(undefined);
  const [cart, setCart] = useState(undefined);
  // From platform
  const [customerDetails, setCustomerDetails] = useState(undefined);

  // Effects
  React.useEffect(() => {
    if (customer?.orderCarts?.length) {
      setCart(customer.orderCarts[0]);
    } else {
      setCart(undefined)
    }
  }, [customer]);

  const addToCart = (item) => {
    if (item.type == 'comboProducts') {
      let comboItemPrice = 0;
      console.log(item.products);
      item.products.forEach((product) => {
        comboItemPrice = comboItemPrice + parseFloat(product.product.price);
      });
      item['price'] = comboItemPrice;
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

  return (
    <CartContext.Provider
      value={{
        user,
        setUser,
        customer,
        setCustomer,
        cart,
        setCart,
        customerDetails,
        setCustomerDetails,
        // Remove stuff below
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => React.useContext(CartContext);
