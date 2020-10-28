import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Spinner, Text, View } from 'native-base'
import React from 'react'
import { useAppContext } from '../../context/app'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import { CART_BY_PK, UPDATE_CART } from '../../graphql'

const PaymentProcessing = ({ cartId }) => {
   const { visual } = useAppContext()
   const { setIsDrawerOpen, navigation } = useDrawerContext()
   // const navigation = useNavigation()

   const [progress, setProgress] = React.useState('Sending your order...')

   // Subscription
   const { data, loading, error } = useSubscription(CART_BY_PK, {
      skip: Boolean(!cartId),
      variables: {
         id: cartId,
      },
   })

   React.useEffect(() => {
      if (data) {
         switch (data.cartByPK.paymentStatus) {
            case 'PENDING': {
               setProgress('Processing your payment...')
               break
            }
            case 'SUCCEEDED': {
               if (data.cartByPK.status !== 'ORDER_PLACED') {
                  setProgress('Confirming order...')
                  break
               } else {
                  setTimeout(() => {
                     if (navigation) {
                        navigation.navigate('Order', {
                           orderId: data.cartByPK.orderId,
                        })
                        setIsDrawerOpen(false)
                     } else {
                        console.log('Navigation failed!')
                     }
                  }, 2000)
                  break
               }
            }
            case 'FAILED': {
               setProgress('Payment failed :(')
               break
            }
            default: {
               setProgress('Something is not right...')
            }
         }
      }
   }, [data])

   if (data && data.cartByPK.status === 'ORDER_PLACED') {
      return (
         <View
            style={{
               flex: 1,
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: visual.color,
            }}
         >
            <View style={{ marginBottom: 20 }}>
               <Feather name="check-circle" size={48} color="#fff" />
            </View>
            <Text
               style={{
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
               }}
            >
               Order Placed!
            </Text>
         </View>
      )
   }

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <React.Fragment>
            {!error ? (
               <React.Fragment>
                  <Text style={{ marginBottom: 20 }}>Wait! {progress}</Text>
                  <Spinner size="large" />
               </React.Fragment>
            ) : (
               <Text>Unable to fetch live status! Check in your orders.</Text>
            )}
         </React.Fragment>
      </View>
   )
}

export default PaymentProcessing
