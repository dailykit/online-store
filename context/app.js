import React, { useState } from 'react'

const AppContext = React.createContext()

export const AppContextProvider = ({ children }) => {
   const [brandId, setBrandId] = useState(undefined)
   const [visual, setVisual] = useState({
      color: '#3fa4ff',
      slides: [],
      title: 'Online Store',
      favicon: '',
   })
   const [brand, setBrand] = useState({
      name: 'Online Store',
      address: {},
      logo:
         'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
   })
   const [availability, setAvailability] = useState(undefined)

   const [menuData, setMenuData] = React.useState([])
   const [masterLoading, setMasterLoading] = React.useState(true)
   const [menuLoading, setMenuLoading] = React.useState(false)

   React.useEffect(() => {
      console.log('Master loading:', masterLoading)
   }, [masterLoading])

   return (
      <AppContext.Provider
         value={{
            brandId,
            setBrandId,
            setVisual,
            visual,
            setBrand,
            brand,
            setAvailability,
            availability,
            menuData,
            setMenuData,
            masterLoading,
            setMasterLoading,
            menuLoading,
            setMenuLoading,
         }}
      >
         {children}
      </AppContext.Provider>
   )
}

export const useAppContext = () => React.useContext(AppContext)
