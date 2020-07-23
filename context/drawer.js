import React from 'react'
import { useAuth } from './auth'

const DrawerContext = React.createContext()

export const DrawerContextProvider = ({ children }) => {
   const { isAuthenticated } = useAuth()
   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
   const [drawerView, setDrawerView] = React.useState(undefined)
   const [params, setParams] = React.useState(undefined)

   const [saved, setSaved] = React.useState(undefined)

   const open = (screen, params) => {
      setDrawerView(screen)
      if (params) setParams(params)
      setIsDrawerOpen(true)
   }

   React.useEffect(() => {
      if (isAuthenticated) {
         if (window.location !== window.parent.location) {
            window.parent.location.reload()
         }
      }
   }, [isAuthenticated])

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
         }}
      >
         {children}
      </DrawerContext.Provider>
   )
}

export const useDrawerContext = () => React.useContext(DrawerContext)
