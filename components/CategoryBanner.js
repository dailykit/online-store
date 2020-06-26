import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../utils/Scalaing';
import { ProgressBarAndroid } from 'react-native-web';
import { useAppContext } from '../context/app';

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

export const CategoryBanner = ({
  navigation,
  title,
  category,
  data,
  showLink,
}) => {
  let categoryType = assets[title];

  const { visual } = useAppContext();

  if (!categoryType) categoryType = assets['Not Exist'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showLink && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryProductsPage', {
              data,
              category,
            })
          }
        >
          <Text
            style={{ color: visual.color, textDecorationLine: 'underline' }}
          >
            See {title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#eaeded',
    borderBottomWidth: 1,
    marginHorizontal: width > 768 ? 20 : 5,
  },
  title: {
    fontSize: width > 768 ? '1.3rem' : '1.1rem',
    fontWeight: 'bold',
  },
});
