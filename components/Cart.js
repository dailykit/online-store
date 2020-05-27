import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartContext } from '../context/cart';
import { uuid } from '../utils';
import { useMutation } from '@apollo/react-hooks';
import EStyleSheet, { child } from 'react-native-extended-stylesheet';
import { CREATE_CART, UPDATE_CART } from '../graphql/mutations';

import { height, width } from '../utils/Scalaing';

const Cart = ({
  navigation,
  text,
  cartItem,
  to,
  tunnelItem,
  type,
  comboProductItems,
}) => {
  const { cart, customerDetails, customer } = useCartContext();

  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Product added!');
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [createCart] = useMutation(CREATE_CART, {
    onCompleted: () => {
      console.log('Cart created!');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleAddToCart = () => {
    try {
      let products = cart?.cartInfo?.products || [];
      let total = parseFloat(cart?.cartInfo?.total) || 0;
      if (tunnelItem) {
        if (type == 'comboProducts') {
          let comboItemPrice = 0;
          comboProductItems.forEach((product) => {
            comboItemPrice = comboItemPrice + parseFloat(product.product.price);
          });
          total = total + comboItemPrice;
          products.push({
            cartItemId: uuid(),
            products: comboProductItems,
            type,
            price: comboItemPrice,
          });
        } else {
          products.push({
            cartItemId: uuid(),
            ...cartItem,
            type,
          });
          total = total + parseFloat(cartItem.product.price);
        }
        total = parseFloat(total.toFixed(2));
        // products and total ready
        if (!customer) throw Error('Customer subscription failed!');
        if (cart) {
          // Update
          // cartInfo are your products
          const cartInfo = {
            products,
            total,
          }; // you'll have to generate this every time
          updateCart({
            variables: {
              id: cart.id,
              set: {
                cartInfo: cartInfo,
              },
            },
          });
        } else {
          // Create
          // cartInfo are your products
          const cartInfo = {
            products,
            total,
          }; // you'll have to generate this every time
          createCart({
            variables: {
              object: {
                cartInfo: cartInfo,
                customerId: customer.id,
                fulfillmentInfo: {
                  type: 'DELIVERY',
                  time: {
                    from: '15:00',
                    to: '19:00',
                  },
                  date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // tomorrow's date
                },
                paymentMethodId: customerDetails.defaultPaymentMethodId || null,
                address: customerDetails.defaultCustomerAddress || null,
                stripeCustomerId: customerDetails.stripeCustomerId || null,
              },
            },
          });
        }
      }
      navigation.navigate(to);
    } catch (error) {
      console.log(error);
    }
  };

  // cart.cartInfo = products
  let numberOfProducts = cart?.cartInfo?.products?.length;
  let totalPrice = cart?.cartInfo?.total;
  if (!tunnelItem && !numberOfProducts) return <></>;

  return (
    <TouchableOpacity onPress={handleAddToCart} style={styles.container}>
      <View style={styles.container_left}>
        {!tunnelItem && (
          <Text style={styles.text}>
            $ {cart.itemTotal} | {numberOfProducts} Products
          </Text>
        )}
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
  const { cart } = useCartContext();

  // Mutation
  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Cart confirmed!');
      navigation.navigate('PaymentProcessing');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const pay = () => {
    if (cart.isValid.status) {
      updateCart({
        variables: {
          id: cart.id,
          set: {
            status: 'PROCESS',
            amount: cart.totalPrice,
          },
        },
      });
    } else {
      if (Platform.OS == 'android')
        ToastAndroid.show(cart.isValid.error, ToastAndroid.SHORT);
    }
  };
  if (!cart?.cartInfo?.products?.length) return <></>;

  return (
    <TouchableOpacity onPress={pay} style={styles.container}>
      <View style={[styles.container_left, { flex: 3 }]}>
        <Text style={[styles.text, { fontSize: 18 }]}>
          {cart?.cartInfo?.products?.length} items | $ {cart.totalPrice}
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
      onPress={() => {
        setCurrentComboProductIndex(currentComboProductIndex + 1);
      }}
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
