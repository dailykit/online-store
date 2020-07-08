import { AntDesign, Feather } from '@expo/vector-icons'
import React, { lazy } from 'react'
import {
   Image,
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { useCartContext } from '../../context/cart'
import { styles } from './styles'
import { useAppContext } from '../../context/app'
import { useSubscription } from '@apollo/react-hooks'
import { ORDER } from '../../graphql'
import { Header } from '../../components'
import { Spinner, Accordion } from 'native-base'
import OrderCard from '../../components/OrderCard'

const Order = ({ route, navigation }) => {
   const { orderId } = route.params

   const { cart } = useCartContext()
   const { visual, brand } = useAppContext()

   // Subscription
   const { data: { order = {} } = {}, loading, error } = useSubscription(
      ORDER,
      {
         variables: {
            id: orderId,
         },
      }
   )

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <Header title={brand.name} navigation={navigation} />
         {loading ? (
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}
            >
               <Spinner />
            </View>
         ) : (
            <ScrollView style={styles.conatiner}>
               <View style={styles.image_container}>
                  <Feather name="check-circle" size={48} color={visual.color} />
               </View>
               <Text
                  style={[styles.order_placed_title, { color: visual.color }]}
               >
                  Order Placed!
               </Text>
               {/* Conditional rendering */}
               {order.fulfillmentType.includes('DELIVERY') ? (
                  <Delivery />
               ) : (
                  <Pickup />
               )}
               {/* Order Details */}
               <View>
                  <OrderCard order={order} />
               </View>
            </ScrollView>
         )}
      </SafeAreaView>
   )
}

export default Order

const Delivery = () => {
   return (
      <View>
         <Text>Delivery</Text>
      </View>
   )
}

const Pickup = () => {
   return (
      <View>
         <Text>Pickup</Text>
      </View>
   )
}
