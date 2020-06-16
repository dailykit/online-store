import React from 'react';

const DrawerContext = React.createContext();

export const DrawerContextProvider = ({ children }) => {
   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
   const [drawerView, setDrawerView] = React.useState(undefined);
   const [params, setParams] = React.useState(undefined);

   const open = (screen, params) => {
      setDrawerView(screen);
      if (params) setParams(params);
      setIsDrawerOpen(true);
   };

   return (
      <DrawerContext.Provider
         value={{
            isDrawerOpen,
            setIsDrawerOpen,
            drawerView,
            open,
            params,
         }}
      >
         {children}
      </DrawerContext.Provider>
   );
};

export const useDrawerContext = () => React.useContext(DrawerContext);
