import React from 'react';
import * as moment from 'moment';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { Accordion } from 'native-base';
import { Divider, Spinner } from '@ui-kitten/components';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ScrollView } from 'react-native';
import { ORDERS } from '../graphql';
import { useSubscription } from '@apollo/react-hooks';
import { useCartContext } from '../context/cart';

const OrderHistory = ({ navigation }) => {
   const { customer } = useCartContext();

   const whatColor = status => {
      switch (status) {
         case 'PENDING':
            return '#F6AD55';
         case 'READY_TO_DISPATCH':
            return '#4299E1';
         case 'DELIVERED':
            return '#48BB78';
         default:
            return '#aaa';
      }
   };

   // Query
   const { data, loading, error } = useSubscription(ORDERS, {
      variables: {
         id: customer?.id,
      },
   });

   if (loading) {
      return (
         <View style={styles.center}>
            <Spinner />
         </View>
      );
   }

   if (error) {
      return (
         <>
            <View style={styles.center}>
               <Text>Oops! We could not get orders. Check again later!</Text>
            </View>
         </>
      );
   }

   return (
      <>
         <Text style={styles.heading}>Orders</Text>
         <ScrollView style={styles.container}>
            {data?.orders
               .filter(order => order?.deliveryInfo)
               .map(order => (
                  <>
                     <TouchableOpacity
                        key={order?.id}
                        // onPress={() => navigation.navigate('DeliveryScreen')}
                        style={styles.card}
                     >
                        <View style={styles.head}>
                           <Text style={styles.title}>
                              Order ID: {order?.id}
                           </Text>
                           <Text
                              style={[
                                 styles.status,
                                 {
                                    backgroundColor: whatColor(
                                       order.orderStatus
                                    ),
                                 },
                              ]}
                           >
                              {order.orderStatus.replace(/_/g, ' ')}
                           </Text>
                        </View>
                        <Text style={[styles.muted, styles.bold]}>
                           Ordered on:{' '}
                           <Text style={styles.lite}>
                              {moment(order?.created_at).format('LLLL')}
                           </Text>
                        </Text>
                        {/* <Text style={[styles.muted, styles.bold]}>
                           Deliver on: <Text style={styles.lite}>NA</Text>
                        </Text> */}
                        <Text style={styles.muted}>
                           {order?.deliveryInfo?.dropoff?.dropoffInfo
                              ?.customerAddress?.line1 +
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
                        <Accordion
                           headerStyle={styles.header}
                           dataArray={[
                              {
                                 title: `${
                                    order.orderInventoryProducts.length +
                                    order.orderMealKitProducts.length +
                                    order.orderReadyToEatProducts.length
                                 }  Item(s)`,
                                 content: (
                                    <View style={{ width: '100%' }}>
                                       {order.orderInventoryProducts.map(
                                          product => (
                                             <View style={styles.product}>
                                                <View
                                                   style={styles.productInfo}
                                                >
                                                   <Text>
                                                      {
                                                         product
                                                            .inventoryProduct
                                                            .name
                                                      }
                                                   </Text>
                                                   <Text
                                                      style={
                                                         styles.productOption
                                                      }
                                                   >
                                                      {
                                                         product
                                                            .inventoryProductOption
                                                            .label
                                                      }
                                                   </Text>
                                                </View>
                                                <Text
                                                   style={styles.productPrice}
                                                >
                                                   ${' '}
                                                   {
                                                      product
                                                         .inventoryProductOption
                                                         .price[0].value
                                                   }
                                                </Text>
                                             </View>
                                          )
                                       )}
                                       {order.orderMealKitProducts.map(
                                          product => (
                                             <View style={styles.product}>
                                                <View
                                                   style={styles.productInfo}
                                                >
                                                   <Text>
                                                      {
                                                         product
                                                            .simpleRecipeProduct
                                                            .name
                                                      }
                                                   </Text>
                                                   <Text
                                                      style={
                                                         styles.productOption
                                                      }
                                                   >
                                                      Meal Kit Serving:{' '}
                                                      {
                                                         product
                                                            .simpleRecipeProductOption
                                                            .simpleRecipeYield
                                                            .yield.serving
                                                      }
                                                   </Text>
                                                </View>
                                                <Text
                                                   style={styles.productPrice}
                                                >
                                                   ${' '}
                                                   {
                                                      product
                                                         .simpleRecipeProductOption
                                                         .price[0].value
                                                   }
                                                </Text>
                                             </View>
                                          )
                                       )}
                                       {order.orderReadyToEatProducts.map(
                                          product => (
                                             <View style={styles.product}>
                                                <View
                                                   style={styles.productInfo}
                                                >
                                                   <Text>
                                                      {
                                                         product
                                                            .simpleRecipeProduct
                                                            .name
                                                      }
                                                   </Text>
                                                   <Text
                                                      style={
                                                         styles.productOption
                                                      }
                                                   >
                                                      Ready to Eat Serving:{' '}
                                                      {
                                                         product
                                                            .simpleRecipeProductOption
                                                            .simpleRecipeYield
                                                            .yield.serving
                                                      }
                                                   </Text>
                                                </View>
                                                <Text
                                                   style={styles.productPrice}
                                                >
                                                   ${' '}
                                                   {
                                                      product
                                                         .simpleRecipeProductOption
                                                         .price[0].value
                                                   }
                                                </Text>
                                             </View>
                                          )
                                       )}
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
                                          <Text>Delivery Price</Text>
                                          <Text>$ {order.deliveryPrice}</Text>
                                       </View>
                                       {order.tip && (
                                          <View style={styles.row}>
                                             <Text>Tip</Text>
                                             <Text>$ {order.tip}</Text>
                                          </View>
                                       )}
                                       <View style={styles.row}>
                                          <Text>Tax</Text>
                                          <Text>$ {order.tax}</Text>
                                       </View>
                                       <View style={styles.row}>
                                          <Text>Total Price</Text>
                                          <Text>$ {order.itemTotal}</Text>
                                       </View>
                                    </View>
                                 ),
                              },
                           ]}
                        />
                        <View style={styles.flexContainer}>
                           <Text style={styles.total}>Total</Text>
                           <Text style={styles.total}>
                              $ {order?.itemTotal}
                           </Text>
                        </View>
                     </TouchableOpacity>
                     <Divider />
                  </>
               ))}
         </ScrollView>
      </>
   );
};

export default OrderHistory;

const styles = EStyleSheet.create({
   heading: {
      fontSize: 20,
      fontWeight: 500,
      color: '#666',
      paddingVertical: 12,
   },
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   card: {
      padding: 15,
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
      marginBottom: 10,
   },
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
      fontSize: '$l',
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
      fontSize: '$l',
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
      flex: 1,
      marginBottom: 10,
      width: '100%',
   },
   productInfo: {
      fontSize: '$xs',
      flex: 1,
   },
   productOption: {
      fontSize: '$xxs',
      color: '#666',
   },
   productPrice: {
      fontSize: '$s',
   },
});
