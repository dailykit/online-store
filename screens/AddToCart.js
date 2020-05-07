import React, { Component, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';

import Cart from '../components/Cart';

import ComboProduct from '../components/ComboProduct';
import CustomizableProductItem from '../components/CustomizableProductItem';
import SimpleProductItem from '../components/SimpleProductItem';
import InventoryProductItem from '../components/InventoryProductItem';

import { useCartContext } from '../context/cart';

const { width, height } = Dimensions.get('window');

const ModalContent = ({ route, navigation, ...restProps }) => {
  const { data, type, id } = route.params;
  const [selected, setSelected] = useState(0);
  const [cartItem, setcartItem] = useState(null); // obj to push to jaguar
  const [cartItemToDisplay, setcartItemToDisplay] = useState(null); // obj to push to jaguar

  let name = '';
  if (type == 'simpleRecipeProducts') {
    name = data.simpleRecipeProduct.name;
  }
  if (type == 'comboProducts') {
    name = data.name;
  }
  if (type == 'inventoryProducts') {
    name = data.inventoryProduct.name;
  }
  if (type == 'customizableProducts') {
    name = data.name;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.title_container}>
          <View style={styles.details}>
            <Text style={styles.title}>{name}</Text>
          </View>
          <View style={styles.close_container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <AntDesign size={30} name='close' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.item_parent_container}>
          {type == 'comboProducts' && (
            <ComboProduct
              setcartItem={(item) => setcartItem(item)}
              setcartItemToDisplay={(item) => setcartItemToDisplay(item)}
              navigation={navigation}
              tunnelItem
              id={id}
              {...restProps}
            />
          )}
          {type == 'customizableProducts' && (
            <CustomizableProductItem
              setcartItem={(item) => setcartItem(item)}
              setcartItemToDisplay={(item) => setcartItemToDisplay(item)}
              navigation={navigation}
              independantItem
              tunnelItem
              id={id}
              {...restProps}
            />
          )}
          {type == 'simpleRecipeProducts' && (
            <SimpleProductItem
              setcartItem={(item) => setcartItem(item)}
              setcartItemToDisplay={(item) => setcartItemToDisplay(item)}
              navigation={navigation}
              independantItem
              tunnelItem
              id={id}
              {...restProps}
            />
          )}
          {type == 'inventoryProducts' && (
            <InventoryProductItem
              setcartItem={(item) => setcartItem(item)}
              setcartItemToDisplay={(item) => setcartItemToDisplay(item)}
              navigation={navigation}
              independantItem
              tunnelItem
              id={id}
              {...restProps}
            />
          )}
        </View>
        <View style={{ height: height * 0.08 }} />
      </ScrollView>
      <Cart
        cartItem={cartItem}
        navigation={navigation}
        to={'Home'}
        {...restProps}
        text='Proceed'
        cartItemToDisplay={cartItemToDisplay}
        tunnelItem
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item_title: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
  },
  item_chef: {
    color: 'gray',
    fontSize: 12,
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 70,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 12,
  },
  title_container: {
    height: 100,
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 10,
  },
  close_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  card_container: {
    height: height * 0.55,
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
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
    paddingHorizontal: 10,
  },
  item_container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 5,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 20,
  },
  item_container_one: {
    flex: 2,
    position: 'relative',
    paddingTop: 20,
  },
  item_container_two: {
    flex: 4,
    paddingTop: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  item_container_three: {
    flex: 2,
    justifyContent: 'space-between',
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  item_image_title: {
    position: 'absolute',
    zIndex: 8,
    color: 'gray',
    fontWeight: 'bold',
  },
  item_image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
  },
  item_title: {
    fontSize: 14,
  },
  item_chef: {
    color: 'gray',
    fontSize: 10,
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 70,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 10,
  },
  options_text: {
    color: '#3fa4fd',
    textAlign: 'right',
    fontSize: 12,
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
  details: {
    justifyContent: 'center',
  },
  type_container: {
    height: height * 0.1,
    flexDirection: 'row',
  },
  type_container_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  type_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
  },
  done_container: {
    backgroundColor: '#3fa4ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  selected_type_conatiner: {
    backgroundColor: '#fff',
    borderRadius: 1,
    borderWidth: 2,
    borderColor: '#d9d9d9',
  },
  servingSelectContainer: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 5,
    borderColor: '#ececec',
  },
  servingSelectContainer_one: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  servingSelectContainer_two: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingSelectContainer_three: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalContent;
