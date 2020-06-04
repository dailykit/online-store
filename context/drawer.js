import React from 'react';

const DrawerContext = React.createContext();

export const DrawerContextProvider = ({ children }) => {
   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
   const [drawerView, setDrawerView] = React.useState(undefined);

   const open = screen => {
      setDrawerView(screen);
      setIsDrawerOpen(true);
   };

   return (
      <DrawerContext.Provider
         value={{
            isDrawerOpen,
            setIsDrawerOpen,
            drawerView,
            open,
         }}
      >
         {children}
      </DrawerContext.Provider>
   );
};

export const useDrawerContext = () => React.useContext(DrawerContext);
