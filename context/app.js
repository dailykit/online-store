import React, { useState } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { STORE_SETTINGS } from '../graphql'

const AppContext = React.createContext()

export const AppContextProvider = ({ children }) => {
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
   const [menuLoading, setMenuLoading] = React.useState(false)

   // Query
   const { loading: settingsLoading, error } = useSubscription(STORE_SETTINGS, {
      onSubscriptionData: data => {
         const brandSettings = data.subscriptionData.data.storeSettings.filter(
            setting => setting.type === 'brand'
         )
         const visualSettings = data.subscriptionData.data.storeSettings.filter(
            setting => setting.type === 'visual'
         )
         const availabilitySettings = data.subscriptionData.data.storeSettings.filter(
            setting => setting.type === 'availability'
         )

         let brandState = {}
         brandSettings.forEach(({ identifier, value }) => {
            switch (identifier) {
               case 'Brand Logo': {
                  brandState.logo = value.url
                  return
               }
               case 'Brand Name': {
                  brandState.name = value.name
                  return
               }
               default: {
                  return
               }
            }
         })
         setBrand({ ...brandState })

         let visualState = {}
         visualSettings.forEach(({ identifier, value }) => {
            switch (identifier) {
               case 'Primary Color': {
                  visualState.color = value.color
                  return
               }
               case 'Slides': {
                  visualState.slides = value
                  return
               }
               default: {
                  return
               }
            }
         })
         setVisual({ ...visualState })

         let availabilityState = {}
         availabilitySettings.forEach(({ identifier, value }) => {
            switch (identifier) {
               case 'Store Availability': {
                  availabilityState.store = value
                  return
               }
               case 'Pickup Availability': {
                  availabilityState.pickup = value
                  return
               }
               case 'Delivery Availability': {
                  availabilityState.delivery = value
                  return
               }
               case 'Location': {
                  availabilityState.location = value.address
               }
               default: {
                  return
               }
            }
         })
         setAvailability({ ...availabilityState })
      },
   })

   return (
      <AppContext.Provider
         value={{
            visual,
            brand,
            availability,
            menuData,
            setMenuData,
            menuLoading,
            setMenuLoading,
            settingsLoading,
         }}
      >
         {children}
      </AppContext.Provider>
   )
}

export const useAppContext = () => React.useContext(AppContext)
