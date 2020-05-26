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
import { Feather } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

let initialData = [
  {
    address: '123, apartment name, street rd, Chicago City, 90301',
    isSlected: true,
    id: 1,
  },
  {
    address: '123, apartment name, street rd, Chicago City, 90301',
    isSlected: false,
    id: 2,
  },
  {
    address: '123, apartment name, street rd, Chicago City, 90301',
    isSlected: false,
    id: 3,
  },
];

export const EditAddress = ({ navigation }) => {
  const { customer, customerDetails } = useCartContext();
  const [addressData, setaddressData] = useState(initialData);
  return (
    <View style={styles.conatiner}>
      <HeaderBack navigation={navigation} title='Go Back' />
      <Text style={styles.title}>Choose Address</Text>
      <View style={styles.addressConatiner}>
        {addressData.map((item, _key) => (
          <TouchableOpacity
            key={`id-${_key}`}
            onPress={() => {
              let auxData = addressData.map((item, _id) => ({
                address: item.address,
                isSlected: false,
                id: _id + 1,
              }));
              auxData[_key].isSlected = true;
              setaddressData(auxData);
            }}
            style={[
              styles.addressOptionConatiner,
              { backgroundColor: item.isSlected ? '#fff' : '#f3f3f3' },
            ]}
          >
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            <View style={styles.addressSelectedContainer}>
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
  addressConatiner: {
    flexDirection: 'column',
    flex: 1,
  },
  addressOptionConatiner: {
    justifyContent: 'center',
    height: height * 0.12,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dedede',
    marginBottom: 4,
  },
  addressTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  addressText: {
    width: width * 0.7,
    paddingLeft: 20,
  },
  addressSelectedContainer: {
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
