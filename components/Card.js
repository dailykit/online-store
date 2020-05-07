import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import ComboProduct from './ComboProduct';
import CustomizableProductItem from './CustomizableProductItem';
import SimpleProductItem from './SimpleProductItem';
import InventoryProductItem from './InventoryProductItem';

import { useCartContext } from '../context/cart';

const { width, height } = Dimensions.get('window');

const Card = ({ id, type, navigation, ...restProps }) => {
  const [price, setPrice] = useState(2.5);
  const [cardItem, setcardItem] = useState(null); // obj to push to jaguar
  const [cardData, setcardData] = useState(null); // obj to pass to add to cart modal

  useEffect(() => {
    console.log(id, type);
  }, []);

  return (
    <>
      <View style={styles.card_container}>
        <View style={styles.item_parent_container}>
          {type == 'comboProducts' && (
            <ComboProduct
              setcardItem={(item) => setcardItem(item)}
              setcardData={(item) => setcardData(item)}
              id={id}
              navigation={navigation}
              {...restProps}
            />
          )}
          {type == 'customizableProducts' && (
            <CustomizableProductItem
              setcardItem={(item) => setcardItem(item)}
              navigation={navigation}
              setcardData={(item) => setcardData(item)}
              independantItem
              id={id}
              {...restProps}
              setPrice={(price) => setPrice(price)}
            />
          )}
          {type == 'simpleRecipeProducts' && (
            <SimpleProductItem
              setcardItem={(item) => setcardItem(item)}
              setcardData={(item) => setcardData(item)}
              navigation={navigation}
              independantItem
              id={id}
              {...restProps}
              setPrice={(price) => setPrice(price)}
            />
          )}
          {type == 'inventoryProducts' && (
            <InventoryProductItem
              setcardItem={(item) => setcardItem(item)}
              setcardData={(item) => setcardData(item)}
              navigation={navigation}
              independantItem
              id={id}
              {...restProps}
              setPrice={(price) => setPrice(price)}
            />
          )}
        </View>

        <View style={styles.bottom_container}>
          <View style={styles.price}>
            <Text style={styles.price_text}>$ {price}</Text>
          </View>
          <View style={styles.add_to_cart_container}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddToCart', { data: cardData, type, id });
              }}
              style={styles.button}
            >
              <Text style={styles.add_to_card_text}>
                <Feather size={14} name='plus' /> ADD TO CART
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card_container: {
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  card_title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_title_text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  is_customizable: {
    fontSize: 8,
    color: 'gray',
  },
  item_parent_container: {
    flex: 5,
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  item_details: {
    textAlign: 'right',
  },
  price: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  add_to_cart_container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#3fa4ff',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  add_to_card_text: {
    color: 'white',
    fontSize: 14,
  },
  price_text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Card;
