import { AntDesign, Feather } from '@expo/vector-icons'
import React from 'react'
import { SafeAreaView, ScrollView, Text, View, Image } from 'react-native'
import { useCartContext } from '../../context/cart'
import { styles } from './styles'
import { useAppContext } from '../../context/app'
import { useSubscription } from '@apollo/react-hooks'
import { ORDER } from '../../graphql'
import { Header } from '../../components'
import { Spinner } from 'native-base'
import OrderCard from '../../components/OrderCard'
import orderdelivered from '../../assets/imgs/orderdelivered.png'
import orderpickup from '../../assets/imgs/orderpickup.png'
import orderpreparing from '../../assets/imgs/orderpreparing.png'

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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
            <ScrollView style={{ flex: 1 }}>
               <View style={styles.container}>
                  {/* <View style={{ marginBottom: 20 }}>
                     <View style={styles.image_container}>
                        <Feather
                           name="check-circle"
                           size={48}
                           color={visual.color}
                        />
                     </View>
                     <Text
                        style={[
                           styles.order_placed_title,
                           { color: visual.color },
                        ]}
                     >
                        Order Placed!
                     </Text>
                  </View> */}
                  {/* Conditional rendering */}
                  <View
                     style={{
                        marginBottom: 20,
                     }}
                  >
                     {order.fulfillmentType.includes('DELIVERY') ? (
                        <Delivery order={order} />
                     ) : (
                        <Pickup />
                     )}
                  </View>
                  {/* Order Details */}
                  <View
                     style={{
                        marginBottom: 20,
                     }}
                  >
                     <OrderCard order={order} />
                  </View>
               </View>
            </ScrollView>
         )}
      </SafeAreaView>
   )
}

export default Order

const Delivery = ({ order }) => {
   const renderOrderStatus = status => {
      switch (status) {
         case 'PENDING':
            return 'Order confirmed!'
         case 'UNDER_PROCESSING':
            return 'Your order is being prepared!'
         case 'READY_TO_DISPATCH':
            return 'Your order is ready! Waiting for delivery partner...'
         case 'OUT_FOR_DELIVERY':
            return 'Your order is out for delivery!'
         case 'DELIVERED':
            return 'Your order has been delivered!'
      }
   }

   return (
      <View>
         {/* Map */}
         {order.deliveryInfo.tracking.location.isAvailable && <View></View>}
         {/* Illustration */}
         <View style={styles.orderStatus}>
            <View style={styles.orderStatusIllustration}>
               <View
                  style={[
                     styles.orderStatusImageContainer,
                     {
                        backgroundColor: [
                           'PENDING',
                           'UNDER_PROCESSING',
                           'READY_TO_DISPATCH',
                           'OUT_FOR_DELIVERY',
                           'DELIVERED',
                        ].includes(order.orderStatus)
                           ? '#ddefff'
                           : '#fff',
                     },
                  ]}
               >
                  <Image
                     source={orderpreparing}
                     style={{ height: '80%', width: '80%' }}
                  />
               </View>
               <View
                  style={[
                     styles.orderStatusImageContainer,
                     {
                        backgroundColor: [
                           'OUT_FOR_DELIVERY',
                           'DELIVERED',
                        ].includes(order.orderStatus)
                           ? '#ddefff'
                           : '#fff',
                     },
                  ]}
               >
                  <Image
                     source={orderpickup}
                     style={{ height: '80%', width: '80%' }}
                  />
               </View>
               <View
                  style={[
                     styles.orderStatusImageContainer,
                     {
                        backgroundColor: ['DELIVERED'].includes(
                           order.orderStatus
                        )
                           ? '#ddefff'
                           : '#fff',
                     },
                  ]}
               >
                  <Image
                     source={orderdelivered}
                     style={{ height: '80%', width: '80%' }}
                  />
               </View>
            </View>
            <Text style={styles.orderStatusText}>
               {renderOrderStatus(order.orderStatus)}
            </Text>
         </View>
         {/* Tracking Code */}
         {order.deliveryInfo.tracking.code.isAvailable && (
            <Text>
               You can also track your order here:
               {order.deliveryInfo.tracking.code.url}
            </Text>
         )}
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
