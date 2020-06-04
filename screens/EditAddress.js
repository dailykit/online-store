import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Dimensions,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { useCartContext } from '../context/cart';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_CART } from '../graphql';
import { Spinner } from '@ui-kitten/components';

import { height, width } from '../utils/Scalaing';
import { Button } from 'native-base';
import { useAppContext } from '../context/app';
import { ScrollView } from 'react-native-gesture-handler';
import { useDrawerContext } from '../context/drawer';

const EditAddress = ({ navigation }) => {
   const { cart, customerDetails } = useCartContext();
   const { visual } = useAppContext();
   const { open } = useDrawerContext();

   const [loading, setLoading] = React.useState(false);

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Address updated!');
         navigation.goBack();
      },
      onError: error => {
         console.log(error);
         setLoading(false);
      },
   });

   // Handlers
   const select = address => {
      try {
         if (cart) {
            setLoading(true);
            updateCart({
               variables: {
                  id: cart.id,
                  set: {
                     address: address,
                  },
               },
            });
         }
      } catch (error) {
         setLoading(false);
         console.log(error);
      }
   };

   if (!customerDetails)
      return (
         <ScrollView style={styles.conatiner}>
            <Text style={styles.title}>Addresses</Text>
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}
               onPress={() => navigation.goBack()}
            >
               <Button
                  style={{
                     marginBottom: 20,
                     backgroundColor: visual.color || '#3FA4FF',
                     borderRadius: 0,
                     marginHorizontal: 10,
                     padding: 8,
                     justifyContent: 'center',
                  }}
                  onPress={() => open('AddDetails', { path: 'address/create' })}
               >
                  <Text style={{ color: '#fff' }}>Add Address</Text>
               </Button>
            </View>
         </ScrollView>
      );

   if (loading)
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: ' center' }}
            onPress={() => navigation.goBack()}
         >
            <Spinner />
         </View>
      );

   return (
      <ScrollView style={styles.conatiner}>
         <Text style={styles.title}>Addresses</Text>
         <View style={styles.addressConatiner}>
            {customerDetails?.customerAddresses.map(address => (
               <TouchableOpacity
                  key={address.id}
                  onPress={() => select(address)}
                  style={[
                     styles.addressOptionConatiner,
                     {
                        backgroundColor:
                           address === cart?.address ? '#fff' : '#f3f3f3',
                     },
                  ]}
               >
                  <View style={styles.addressTextContainer}>
                     <Text style={styles.addressText}>{address.line1}</Text>
                     <Text style={styles.addressText}>{address.line2}</Text>
                     <Text style={styles.addressText}>
                        {address.city + ', ' + address.state}
                     </Text>
                     <Text style={styles.addressText}>{address.country}</Text>
                     <Text style={styles.addressText}>{address.zipcode}</Text>
                  </View>
                  <View style={styles.addressSelectedContainer}>
                     <View
                        style={[
                           styles.checkContainer,
                           {
                              borderWidth: 1,
                              borderColor:
                                 address.id === cart.address.id
                                    ? visual.color
                                    : '#dedede',
                              backgroundColor:
                                 address.id === cart.address.id
                                    ? visual.color
                                    : '#fff',
                           },
                        ]}
                     >
                        {address.id === cart.address.id && (
                           <Feather color="#fff" name="check" />
                        )}
                     </View>
                  </View>
               </TouchableOpacity>
            ))}
         </View>
         <Button
            style={{
               marginBottom: 20,
               backgroundColor: visual.color || '#3FA4FF',
               borderRadius: 0,
               marginHorizontal: 10,
               padding: 8,
               justifyContent: 'center',
            }}
            onPress={() => open('AddDetails', { path: 'address/create' })}
         >
            <Text style={{ color: '#fff' }}>Add Address</Text>
         </Button>
      </ScrollView>
   );
};

export default EditAddress;

const styles = EStyleSheet.create({
   conatiner: {
      flex: 1,
      backgroundColor: '#fff',
   },
   title: {
      fontSize: '$xl',
      padding: 20,
   },
   addressConatiner: {
      flexDirection: 'column',
      flex: 1,
   },
   addressOptionConatiner: {
      justifyContent: 'center',
      height: height * 0.12,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#dedede',
      marginBottom: 4,
      padding: 8,
   },
   addressTextContainer: {
      flex: 3,
      justifyContent: 'center',
   },
   addressText: {
      width: width * 0.7,
      paddingLeft: 20,
   },
   addressSelectedContainer: {
      flex: 1,
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
});
