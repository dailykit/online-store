import React from 'react'
import { useAuth } from './auth'

const DrawerContext = React.createContext()

export const DrawerContextProvider = ({ children }) => {
   const { isAuthenticated } = useAuth()
   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
   const [drawerView, setDrawerView] = React.useState(undefined)
   const [params, setParams] = React.useState(undefined)
   const [navigation, setNavigation] = React.useState(undefined)

   const [saved, setSaved] = React.useState(undefined)

   const open = (screen, params) => {
      console.log('Opening drawer', screen)
      setDrawerView(screen)
      if (params) setParams(params)
      setIsDrawerOpen(true)
   }

   return (
      <DrawerContext.Provider
         value={{
            isDrawerOpen,
            setIsDrawerOpen,
            drawerView,
            open,
            params,
            saved,
            setSaved,
            setDrawerView,
            navigation,
            setNavigation,
         }}
      >
         {children}
      </DrawerContext.Provider>
   )
}

export const useDrawerContext = () => React.useContext(DrawerContext)
