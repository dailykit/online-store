import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useCartContext } from '../context/cart';
import { UPDATE_CART } from '../graphql/mutations';
import { useMutation } from '@apollo/react-hooks';
import EStyleSheet from 'react-native-extended-stylesheet';

import { height, width } from '../utils/Scalaing';
import { useAppContext } from '../context/app';

const Summary = ({ useQuantity, item }) => {
  const [quantity, setquantity] = useState(1);
  const { cart } = useCartContext();
  const { visual } = useAppContext();

  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Product added!');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const removeFromCart = (product) => {
    let products = cart?.cartInfo?.products;
    let total = parseFloat(cart?.cartInfo?.total);
    if (product.type === 'comboProducts') {
      product.products.forEach(
        (item) => (total = total - parseFloat(item.product.price))
      );
    } else {
      total = total - parseFloat(product.product.price);
    }
    let newCartItems = products?.filter(
      (item) => item.cartItemId !== product.cartItemId
    );
    total = isNaN(total) ? 0 : total < 0 ? 0 : total;
    const cartInfo = {
      products: newCartItems,
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
  };

  if (quantity < 0) {
    setquantity(0);
  }
  if (item.type == 'comboProducts') {
    return (
      <View style={styles.summary_container}>
        <View style={styles.picker_container}>
          <Text style={styles.summary_title_text}>{item.products[0].name}</Text>
        </View>
        {item.products.map((el) => (
          <View style={styles.picker_container}>
            <Text
              style={{
                paddingLeft: 10,
              }}
            >
              {el.product.name}
            </Text>
          </View>
        ))}
        <View style={styles.summary_bottom_conatiner}>
          <View style={styles.summary_bottom_conatiner_left}>
            <Text style={styles.price_text}>$ {item.price}</Text>
          </View>
          <View style={styles.summary_bottom_conatiner_right}>
            {/* {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )} */}
            {!useQuantity && (
              <View style={styles.button_container}>
                <TouchableOpacity
                  onPress={() => {
                    removeFromCart(item);
                  }}
                  style={[
                    styles.button_container_left,
                    { backgroundColor: visual.color || '#3fa4ff' },
                  ]}
                >
                  <Text style={{ color: 'white' }}>Remove Item</Text>
                </TouchableOpacity>
              </View>
            )}
            {useQuantity && (
              <Text style={{ fontSize: 18 }}>
                Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.summary_container}>
      <View style={styles.picker_container}>
        <Text style={styles.summary_title_text}>{item.product.name}</Text>
      </View>
      <View style={styles.summary_bottom_conatiner}>
        <View style={styles.summary_bottom_conatiner_left}>
          <Text style={styles.price_text}>$ {item.product.price}</Text>
        </View>
        <View style={styles.summary_bottom_conatiner_right}>
          {/* {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )} */}
          {!useQuantity && (
            <View
              style={[
                styles.button_container,
                { borderColor: visual.color || '#3fa4ff' },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  removeFromCart(item);
                }}
                style={[
                  styles.button_container_left,
                  { backgroundColor: visual.color || '#3fa4ff' },
                ]}
              >
                <Text style={{ color: 'white' }}>Remove Item</Text>
              </TouchableOpacity>
            </View>
          )}
          {useQuantity && (
            <Text style={{ fontSize: 18 }}>
              Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summary_container: {
    height: height * 0.22,
    marginBottom: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // // elevation: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderTopColor: '#fff',
    backgroundColor: '#f1f1f1',
    width: width - 20,
    marginLeft: 10,
    paddingBottom: 20,
  },
  summary_title_conatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  picker_container: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  summary_bottom_conatiner_left: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  summary_bottom_conatiner_right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3fa4ff',
    width: '80%',
  },
  price_text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  button_container_left: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3fa4ff',
    height: height * 0.04,
  },
  button_container_middle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#278ce8',
    height: height * 0.04,
  },
  button_container_right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3fa4ff',
    height: height * 0.04,
  },
  quantity_text: {
    color: 'white',
    fontSize: 16,
  },
});

export default Summary;
