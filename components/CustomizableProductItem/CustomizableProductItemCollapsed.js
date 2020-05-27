import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

import { height, width } from '../../utils/Scalaing';

const CustomizableProductItemCollapsed = ({
  isSelected,
  _id,
  setSelected,
  isLast,
  key,
  openModal,
  navigation,
  setExpanded,
  data,
  label,
  independantItem,
  numberOfOptions,
  tunnelItem,
}) => {
  let simpleRecipeProduct = data.simpleRecipeProduct;
  return (
    <TouchableOpacity
      onPress={() => {
        if (!tunnelItem) {
          setExpanded(false);
        }
      }}
      style={[
        styles.item_container,
        {
          borderBottomWidth: isLast ? 0 : 1,
          flex: 8,
          height: 'auto',
        },
      ]}
    >
      <View style={[styles.item_container_one, { display: 'flex' }]}>
        <Text style={styles.item_image_title}>{label}</Text>
        <Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
          }}
          style={styles.item_image}
        />
      </View>
      <View
        style={[
          styles.item_container_two,
          {
            paddingTop: 15,
            paddingLeft: 10,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={styles.item_title}
          >{`${simpleRecipeProduct?.name} `}</Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Modal', {
                data: simpleRecipeProduct?.simpleRecipe,
                author: simpleRecipeProduct?.simpleRecipe?.author,
                name: simpleRecipeProduct?.name,
              })
            }
          >
            <Feather size={14} name='info' />
          </TouchableOpacity>
        </View>
        <Text
          style={styles.item_chef}
        >{`${simpleRecipeProduct?.simpleRecipe?.author} `}</Text>
        <Text style={styles.item_category}>vegeterian</Text>
      </View>
      <View style={styles.item_container_three}>
        <View style={styles.item_three_upper}>
          <TouchableOpacity
            onPress={() => {
              if (!independantItem) {
                setSelected(_id);
                setExpanded(true);
              } else {
                setExpanded(true);
              }
            }}
          >
            <Text style={styles.options_text}>
              {numberOfOptions} options <Ionicons name='ios-arrow-down' />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item_three_lower}>
          <Text style={styles.item_details}>
            Mealkit | <Feather name='user' />{' '}
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  item_container: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginBottom: 2,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 4,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#ececec',
    height: width < height ? height * 0.15 : height * 0.35,
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
    paddingTop: 15,
    paddingLeft: 10,
  },
  item_container_three: {
    flex: 2,
    paddingTop: 15,
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
    fontSize: '$xxs',
  },
  item_chef: {
    color: 'gray',
    fontSize: '$xxxs',
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 70,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: '$xxs',
  },
  options_text: {
    color: '#3fa4fd',
    textAlign: 'right',
    fontSize: '$xs',
  },
  item_details: {
    textAlign: 'right',
    fontSize: '$xxs',
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
    height: 20,
    width: 20,
  },
  item_three_upper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
  },
  item_three_lower: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default CustomizableProductItemCollapsed;
