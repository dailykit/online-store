import { useQuery } from '@apollo/react-hooks';
import { Divider, Spinner } from '@ui-kitten/components';
import * as moment from 'moment';
import { Accordion } from 'native-base';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import { useCartContext } from '../../context/cart';
import { ORDERS } from '../../graphql';
import { styles } from './styles';

const dataArray = [
   { title: '3 items', content: 'Lorem ipsum dolor sit amet' },
   { title: 'Bill Details', content: 'Lorem ipsum dolor sit amet' },
];
export default ({ navigation }) => {
   const { customer } = useCartContext();

   // Query
   const { data, loading, error } = useQuery(ORDERS, {
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
            <HeaderBack title="Order History" navigation={navigation} />
            <View style={styles.center}>
               <Text>Oops! We could not get orders. Check again later!</Text>
            </View>
         </>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <HeaderBack title="Order History" navigation={navigation} />
         {data?.orders
            .filter(order => order?.deliveryInfo)
            .map(order => (
               <>
                  <TouchableOpacity
                     key={order?.id}
                     // onPress={() => navigation.navigate('DeliveryScreen')}
                     style={styles.card}
                  >
                     <Text style={styles.title}>Order ID: {order?.id}</Text>
                     <Text style={[styles.muted, styles.bold]}>
                        Ordered on:{' '}
                        <Text style={styles.lite}>
                           {moment(order?.created_at).format('LLLL')}
                        </Text>
                     </Text>
                     <Text style={[styles.muted, styles.bold]}>
                        Deliver on: <Text style={styles.lite}>NA</Text>
                     </Text>
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
                        dataArray={dataArray}
                        expanded={0}
                     />
                     <View style={styles.flexContainer}>
                        <Text style={styles.total}>Total</Text>
                        <Text style={styles.total}>$ {order?.itemTotal}</Text>
                     </View>
                  </TouchableOpacity>
                  <Divider />
               </>
            ))}
      </ScrollView>
   );
};

