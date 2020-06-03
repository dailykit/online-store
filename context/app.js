import React, { useState } from 'react';

const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
  const [visual, setVisual] = useState({
    color: '#3fa4ff',
    cover:
      'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    title: 'Online Store',
    favicon: '',
  });
  const [brand, setBrand] = useState({
    name: 'Online Store',
    logo:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  });
  const [availability, setAvailability] = useState(undefined);

  return (
    <AppContext.Provider
      value={{
        visual,
        setVisual,
        brand,
        setBrand,
        availability,
        setAvailability,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
