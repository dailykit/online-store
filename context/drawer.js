import React from 'react';

const DrawerContext = React.createContext();

export const DrawerContextProvider = ({ children }) => {
   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
   const [drawerView, setDrawerView] = React.useState(undefined);

   React.useEffect(() => {
      console.log(isDrawerOpen);
   }, [isDrawerOpen]);

   return (
      <DrawerContext.Provider
         value={{
            isDrawerOpen,
            setIsDrawerOpen,
            drawerView,
            setDrawerView,
         }}
      >
         {children}
      </DrawerContext.Provider>
   );
};

export const useDrawerContext = () => React.useContext(DrawerContext);
