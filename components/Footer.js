import React from 'react'
import { Text, View } from 'react-native'
import { marginRight } from 'styled-system'
import { useAppContext } from '../context/app'
import { useDrawerContext } from '../context/drawer'
import { width } from '../utils/Scaling'

const Footer = () => {
   const { visual, brand } = useAppContext()
   const { open } = useDrawerContext()

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
         <View
            style={{
               marginBottom: width < 768 ? 24 : 0,
               flexDirection: width < 768 ? 'column' : 'row',
            }}
         >
            <View style={{ marginRight: width < 768 ? 0 : 60 }}>
               <Text
                  style={{
                     fontWeight: 'bold',
                     fontSize: '1.3rem',
                     color: '#fff',
                     marginBottom: 8,
                     textAlign: width < 786 ? 'center' : 'left',
                  }}
               >
                  {brand.name}
               </Text>
               <Text
                  style={{
                     fontSize: '0.9rem',
                     color: '#fff',
                     textAlign: width < 786 ? 'center' : 'left',
                     marginBottom: 8,
                  }}
               >
                  Have trouble placing an order? Contact us:{' '}
                  <Text style={{ fontWeight: '600' }}>
                     {brand.contact.phoneNo || brand.contact.email}
                  </Text>
               </Text>
               <Text
                  style={{
                     fontSize: '0.9rem',
                     color: '#fff',
                     textAlign: width < 786 ? 'center' : 'left',
                     marginBottom: 8,
                  }}
                  onPress={() => open('DeliveryBreakup')}
               >
                  Delivery Breakup
               </Text>
            </View>
            <View>
               {Boolean(brand.termsAndConditions) && (
                  <Text
                     style={{
                        fontSize: '0.9rem',
                        color: '#fff',
                        textAlign: width < 786 ? 'center' : 'left',
                        marginBottom: 4,
                     }}
                     onPress={() => open('TermsAndConditions')}
                  >
                     Terms and Conditions
                  </Text>
               )}
               {Boolean(brand.privacyPolicy) && (
                  <Text
                     style={{
                        fontSize: '0.9rem',
                        color: '#fff',
                        textAlign: width < 786 ? 'center' : 'left',
                        marginBottom: 4,
                     }}
                     onPress={() => open('PrivacyPolicy')}
                  >
                     Privacy Policy
                  </Text>
               )}
               {Boolean(brand.refundPolicy) && (
                  <Text
                     style={{
                        fontSize: '0.9rem',
                        color: '#fff',
                        textAlign: width < 786 ? 'center' : 'left',
                        marginBottom: 4,
                     }}
                     onPress={() => open('RefundPolicy')}
                  >
                     Refund Policy
                  </Text>
               )}
            </View>
         </View>
         <Text style={{ color: '#fff' }}>Powered by DailyKIT</Text>
      </View>
   )
}

export default Footer
