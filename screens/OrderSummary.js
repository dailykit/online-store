import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Picker } from 'native-base';

import Summary from '../components/Summary';
import { CartSummary } from '../components/Cart';
import BillingDetails from '../components/BillingDetails';
import HeaderBack from '../components/HeaderBack';

const { width, height } = Dimensions.get('window');

export default class OrderSummary extends Component {
  render() {
    let { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderBack title='Go Back' navigation={navigation} />
        <ScrollView style={styles.conatiner}>
          <View style={styles.title_container}>
            <View style={styles.title_container_left}>
              <Text style={styles.deliver_on_text}>Deliver on</Text>
              <Text style={styles.time_text}>Monday, Dec 9</Text>
            </View>
            <View style={styles.title_container_middle}>
              <Text
                style={[styles.time_text, { textAlign: 'center', flex: 1 }]}
              >
                9am - 10am
              </Text>
            </View>
            <View style={styles.title_container_right}>
              <View style={styles.edit}>
                <Text style={styles.edit_text}>edit{'  '}</Text>
                <Ionicons
                  style={{ paddingTop: 2 }}
                  size={16}
                  name='ios-arrow-forward'
                />
              </View>
            </View>
          </View>
          <View style={styles.summary_title_conatiner}>
            <View style={styles.summary_title_conatiner_left}>
              <Text style={styles.summary_title_text}>Order Summary</Text>
            </View>
            <View style={styles.summary_title_conatiner_right}>
              <Text style={[styles.summary_title_text, { textAlign: 'right' }]}>
                3 products
              </Text>
            </View>
          </View>
          {[1, 2, 3].map((item, index) => {
            return <Summary item={item} key={index} />;
          })}
          <BillingDetails />
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <CartSummary text='CONFIRM AND PAY' />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
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
  title_container: {
    height: height * 0.1,
    width,
    flexDirection: 'row',
    backgroundColor: '#ededed',
    paddingVertical: 10,
  },
  title_container_left: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
    paddingLeft: 20,
  },
  title_container_middle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
    paddingLeft: 20,
  },
  title_container_right: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 20,
    justifyContent: 'flex-end',
  },
  deliver_on_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time_text: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
  },
  edit_text: {
    fontSize: 16,
  },
});
