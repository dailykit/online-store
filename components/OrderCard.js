import * as moment from 'moment'
import { Accordion } from 'native-base'
import React from 'react'
import { Image, Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import defaultProductImage from '../assets/imgs/default-product-image.png'
import { CURRENCY } from 'react-native-dotenv'
// 12

const OrderCard = ({ order, less }) => {
   const whatColor = status => {
      switch (status) {
         case 'PENDING':
            return '#F6AD55'
         case 'UNDER_PROCESSING':
            return '#F6AD55'
         case 'READY_TO_DISPATCH':
            return '#3C91E6'
         case 'OUT_FOR_DELIVERY':
            return '#1EA896'
         case 'DELIVERED':
            return '#48BB78'
         default:
            return '#aaa'
      }
   }

   const whatTitle = (status, type) => {
      switch (status) {
         case 'PENDING':
            return 'PENDING'
         case 'UNDER_PROCESSING':
            return 'BEING PREPARED'
         case 'READY_TO_DISPATCH':
            return 'READY'
         case 'OUT_FOR_DELIVERY':
            if (type.includes('DELIVERY')) {
               return 'ON THE WAY'
            } else {
               return 'AWAITING PICKUP'
            }
         case 'DELIVERED':
            if (type.includes('DELIVERY')) {
               return 'DELIVERED'
            } else {
               return 'PICKED UP'
            }
         default:
            return 'CALL US'
      }
   }

   String.prototype.SRPType = function () {
      return this === 'readyToEat' ? 'Ready to Eat' : 'Meal Kit'
   }

   return (
      <>
         {!less && (
            <>
               <View style={styles.head}>
                  <Text style={styles.title}>Order ID: {order?.id}</Text>
                  <Text
                     style={[
                        styles.status,
                        {
                           backgroundColor: whatColor(order.orderStatus),
                        },
                     ]}
                  >
                     {whatTitle(order.orderStatus, order.fulfillmentType)}
                  </Text>
               </View>
               <Text style={[styles.muted, styles.bold]}>
                  Ordered on:{' '}
                  <Text style={styles.lite}>
                     {moment(order?.created_at).format('LLLL')}
                  </Text>
               </Text>
               {order.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress && (
                  <Text style={styles.muted}>
                     {order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        ?.line1 +
                        ', ' +
                        order?.deliveryInfo?.dropoff?.dropoffInfo
                           ?.customerAddress?.line2 +
                        ', ' +
                        order?.deliveryInfo?.dropoff?.dropoffInfo
                           ?.customerAddress?.city +
                        ', ' +
                        order?.deliveryInfo?.dropoff?.dropoffInfo
                           ?.customerAddress?.state +
                        ', ' +
                        order?.deliveryInfo?.dropoff?.dropoffInfo
                           ?.customerAddress?.country}{' '}
                     -{' '}
                     {
                        order?.deliveryInfo.dropoff?.dropoffInfo
                           ?.customerAddress?.zipcode
                     }
                  </Text>
               )}
            </>
         )}
         <Accordion
            headerStyle={styles.header}
            expanded={less ? 0 : null}
            dataArray={[
               {
                  title: `${
                     order.orderCart.cartInfo.products.length || 'NA'
                  }  Item${
                     order.orderCart.cartInfo.products.length > 1 ? 's' : ''
                  }`,
                  content: (
                     <View style={{ width: '100%' }}>
                        {order.orderCart.cartInfo.products.map(product => (
                           <View style={styles.product}>
                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                 }}
                              >
                                 <Image
                                    source={{
                                       uri:
                                          product.image || defaultProductImage,
                                    }}
                                    style={{
                                       height: 60,
                                       width: 60,
                                       resizeMode: 'cover',
                                       marginRight: 8,
                                       borderRadius: 4,
                                    }}
                                 />
                                 <View style={styles.productInfo}>
                                    <Text>{product.name}</Text>
                                    <View
                                       style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                       }}
                                    >
                                       <Text
                                          style={styles.productOption}
                                          ellipsizeMode="tail"
                                          numberOfLines={1}
                                       >
                                          {product.type ===
                                             'simpleRecipeProduct' &&
                                             `${product.option.type?.SRPType()} x${
                                                product.option.serving
                                             }`}
                                          {product.type ===
                                             'inventoryProduct' &&
                                             `${product.option.label}`}
                                       </Text>
                                       <Text style={styles.quantity}>
                                          Qty: {product.quantity}
                                       </Text>
                                    </View>
                                 </View>
                              </View>
                              <Text style={styles.productPrice}>
                                 {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: CURRENCY,
                                 }).format(product.totalPrice.toFixed(2))}
                              </Text>
                           </View>
                        ))}
                     </View>
                  ),
               },
               {
                  title: 'Bill Details',
                  content: (
                     <View style={styles.rowContainer}>
                        <View style={styles.row}>
                           <Text>Txn ID</Text>
                           <Text>{order.transactionId}</Text>
                        </View>
                        <View style={styles.row}>
                           <Text>Item Total</Text>
                           <Text>
                              {new Intl.NumberFormat('en-US', {
                                 style: 'currency',
                                 currency: CURRENCY,
                              }).format(order.itemTotal)}
                           </Text>
                        </View>
                        {order.tip && (
                           <View style={styles.row}>
                              <Text>Tip</Text>
                              <Text>
                                 {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: CURRENCY,
                                 }).format(order.tip)}
                              </Text>
                           </View>
                        )}
                        <View style={styles.row}>
                           <Text>Delivery Price</Text>
                           <Text>
                              {new Intl.NumberFormat('en-US', {
                                 style: 'currency',
                                 currency: CURRENCY,
                              }).format(order.deliveryPrice)}
                           </Text>
                        </View>
                        <View style={styles.row}>
                           <Text>Tax</Text>
                           <Text>
                              {new Intl.NumberFormat('en-US', {
                                 style: 'currency',
                                 currency: CURRENCY,
                              }).format(order.tax)}
                           </Text>
                        </View>
                     </View>
                  ),
               },
            ]}
         />
         <View style={styles.flexContainer}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>
               {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: CURRENCY,
               }).format(order?.amountPaid)}
            </Text>
         </View>
      </>
   )
}

export default OrderCard

const styles = EStyleSheet.create({
   head: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
   },
   status: {
      backgroundColor: '#aaa',
      color: '#fff',
      borderRadius: 2,
      padding: 5,
   },
   title: {
      fontWeight: 'bold',
      fontSize: '$m',
   },
   muted: {
      color: 'gray',
      fontSize: '$s',
      marginBottom: 10,
   },
   bold: {
      fontWeight: 'bold',
   },
   lite: {
      fontWeight: 'normal',
   },
   flexContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
   },
   total: {
      fontWeight: 'bold',
      fontSize: '$m',
      marginTop: 10,
   },
   header: {
      backgroundColor: '#fff',
   },
   rowContainer: {
      flex: 1,
      width: '100%',
   },
   row: {
      marginBottom: 5,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   product: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginBottom: 10,
      width: '100%',
   },
   productInfo: {
      fontSize: '$m',
      flex: 1,
   },
   productOption: {
      fontSize: '$s',
      color: '#666',
   },
   quantity: {
      fontSize: '$s',
      color: '#666',
      marginLeft: 16,
   },
   productPrice: {
      fontSize: '$m',
   },
})
