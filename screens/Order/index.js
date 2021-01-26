import { useSubscription } from '@apollo/react-hooks'
import { Spinner } from 'react-native'
import React from 'react'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import orderdelivered from '../../assets/imgs/orderdelivered.png'
import orderpickup from '../../assets/imgs/orderpickup.png'
import orderpreparing from '../../assets/imgs/orderpreparing.png'
import { Header } from '../../components'
import Auth from '../../components/error/Auth'
import OrderCard from '../../components/OrderCard'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { useCartContext } from '../../context/cart'
import { ORDER } from '../../graphql'
import { styles } from './styles'
import { Helmet } from 'react-helmet'
import format from 'date-fns/format'

const Order = ({ route, navigation }) => {
   const { orderId } = route.params

   const { cart, customer } = useCartContext()
   const { visual, brand, masterLoading } = useAppContext()

   // Subscription
   const { data: { order = {} } = {}, loading, error } = useSubscription(
      ORDER,
      {
         variables: {
            id: orderId.toString(),
         },
      }
   )

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (!customer) {
      return <Auth navigation={navigation} />
   }

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <Helmet>
            <title>Order | {visual.appTitle}</title>
         </Helmet>
         <Header title="Home" navigation={navigation} />
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
            <>
               {Object.keys(order).length > 0 ? (
                  <ScrollView style={{ flex: 1 }}>
                     <View style={styles.container}>
                        {/* Order Heading */}
                        <View style={styles.orderHeading}>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                              }}
                           >
                              <Text style={{ color: '#666' }}>Order ID:</Text>
                              <Text
                                 style={{ fontWeight: 'bold', fontSize: 18 }}
                              >
                                 {' '}
                                 {order.id}
                              </Text>
                           </View>
                           <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: '#666' }}>
                                 Ordererd on:
                              </Text>
                              <Text
                                 style={{
                                    fontWeight: 'bold',
                                 }}
                              >
                                 {' '}
                                 {format(new Date(order?.created_at), 'PPp')}
                              </Text>
                           </View>
                        </View>
                        {/* Conditional rendering */}
                        <View
                           style={{
                              marginBottom: 20,
                           }}
                        >
                           {order?.fulfillmentType?.includes(
                              'DELIVERY'
                           ) ? null : ( // <Delivery order={order} />
                              <Pickup order={order} />
                           )}
                        </View>
                        {/* Order Details */}
                        <View
                           style={{
                              marginBottom: 20,
                           }}
                        >
                           <OrderCard less order={order} />
                        </View>
                     </View>
                  </ScrollView>
               ) : (
                  <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Text style={{ fontSize: '1.1rem' }}>
                        Are you sure that order ID is correct?
                     </Text>
                  </View>
               )}
            </>
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
         default:
            return 'Your order is almost ready!'
      }
   }

   return (
      <View>
         {/* show until order is not delivered */}
         {order.orderStatus !== 'DELIVERED' && (
            <>
               {/* Map */}
               {order.deliveryInfo.tracking.location.isAvailable && (
                  <MapView
                     provider="google"
                     region={{
                        latitude: +order.deliveryInfo.tracking.location
                           .latitude,
                        longitude: +order.deliveryInfo.tracking.location
                           .longitude,
                     }}
                     style={styles.map}
                  >
                     <MapView.Marker
                        coordinate={{
                           latitude: +order.deliveryInfo.pickup.pickupInfo
                              .organizationAddress.latitude,
                           longitude: +order.deliveryInfo.pickup.pickupInfo
                              .organizationAddress.longitude,
                        }}
                        icon={require('../../assets/imgs/restaurant @1x.png')}
                     />
                     <MapView.Marker
                        coordinate={{
                           latitude: +order.deliveryInfo.tracking.location
                              .latitude,
                           longitude: +order.deliveryInfo.tracking.location
                              .longitude,
                        }}
                        icon={require('../../assets/imgs/location delivery truck @1x.png')}
                     />
                     <MapView.Marker
                        coordinate={{
                           latitude: +order.deliveryInfo.dropoff.dropoffInfo
                              .customerAddress.latitude,
                           longitude: +order.deliveryInfo.dropoff.dropoffInfo
                              .customerAddress.longitude,
                        }}
                        icon={require('../../assets/imgs/location home @1x.png')}
                     />
                  </MapView>
               )}
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
                  <Text style={styles.trackingCode}>
                     You can also track your order here:
                     {order.deliveryInfo.tracking.code.url}
                  </Text>
               )}
            </>
         )}
         {/* Delivery Guy */}
         {order.deliveryInfo.assigned.status.value === 'SUCCEEDED' ? (
            <View style={styles.deliveryGuy}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        marginRight: 8,
                     }}
                     source={{
                        uri:
                           order.deliveryInfo.assigned.driverInfo.driverPicture,
                     }}
                  />
                  <Text style={{ fontWeight: 'bold' }}>
                     {order.deliveryInfo.assigned.driverInfo.driverFirstName}
                     {order.orderStatus !== 'DELIVERED'
                        ? ' will be delivering your order.'
                        : ' delivered your order.'}
                  </Text>
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'flex-end',
                  }}
               >
                  <Text style={{ marginRight: 8 }}>
                     {order.deliveryInfo.deliveryCompany.name}
                  </Text>
                  <Image
                     style={{ height: 40, width: 40 }}
                     source={{ uri: order.deliveryInfo.deliveryCompany.logo }}
                  />
               </View>
            </View>
         ) : (
            <View style={styles.deliveryGuy}>
               <Text>Waiting for delivery partner to be assigned...</Text>
            </View>
         )}
      </View>
   )
}

const Pickup = ({ order }) => {
   const address = order.deliveryInfo.pickup.pickupInfo.organizationAddress

   const renderOrderStatus = status => {
      switch (status) {
         case 'PENDING':
            return 'Order confirmed!'
         case 'UNDER_PROCESSING':
            return 'Your order is being prepared!'
         case 'READY_TO_DISPATCH':
            return 'Your order is ready! Waiting for you to pickup...'
         case 'DELIVERED':
            return 'Your order has been picked up!'
         default:
            return 'Awaiting pickup!'
      }
   }

   return (
      <View>
         {/* show until order is not delivered */}
         {order.orderStatus !== 'DELIVERED' && (
            <>
               {/* Restaurant Map */}
               <MapView
                  provider="google"
                  initialRegion={{
                     latitude: +address.latitude,
                     longitude: +address.longitude,
                  }}
                  style={styles.map}
               >
                  <MapView.Marker
                     coordinate={{
                        latitude: +address.latitude,
                        longitude: +address.longitude,
                     }}
                     title={
                        order.deliveryInfo.pickup.pickupInfo.organizationName
                     }
                     description="Pickup order from here!"
                     icon={require('../../assets/imgs/restaurant @2x .png')}
                  />
               </MapView>
               {/* Order Status */}
               <View style={styles.orderStatus}>
                  <Text style={styles.orderStatusText}>
                     {renderOrderStatus(order.orderStatus)}
                  </Text>
               </View>
            </>
         )}
         {/* Restaurant Address */}
         <View style={styles.address}>
            <Text style={{ color: '#666' }}>Pickup location:</Text>
            <Text style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
               {order.deliveryInfo.pickup.pickupInfo.organizationName}
            </Text>
            <Text>{address.line1}</Text>
            <Text>{address.line2}</Text>
            <Text>{`${address.city}, ${address.state}, ${address.country}`}</Text>
            <Text>{address.zipcode}</Text>
            <Text>
               Phone: {order.deliveryInfo.pickup.pickupInfo.organizationPhone}
            </Text>
         </View>
      </View>
   )
}
