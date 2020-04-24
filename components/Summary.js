import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Picker } from 'native-base';

const { width, height } = Dimensions.get('window');

const Summary = ({ useQuantity }) => {
  const [quantity, setquantity] = useState(1);
  if (quantity < 0) {
    setquantity(0);
  }
  return (
    <View style={styles.summary_container}>
      <View style={styles.picker_container}>
        <Picker
          mode='dropdown'
          iosHeader='Category'
          iosIcon={<Feather name='arrow-down' />}
          style={styles.picker_placeholder}
          selectedValue={'key1'}
          onValueChange={(value) => console.log(value)}
          placeholderStyle={{ fontWeight: 'bold' }}
          textStyle={{ fontWeight: 'bold' }}
        >
          <Picker.Item label='Wallet' value='key0' />
          <Picker.Item label='Dal makhani with brown rice' value='key1' />
          <Picker.Item label='Debit Card' value='key2' />
          <Picker.Item label='Credit Card' value='key3' />
          <Picker.Item label='Net Banking' value='key4' />
        </Picker>
      </View>
      <View style={styles.summary_bottom_conatiner}>
        <View style={styles.summary_bottom_conatiner_left}>
          <Text style={styles.price_text}>$ 2.50</Text>
        </View>
        <View style={styles.summary_bottom_conatiner_right}>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summary_container: {
    height: height * 0.2,
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
  },
  summary_title_conatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  picker_container: {
    flex: 1,
    paddingHorizontal: 20,
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
