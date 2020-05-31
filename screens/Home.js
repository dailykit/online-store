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
  FlatList,
  Platform,
} from 'react-native';
import { Datepicker } from '@ui-kitten/components';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  CREATE_CUSTOMER,
  CUSTOMER,
  CUSTOMER_DETAILS,
  STORE_SETTINGS,
} from '../graphql';
import { height, width } from '../utils/Scalaing';
import Card from '../components/Card';
import Cart from '../components/Cart';
import { SafetyBanner } from '../components/SafetyBanner';
import { CLIENTID, DAILYOS_SERVER_URL } from 'react-native-dotenv';

import {
  useLazyQuery,
  useMutation,
  useSubscription,
  useQuery,
} from '@apollo/react-hooks';
import { useCartContext } from '../context/cart';
import * as axios from 'axios';
import { useAuth } from '../context/auth';
import { useAppContext } from '../context/app';

const Home = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedPickerItem, setselectedPickerItem] = useState(0);
  const [calendarDate, setcalendarDate] = useState(new Date());

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { setCustomer, setCustomerDetails } = useCartContext();
  const { user } = useAuth();

  const {
    brand,
    setBrand,
    visual,
    setVisual,
    availability,
    setAvailability,
  } = useAppContext();

  // Query
  const { loading: settingsLoading } = useQuery(STORE_SETTINGS, {
    onCompleted: (data) => {
      data.storeSettings.forEach(({ type, identifier, value }) => {
        switch (type) {
          case 'brand': {
            switch (identifier) {
              case 'Brand Logo': {
                return setBrand({ ...brand, logo: value.url });
              }
              case 'Brand Name': {
                return setBrand({ ...brand, name: value.name });
              }
              default: {
                return;
              }
            }
          }
          case 'visual': {
            switch (identifier) {
              case 'App Title': {
                return setVisual({ ...visual, title: value.title });
              }
              case 'Favicon': {
                return setVisual({ ...visual, favicon: value.url });
              }
              case 'Primary Color': {
                return setVisual({ ...visual, color: value.color });
              }
              case 'Cover': {
                return setVisual({ ...visual, cover: value.url });
              }
              default: {
                return;
              }
            }
          }
          case 'availability': {
            switch (identifier) {
              case 'Store Availability': {
                return setAvailability({ ...availability, store: value });
              }
              case 'Pickup': {
                return setAvailability({ ...availability, pickup: value });
              }
              case 'Delivery': {
                return setAvailability({ ...availability, delivery: value });
              }
              default: {
                return;
              }
            }
          }
          default: {
            return;
          }
        }
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const response = await axios.post(`${DAILYOS_SERVER_URL}/api/menu`, {
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
    if (availability && availability.store.isOpen) {
      fetchData({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
      });
    }
  }, [availability]);

  React.useEffect(() => {
    if (user.sub || user.userid) {
      customerDetails();
    }
  }, [user]);

  // Query
  const [customerDetails] = useLazyQuery(CUSTOMER_DETAILS, {
    variables: {
      keycloakId: user.sub || user.userid,
    },
    onCompleted: (data) => {
      console.log('platform -> data', data);
      if (data.platform_customerByClients?.length) {
        setCustomerDetails(data.platform_customerByClients[0].customer);
      } else {
        console.log('No customer data found!');
      }
    },
    fetchPolicy: 'cache-and-network',
  });

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
  const { error } = useSubscription(CUSTOMER, {
    variables: {
      keycloakId: user.sub || user.userid,
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
              keycloakId: user.sub || user.userid,
              email: user.email,
              source: 'online store',
              clientId: CLIENTID,
            },
          },
        });
      }
    },
  });

  if (error) console.log('Subscription error: ', error);

  if (settingsLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (availability && !availability.store.isOpen)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 500, fontSize: 24 }}>Store Closed</Text>
        <Text style={{ fontSize: 20 }}>{availability.store.shutMessage}</Text>
      </View>
    );

  if (!data.length || loading) {
    return (
      <View style={styles.home}>
        {/* <Tabs /> */}
        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.img_container}>
            <Image
              source={{
                uri: visual.cover,
              }}
              style={styles.cover_image}
            />
          </View>
          <View style={styles.headerContainer}>
            <View style={styles.picker_container}>
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
    <ScrollView style={styles.home}>
      {/* <Tabs /> */}
      <View style={styles.img_container}>
        <Image
          source={{
            uri: visual.cover,
          }}
          style={styles.cover_image}
        />
      </View>
      <Text style={styles.title}>{brand.name}</Text>
      <View style={styles.headerContainer}>
        <SafetyBanner {...props} />
        <View style={styles.picker_container}>
          <View style={[styles.picker_placeholder]}>
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
      </View>
      <ScrollView
        style={{
          marginTop: 20,
          height: height * 0.81,
        }}
      >
        <View style={styles.flexContainerMiddle}>
          <View style={styles.cardContainer}>
            {menuItems &&
              menuItems[pickerData[selectedPickerItem]] &&
              Object.keys(menuItems[pickerData[selectedPickerItem]]).map(
                (type, _id) => (
                  <FlatList
                    key={_id}
                    data={menuItems[pickerData[selectedPickerItem]][type]}
                    numColumns={width > 1000 ? 3 : 1}
                    renderItem={(render) => {
                      return (
                        <Card
                          {...props}
                          type={type}
                          key={render.item}
                          id={render.item}
                        />
                      );
                    }}
                  />
                )
              )}
          </View>
        </View>
        <View style={{ height: height * 0.08 }} />
      </ScrollView>
      <Cart
        label={pickerData[selectedIndex.row]}
        to='OrderSummary'
        {...props}
        text='Checkout'
      />
    </ScrollView>
  );
};

const styles = EStyleSheet.create({
  home: {
    flex: 1,
    // alignItems: 'center',
  },
  img_container: {
    height: height * 0.3,
    width,
  },
  cover_image: {
    flex: 1,
    resizeMode: 'cover',
    height: null,
    width: null,
    aspectRatio: 3 / 2,
  },
  picker_container: {
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    width: width > 1000 ? width / 2 : width,
    justifyContent: 'center',
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
});

export default Home;
