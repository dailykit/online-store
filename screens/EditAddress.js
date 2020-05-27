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

export const EditAddress = ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();

  const [loading, setLoading] = React.useState(false);

  // Mutation
  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Address updated!');
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  // Handlers
  const select = (address) => {
    try {
      setLoading(true);
      updateCart({
        variables: {
          id: cart.id,
          set: {
            addressId: address.id,
          },
        },
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (!customerDetails)
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Text>Error loading data!</Text>
      </View>
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
    <View style={styles.conatiner}>
      <HeaderBack navigation={navigation} title='Go Back' />
      <Text style={styles.title}>Choose Address</Text>
      <View style={styles.addressConatiner}>
        {customerDetails.customerAddresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            onPress={() => select(address)}
            style={[
              styles.addressOptionConatiner,
              {
                backgroundColor:
                  address.id === cart.addressId ? '#fff' : '#f3f3f3',
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
                      address.id === cart.addressId ? '#3fa4ff' : '#dedede',
                    backgroundColor:
                      address.id === cart.addressId ? '#3fa4ff' : '#fff',
                  },
                ]}
              >
                {address.id === cart.addressId && (
                  <Feather color='#fff' name='check' />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

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
