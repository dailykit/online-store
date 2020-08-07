import { AntDesign, Ionicons, Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useCartContext } from '../context/cart'

import { height, width } from '../utils/Scalaing'
import { useDrawerContext } from '../context/drawer'

export const DefaultPaymentFloater = ({ navigation }) => {
   const { cart, customerDetails } = useCartContext()
   const { open } = useDrawerContext()
   const [card, setCard] = React.useState(undefined)

   React.useEffect(() => {
      if (cart?.paymentMethodId && customerDetails) {
         const card = customerDetails.stripePaymentMethods.find(
            card => card.stripePaymentMethodId === cart.paymentMethodId
         )
         if (card) {
            setCard(card)
         }
      }
   }, [cart?.paymentMethodId, customerDetails])

   return (
      <TouchableOpacity
         onPress={() => {
            customerDetails?.stripePaymentMethods?.length
               ? open('SelectPaymentMethod')
               : open('AddDetails', { path: 'card/create' })
         }}
         style={styles.conatiner}
      >
         <View style={styles.cardNumberTextContainer}>
            {card ? (
               <Text style={styles.cardNumberText}>
                  <AntDesign name="creditcard" /> {'  '}
                  XXXX XXXX XXXX {card.last4}
               </Text>
            ) : (
               <Text style={styles.cardNumberText}>
                  {customerDetails?.stripePaymentMethods?.length
                     ? 'Select a Card'
                     : 'Add a Card'}
               </Text>
            )}
         </View>
         <View style={styles.cardNumberSelectedContainer}>
            <View>
               <Feather
                  name="edit"
                  size={width > 768 ? 24 : 16}
                  color="#93959F"
               />
            </View>
         </View>
      </TouchableOpacity>
   )
}

export const DefaultAddressFloater = ({ navigation }) => {
   const { cart, customerDetails } = useCartContext()
   const { open } = useDrawerContext()

   return (
      <TouchableOpacity
         onPress={() => {
            customerDetails?.customerAddresses?.length
               ? open('EditAddress')
               : open('AddDetails', { path: 'address/create' })
         }}
         style={styles.conatiner}
      >
         <View style={styles.cardNumberTextContainer}>
            {cart?.address ? (
               <Text style={styles.cardNumberText}>
                  {cart.address.line1}, {cart.address.line2},{' '}
                  {cart.address.city}
               </Text>
            ) : (
               <Text style={styles.cardNumberText}>
                  {customerDetails?.customerAddresses?.length
                     ? 'Select an Address'
                     : 'Add an Address'}
               </Text>
            )}
         </View>
         <View style={styles.cardNumberSelectedContainer}>
            <View>
               <Feather
                  name="edit"
                  size={width > 768 ? 24 : 16}
                  color="#93959F"
               />
            </View>
         </View>
      </TouchableOpacity>
   )
}

const styles = EStyleSheet.create({
   conatiner: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      padding: 8,
      borderRadius: 2,
   },
   title: {
      fontSize: '$m',
      padding: 20,
   },
   cardNumberConatiner: {
      flexDirection: 'column',
   },
   cardNumberOptionConatiner: {
      justifyContent: 'center',
      height: height * 0.12,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#dedede',
      marginBottom: 4,
   },
   cardNumberTextContainer: {
      justifyContent: 'center',
      alignItems: 'center',
   },
   cardNumberText: {
      width: 'auto',
   },
   cardNumberSelectedContainer: {
      justifyContent: 'center',
      alignItems: 'center',
   },
   checkContainer: {
      backgroundColor: '#3fa4ff',
      height: 24,
      width: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
   },
})
