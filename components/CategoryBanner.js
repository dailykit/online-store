import React from 'react';
import { Image, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../utils/Scalaing';

const assets = {
  'Alcoholic Beverage': {
    uri: require('../assets/imgs/banners/Alcoholic Beverage.png'),
    color: '#add1bd',
    backgroundColor: '#008e44',
  },
  'Beverages & Mixers': {
    uri: require('../assets/imgs/banners/Beverages & Mixers.png'),
    color: '#1c4001',
    backgroundColor: '#C5C4C9',
  },
  'Candy And Snacks': {
    uri: require('../assets/imgs/banners/Candy And Snacks.png'),
    color: '#919647',
    backgroundColor: '#d8c0b4',
  },
  'Dry Groceries': {
    uri: require('../assets/imgs/banners/Dry Groceries.png'),
    color: '#853e30',
    backgroundColor: '#e2e6e7',
  },
  'Fresh Produce': {
    uri: require('../assets/imgs/banners/Fresh Produce.png'),
    color: '#1b541b',
    backgroundColor: '#e5eaee',
  },
  'Janitorial Supplies': {
    uri: require('../assets/imgs/banners/Janitorial Supplies.png'),
    color: '#1b4968',
    backgroundColor: '#fff',
  },
  'Meat & Poultry': {
    uri: require('../assets/imgs/banners/Meat & Poultry.png'),
    color: '#de5626',
    backgroundColor: '#fce392',
  },
  'Paper & Disposables': {
    uri: require('../assets/imgs/banners/Paper & Disposables.png'),
    color: '#b4c9dd',
    backgroundColor: '#6d6b6d',
  },
  'Retail Groceries (Food)': {
    uri: require('../assets/imgs/banners/Retail Groceries (Food).png'),
    color: '#baa46d',
    backgroundColor: '#000',
  },
  'Retail Groceries (Non-Food)': {
    uri: require('../assets/imgs/banners/Retail Groceries (Non-Food).png'),
    color: '#604b4b',
    backgroundColor: '#bdaca4',
  },
  SeaFood: {
    uri: require('../assets/imgs/banners/SeaFood.png'),
    color: '#df9284',
    backgroundColor: '#030d0e',
  },
  'Not Exist': {
    uri: null,
    color: '#1c4001',
    backgroundColor: '#C5C4C9',
  },
};

export const CategoryBanner = ({ category }) => {
  let categoryType = assets[category];

  if (!categoryType) categoryType = assets['Not Exist'];

  return (
    <View
      style={[
        styles.conatiner,
        { backgroundColor: categoryType?.backgroundColor },
      ]}
    >
      <Text style={[styles.categoryText, { color: categoryType?.color }]}>
        {category}
      </Text>
      {/* <View style={[styles.categoryTextContainer]}>
         </View> */}
      {/* <View style={styles.imageContainer}>
            <Image style={[styles.image]} source={categoryType?.uri} />
         </View> */}
    </View>
  );
};

const styles = EStyleSheet.create({
  conatiner: {
    width: width > 1280 ? 1285 : width,
    height: 64,
    marginLeft: '2rem',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: '$xl',
    fontWeight: 'bold',
  },
  imageContainer: {},
  image: {
    height: 64,
    resizeMode: 'cover',
  },
});
