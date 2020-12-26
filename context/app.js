import React, { useState } from 'react'

const AppContext = React.createContext()

export const AppContextProvider = ({ children }) => {
   const [brandId, setBrandId] = useState(undefined)
   const [paymentPartnerShipIds, setPaymentPartnershipIds] = useState(undefined)
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
   const [rewardsSettings, setRewardsSettings] = useState(undefined)
   const [appSettings, setAppSettings] = useState(undefined)

   const [menuData, setMenuData] = React.useState([])
   const [masterLoading, setMasterLoading] = React.useState(true)
   const [menuLoading, setMenuLoading] = React.useState(false)

   React.useEffect(() => {
      if (appSettings?.scripts) {
         const body = document.querySelector('body')

         let srcScripts = []
         let inlineScripts = []

         const allScripts = appSettings.scripts
            .split('</script>')
            .filter(script => script)

         allScripts.forEach(script => {
            if (script.includes('src')) {
               const startIndex = script.indexOf('src=') + 5
               const substr = script.substr(startIndex)
               const endIndex = substr.indexOf("'")
               const src = substr.substr(0, endIndex)
               srcScripts.push(src)
            } else {
               const code = script.replace('<script>', '')
               inlineScripts.push(code)
            }
         })

         const fragment = document.createDocumentFragment()

         srcScripts.forEach(src => {
            const script = document.createElement('script')
            script.setAttribute('src', src)
            fragment.appendChild(script)
         })

         inlineScripts.forEach(content => {
            const script = document.createElement('script')
            script.innerHTML = content
            fragment.appendChild(script)
         })

         body.appendChild(fragment)
      }
   }, [appSettings])

   return (
      <AppContext.Provider
         value={{
            brandId,
            setBrandId,
            paymentPartnerShipIds,
            setPaymentPartnershipIds,
            setVisual,
            visual,
            setBrand,
            brand,
            setAvailability,
            availability,
            appSettings,
            setAppSettings,
            rewardsSettings,
            setRewardsSettings,
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
