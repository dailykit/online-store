import React from 'react'
import { Text, View } from 'react-native'
import { useAppContext } from '../context/app'
import { width } from '../utils/Scaling'

const Footer = () => {
   const { visual, brand } = useAppContext()

   return (
      <View
         style={{
            backgroundColor: visual.color,
            flexDirection: width > 768 ? 'row' : 'column',
            alignItems: 'center',
            padding: 60,
            justifyContent: 'space-between',
         }}
      >
         <View>
            <Text
               style={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: '#fff',
                  marginBottom: 16,
               }}
            >
               {brand.name}
            </Text>
            <Text style={{ fontSize: '0.9rem', color: '#fff' }}>
               Have trouble placing an order? Contact us:{' '}
               <Text style={{ fontWeight: '600' }}>
                  {brand.contact.phoneNo || brand.contact.email}
               </Text>
            </Text>
         </View>
         <Text style={{ color: '#fff' }}>Powered by DailyKIT</Text>
      </View>
   )
}

export default Footer
