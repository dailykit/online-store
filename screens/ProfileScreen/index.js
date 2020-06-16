import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import { useCartContext } from '../../context/cart';
import { useDrawerContext } from '../../context/drawer';
import { styles } from './styles';

export default ({ navigation }) => {
  const { customerDetails } = useCartContext();
  const { open } = useDrawerContext();

  return (
    <View style={styles.container}>
      <View style={styles.userDetailsContainer}>
        <View style={styles.avatar}>
          <Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={styles.image}
          />
        </View>
        <Text style={styles.userName}>
          {customerDetails?.firstName + ' ' + customerDetails?.lastName}
        </Text>
      </View>
      <ScrollView style={styles.container}>
        {/* Address card */}
        <TouchableOpacity
          onPress={() => open('EditAddress')}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>My Addresses</Text>
          <Text style={styles.default}>DEFAULT</Text>
          <View style={styles.content}>
            <View style={styles.cardNumberTextContainer}>
              <Text style={styles.cardNumberText}>
                {customerDetails?.defaultCustomerAddress ? (
                  <React.Fragment>
                    {customerDetails.defaultCustomerAddress.line1 +
                      ', ' +
                      customerDetails.defaultCustomerAddress.line2 +
                      ', ' +
                      customerDetails.defaultCustomerAddress.city +
                      ', ' +
                      customerDetails.defaultCustomerAddress.state}
                  </React.Fragment>
                ) : (
                  <React.Fragment>NA</React.Fragment>
                )}
              </Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View>
                <Text>
                  <Ionicons size={20} name='ios-arrow-forward' />
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* Payment Card */}
        <TouchableOpacity
          onPress={() => open('SelectPaymentMethod')}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>My Payment cards</Text>
          <Text style={styles.default}>DEFAULT</Text>
          <View style={styles.content}>
            <View style={styles.cardNumberTextContainer}>
              <Text style={styles.cardNumberText}>
                <AntDesign name='creditcard' /> {'  '}
                XXXX XXXX XXXX{' '}
                {customerDetails?.defaultStripePaymentMethod?.last4 || 'XXXX'}
              </Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View>
                <Text>
                  <Ionicons size={20} name='ios-arrow-forward' />
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* Order History Card */}
        {/* <TouchableOpacity onPress={() => {}} style={styles.card}>
          <Text style={styles.cardTitle}>Order History</Text>
          <View style={styles.content}>
            <View style={styles.cardNumberTextContainer}>
              <Text style={[styles.cardNumberText, { color: 'grey' }]}>
                0 orders so far
              </Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View>
                <Text>
                  <Ionicons size={20} name='ios-arrow-forward' />
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
