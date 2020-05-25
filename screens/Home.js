import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  Modal,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { Datepicker } from '@ui-kitten/components';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CREATE_CUSTOMER, CUSTOMER, CUSTOMER_DETAILS } from '../graphql';
const { width, height } = Dimensions.get('screen');
import Card from '../components/Card';
import Cart from '../components/Cart';
import { SafetyBanner } from '../components/SafetyBanner';
import { CLIENTID, DAILYOS_SERVER_URL } from 'react-native-dotenv';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { useCartContext } from '../context/cart';
import * as axios from 'axios';

const Home = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedPickerItem, setselectedPickerItem] = useState(0);
  const [calendarDate, setcalendarDate] = useState(new Date());

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { user, setCustomer } = useCartContext();

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const response = await axios.post(`${DAILYOS_SERVER_URL}/getMenu`, {
        input: date,
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  React.useEffect(() => {
    fetchData({
      year: moment().year(),
      month: moment().month(),
      day: moment().date(),
    });
  }, []);

  // Mutations
  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    onCompleted: () => {
      console.log('Customer created');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Subscription
  useSubscription(CUSTOMER, {
    variables: {
      keycloakId: user.keycloakId,
      email: user.email,
    },
    onSubscriptionData: (data) => {
      const customers = data.subscriptionData.data.customers;
      if (customers.length) {
        setCustomer(customers[0]);
      } else {
        createCustomer({
          variables: {
            object: {
              keycloakId: user.keycloakId,
              email: user.email,
              source: 'RMK',
              clientId: CLIENTID,
            },
          },
        });
      }
    },
  });

  // Query
  useQuery(CUSTOMER_DETAILS, {
    variables: {
      keycloakId: user.keycloakId,
    },
    onCompleted: (data) => {
      if (data.platform_CustomerByClient.length) {
        setCustomer(data.platform_CustomerByClient[0].customer);
      } else {
        console.log('No customer data found!');
      }
    },
  });

  if (!data.length || loading) {
    return (
      <View style={styles.home}>
        {/* <Tabs /> */}
        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.img_container}>
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
              }}
              style={styles.cover_image}
            />
          </View>
          <View style={styles.picker_container}>
            <View style={styles.picker_placeholder}>
              <Datepicker
                date={calendarDate}
                onSelect={(_date) => {
                  setcalendarDate(_date);
                  fetchData({
                    year: moment(_date).year(),
                    month: moment(_date).month(),
                    day: moment(_date).date(),
                  });
                }}
              />
            </View>
            <View style={styles.picker_placeholder}>
              <Select
                selectedIndex={selectedIndex}
                value={0}
                onSelect={() => {}}
              >
                <SelectItem title={'Please wait..'} />
              </Select>
            </View>
          </View>
          <View style={styles.flexContainer}>
            <ActivityIndicator />
          </View>
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <Cart to='OrderSummary' {...props} text='Checkout' />
      </View>
    );
  }
  let pickerData = [];
  let menuItems = {};

  if (data.length) {
    data.forEach((category, _id) => {
      pickerData.push(category.name);
      menuItems[category.name] = {};
      Object.keys(category).forEach((key) => {
        if (key != 'name' && key != '__typename') {
          menuItems[category.name][key] = category[key];
        }
      });
    });
  }

  return (
    <View style={styles.home}>
      {/* <Tabs /> */}
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.img_container}>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.cover_image}
          />
        </View>
        <Text style={styles.title}>Vegan Adda</Text>
        <SafetyBanner {...props} />
        <View style={styles.picker_container}>
          <View style={styles.picker_placeholder}>
            <Datepicker
              date={calendarDate}
              onSelect={(_date) => {
                setcalendarDate(_date);
                fetchData({
                  year: moment(_date).year(),
                  month: moment(_date).month(),
                  day: moment(_date).date(),
                });
              }}
            />
          </View>
          <View style={styles.picker_placeholder}>
            <Select
              selectedIndex={selectedIndex}
              value={pickerData[selectedIndex.row]}
              onSelect={(_selectedIndex) => {
                setselectedPickerItem(_selectedIndex.row);
                setSelectedIndex(_selectedIndex);
              }}
            >
              {pickerData.map((title, key) => (
                <SelectItem key={key} title={title} />
              ))}
            </Select>
          </View>
        </View>
        {Object.keys(
          menuItems[pickerData[selectedPickerItem]]
        ).map((type, _id) =>
          menuItems[pickerData[selectedPickerItem]][type].map((id) => (
            <Card {...props} type={type} key={id} id={id} />
          ))
        )}
        <View style={{ height: height * 0.08 }} />
      </ScrollView>
      <Cart to='OrderSummary' {...props} text='Checkout' />
    </View>
  );
};

const styles = EStyleSheet.create({
  home: {
    flex: 1,
  },
  img_container: {
    height: height * 0.2,
    width,
  },
  cover_image: {
    flex: 1,
    resizeMode: 'cover',
    height: null,
    width: null,
  },
  picker_container: {
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  picker_placeholder: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.2rem',
    padding: 20,
    fontWeight: 'bold',
  },
});

export default Home;
