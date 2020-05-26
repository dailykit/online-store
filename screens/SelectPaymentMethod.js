import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { useCartContext } from '../context/cart';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Feather, AntDesign } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

let initialData = [
  {
    cardNumber: 'XXXX XXXX XXXX 3230',
    isSlected: true,
    id: 1,
  },
  {
    cardNumber: 'XXXX XXXX XXXX 3230',
    isSlected: false,
    id: 2,
  },
  {
    cardNumber: 'XXXX XXXX XXXX 3230',
    isSlected: false,
    id: 3,
  },
];

export const SelectPaymentMethod = ({ navigation }) => {
  const { customer, customerDetails } = useCartContext();
  const [cardNumberData, setcardNumberData] = useState(initialData);
  return (
    <View style={styles.conatiner}>
      <HeaderBack navigation={navigation} title='Go Back' />
      <Text style={styles.title}>Choose Payment Card</Text>
      <View style={styles.cardNumberConatiner}>
        {cardNumberData.map((item, _key) => (
          <TouchableOpacity
            key={`id-${_key}`}
            onPress={() => {
              let auxData = cardNumberData.map((item, _id) => ({
                cardNumber: item.cardNumber,
                isSlected: false,
                id: _id + 1,
              }));
              auxData[_key].isSlected = true;
              setcardNumberData(auxData);
            }}
            style={[
              styles.cardNumberOptionConatiner,
              { backgroundColor: item.isSlected ? '#fff' : '#f3f3f3' },
            ]}
          >
            <View style={styles.cardNumberTextContainer}>
              <Text style={styles.cardNumberText}>
                <AntDesign name='creditcard' /> {'  '}
                {item.cardNumber}
              </Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View
                style={[
                  styles.checkContainer,
                  {
                    borderWidth: 1,
                    borderColor: item.isSlected ? '#3fa4ff' : '#dedede',
                    backgroundColor: item.isSlected ? '#3fa4ff' : '#fff',
                  },
                ]}
              >
                {item.isSlected && <Feather color='#fff' name='check' />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '$xl',
    padding: 20,
  },
  cardNumberConatiner: {
    flexDirection: 'column',
    flex: 1,
  },
  cardNumberOptionConatiner: {
    justifyContent: 'center',
    height: height * 0.12,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dedede',
    marginBottom: 4,
  },
  cardNumberTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  cardNumberText: {
    width: width * 0.7,
    paddingLeft: 20,
  },
  cardNumberSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    backgroundColor: '#3fa4ff',
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
