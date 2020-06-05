import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ORDER } from '../graphql';

const OrderDetails = ({ orderId }) => {
   // Query
   const { data, loading, error } = useQuery(ORDER, {
      variables: {
         id: orderId.toString(),
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
         <View style={styles.center}>
            <Text>
               Oops! We could not get order details. Check in orders section.
            </Text>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <View style={styles.row}>
            <Text style={styles.heading}>Order Details</Text>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Name: </Text>
               <Text>
                  {data.order.deliveryInfo.dropoff.dropoffInfo
                     .customerFirstName +
                     ' ' +
                     data.order.deliveryInfo.dropoff.dropoffInfo
                        .customerLastName}
               </Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Email: </Text>
               <Text>
                  {data.order.deliveryInfo.dropoff.dropoffInfo.customerEmail}
               </Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Phone: </Text>
               <Text>
                  {data.order.deliveryInfo.dropoff.dropoffInfo.customerPhone}
               </Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Address: </Text>
            </View>
            <View style={styles.data}>
               <Text>
                  {data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                     .line1 +
                     ', ' +
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .line2 +
                     ', ' +
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .city +
                     ', ' +
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .state +
                     ', ' +
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .country}
               </Text>
            </View>
            <View style={styles.data}>
               <Text>
                  {
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .zipcode
                  }
               </Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Delivery Instructions: </Text>
            </View>
            <View style={styles.data}>
               <Text>
                  {
                     data.order.deliveryInfo.dropoff.dropoffInfo.customerAddress
                        .notes
                  }
               </Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={styles.data}>
               <Text style={styles.title}>Amount paid: </Text>
               <Text>$ {data.order.itemTotal}</Text>
            </View>
         </View>
      </View>
   );
};

export default OrderDetails;

const styles = StyleSheet.create({
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      padding: 16,
   },
   heading: {
      color: '#666',
      fontSize: 14,
   },
   data: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   title: {
      color: '#aaa',
   },
   row: {
      marginBottom: 8,
   },
});
