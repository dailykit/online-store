import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartContext } from '../context/cart';
import { uuid } from '../utils';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSubscription } from '@apollo/react-hooks';
import { CART } from '../graphql';

const { width, height } = Dimensions.get('window');

const Cart = ({
  navigation,
  text,
  cartItem,
  to,
  tunnelItem,
  type,
  comboProductItems,
}) => {
  const { cart, cartItems, totalPrice } = useCartContext();

  console.log('cart', cart);

  // cart.cartInfo = products
  let numberOfProducts = cartItems.length;

  return (
    <TouchableOpacity
      onPress={() => {
        if (tunnelItem) {
          if (type == 'comboProducts') {
            addToCart({
              cartItemId: uuid(),
              products: comboProductItems,
              type,
            });
          } else {
            addToCart({
              cartItemId: uuid(),
              ...cartItem,
              type,
            });
          }
        }
        navigation.navigate(to);
      }}
      style={styles.container}
    >
      <View style={styles.container_left}>
        <Text style={styles.text}>
          $ {totalPrice} | {numberOfProducts} Products
        </Text>
      </View>
      <View style={styles.container_right}>
        <Text style={styles.text}>
          {text}
          {'    '}
        </Text>
        <Ionicons
          name='ios-arrow-forward'
          color='#fff'
          size={20}
          style={{ marginTop: 2 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const CartSummary = ({ navigation, text }) => {
  const { cartItems, totalPrice, cart, setCart } = useCartContext();

  const pay = () => {
    if (cart.isValid.status) {
      // Payment API call
      navigation.navigate('OrderPlaced');
    } else {
      console.log(cart);
      ToastAndroid.show(cart.isValid.error, ToastAndroid.SHORT);
    }
  };

  return (
    <TouchableOpacity onPress={pay} style={styles.container}>
      <View style={[styles.container_left, { flex: 3 }]}>
        <Text style={[styles.text, { fontSize: 18 }]}>
          {cartItems.length} items | $ {totalPrice}
        </Text>
        <Text style={[styles.text, { fontSize: 10 }]}>
          *extra charges may apply
        </Text>
      </View>
      <View style={styles.container_right}>
        <Text style={styles.text}>
          {text}
          {'    '}
        </Text>
        <Ionicons
          name='ios-arrow-forward'
          color='#fff'
          size={20}
          style={{ marginTop: 2 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const ComboProductItemProceed = ({
  navigation,
  text,
  setCurrentComboProductIndex,
  currentComboProductIndex,
}) => {
  return (
    <TouchableOpacity
      onPress={() => setCurrentComboProductIndex(currentComboProductIndex + 1)}
      style={styles.container}
    >
      <View style={[styles.container_left, { flex: 4 }]}>
        <Text style={[styles.text, { fontSize: 14 }]}>
          Click to select next item
        </Text>
      </View>
      <View style={styles.container_right}>
        <Text style={styles.text}>
          {text}
          {'    '}
        </Text>
        <Ionicons
          name='ios-arrow-forward'
          color='#fff'
          size={20}
          style={{ marginTop: 2 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.08,
    width,
    backgroundColor: '#3fa4ff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  container_left: {
    flex: 3,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  container_right: {
    flex: 3,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default Cart;
