import React, { useState } from 'react';

const CartContext = React.createContext();

export const CartContextProvider = ({ children }) => {
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
      setCart(undefined);
    }
  }, [customer]);

  return (
    <CartContext.Provider
      value={{
        customer,
        setCustomer,
        cart,
        setCart,
        customerDetails,
        setCustomerDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => React.useContext(CartContext);
