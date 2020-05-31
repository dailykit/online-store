import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

import ComboProduct from './ComboProduct';
import CustomizableProductItem from './CustomizableProductItem';
import SimpleProductItem from './SimpleProductItem';
import InventoryProductItem from './InventoryProductItem';

import { useCartContext } from '../context/cart';

import { height, width } from '../utils/Scalaing';
import { useAppContext } from '../context/app';

const Card = ({ id, type, navigation, label, ...restProps }) => {
  const [price, setPrice] = useState('randomNumber');
  const [cardItem, setcardItem] = useState(null); // obj to push to jaguar
  const [cardData, setcardData] = useState(null); // obj to pass to add to cart modal

  const { visual } = useAppContext();

  console.log(visual);

  useEffect(() => {
    console.log(id, type);
  }, []);

  return (
    <>
      <View style={styles.card_container}>
        <View style={styles.item_parent_container}>
          {type == 'comboProducts' && (
            <>
              {cardData && (
                <View style={styles.card_title}>
                  <Text style={styles.card_title_text}>
                    {cardData.name ? cardData.name : 'Resturant Name'}
                  </Text>
                  <Text style={styles.is_customizable}>Customizeable</Text>
                </View>
              )}
              <ComboProduct
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                id={id}
                navigation={navigation}
                setPrice={setPrice}
                {...restProps}
              />
            </>
          )}
          {type == 'customizableProducts' && (
            <>
              {cardData && (
                <View style={styles.card_title}>
                  <Text style={styles.card_title_text}>{cardData?.name}</Text>
                  <Text style={styles.is_customizable}>Customizeable</Text>
                </View>
              )}
              <CustomizableProductItem
                label={label}
                setcardItem={setcardItem}
                navigation={navigation}
                setcardData={(item) => setcardData(item)}
                independantItem
                id={id}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
          {type == 'simpleRecipeProducts' && (
            <>
              {cardData && (
                <View style={styles.card_title}>
                  <Text style={styles.card_title_text}>
                    {cardData?.simpleRecipeProduct?.name}
                  </Text>
                </View>
              )}
              <SimpleProductItem
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                navigation={navigation}
                independantItem
                id={id}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
          {type == 'inventoryProducts' && (
            <>
              {cardData && (
                <View style={styles.card_title}>
                  <Text style={styles.card_title_text}>
                    {cardData.inventoryProduct?.name}
                  </Text>
                </View>
              )}
              <InventoryProductItem
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                navigation={navigation}
                independantItem
                id={id}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
        </View>

        <View style={styles.bottom_container}>
          <View style={styles.price}>
            <Text style={styles.price_text}>$ {isNaN(price) ? 0 : price}</Text>
          </View>
          <View style={styles.add_to_cart_container}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddToCart', { data: cardData, type, id });
              }}
              style={[
                styles.button,
                { display: isNaN(price) ? 'none' : 'flex' },
              ]}
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

const styles = EStyleSheet.create({
  card_container: {
    width: width > 1000 ? width * 0.3 : width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginRight: width > 1000 ? 20 : 0,
    marginTop: width > 1000 ? 20 : 0,
  },
  card_title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_title_text: {
    fontSize: '$s',
    fontWeight: 'bold',
  },
  is_customizable: {
    fontSize: '$xxs',
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
    fontSize: '$s',
  },
  price_text: {
    fontSize: '$l',
    fontWeight: 'bold',
  },
});

export default Card;
