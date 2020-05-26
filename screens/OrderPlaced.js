import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import Summary from '../components/Summary';
import { CartSummary } from '../components/Cart';
import BillingDetails from '../components/BillingDetails';
import HeaderBack from '../components/HeaderBack';
import { useCartContext } from '../context/cart';
import EStyleSheet from 'react-native-extended-stylesheet';

const { width, height } = Dimensions.get('window');

const OrderPlaced = ({ navigation }) => {
  const { cart } = useCartContext();

  const cartItems = cart?.cartInfo?.products;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBack title='Go Back' navigation={navigation} />
      <ScrollView style={styles.conatiner}>
        <View style={styles.image_container}>
          <Image
            style={styles.image}
            source={require('../assets/imgs/check-circle.png')}
          />
        </View>
        <Text style={styles.order_placed_title}>Order Placed!</Text>
        <Text
          style={[styles.time_text, { textAlign: 'center', marginBottom: 10 }]}
        >
          Your order has been place. Your receipt will shortly be emailed to
          you.
        </Text>
        <View style={styles.title_container}>
          <View style={styles.title_container_left}>
            <Text style={styles.deliver_on_text}>Deliver on</Text>
            <Text style={styles.time_text}>Monday, Dec 9</Text>
          </View>
          <View style={styles.title_container_middle}>
            <Text style={[styles.time_text, { textAlign: 'center', flex: 1 }]}>
              9am - 10am
            </Text>
          </View>
          <View style={styles.title_container_right}>
            <View style={styles.edit}></View>
          </View>
        </View>
        <View style={[styles.title_container, { paddingLeft: 20 }]}>
          <Text style={styles.time_text}>
            123, some address, somewhere, california - 90922
          </Text>
        </View>
        <View style={styles.summary_title_conatiner}>
          <View style={styles.summary_title_conatiner_left}>
            <Text style={styles.summary_title_text}>Order Summary</Text>
          </View>
          <View style={styles.summary_title_conatiner_right}>
            <Text style={[styles.summary_title_text, { textAlign: 'right' }]}>
              3 products
            </Text>
          </View>
        </View>
        {cartItems.map((item, index) => {
          return <Summary useQuantity item={item} key={index} />;
        })}
        <BillingDetails />
        <View style={styles.send_details_container}>
          <TouchableOpacity style={styles.send_email_container}>
            <Text style={styles.send_email_container_text}>
              EMAIL RECIPE CARD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.download_recpie_card}>
            <Text style={styles.download_recpie_card_text}>
              DOWNLOAD RECIPE CARD
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  conatiner: {
    flex: 1,
  },

  summary_title_conatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  picker_container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summary_bottom_conatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  summary_title_conatiner_left: {
    flex: 1,
    justifyContent: 'center',
  },
  summary_title_conatiner_right: {
    flex: 1,
    justifyContent: 'center',
  },
  summary_title_text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title_container: {
    height: height * 0.1,
    width,
    flexDirection: 'row',
    backgroundColor: '#ededed',
    paddingVertical: 10,
  },
  title_container_left: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
    paddingLeft: 20,
  },
  title_container_middle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
    paddingLeft: 20,
  },
  title_container_right: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 20,
    justifyContent: 'flex-end',
  },
  deliver_on_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time_text: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
  },
  edit_text: {
    fontSize: 16,
  },
  send_details_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  send_email_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#3fa4fd',
  },
  download_recpie_card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#3fa4fd',
    overflow: 'hidden',
    borderColor: '#3fa4fd',
    borderWidth: 1,
  },
  download_recpie_card_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$xxs',
  },
  send_email_container_text: {
    fontWeight: 'bold',
    fontSize: '$xxs',
  },
  image_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
  },
  order_placed_title: {
    color: '#3fa4fd',
    textAlign: 'center',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default OrderPlaced;
