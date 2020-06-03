import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  ActivityIndicator,
  SectionList,
  FlatList,
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
import { Header } from '../components';
import { Drawer } from '../components/Drawer';
import Products from '../components/Products';

const Home = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedPickerItem, setselectedPickerItem] = useState(0);
  const [calendarDate, setcalendarDate] = useState(new Date());

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { setCustomer, setCustomerDetails } = useCartContext();
  const { user } = useAuth();

  const sectionListRef = useRef();

  const {
    brand,
    setBrand,
    visual,
    setVisual,
    availability,
    setAvailability,
  } = useAppContext();

  // Query
  const { loading: settingsLoading, error: settingsError } = useSubscription(
    STORE_SETTINGS,
    {
      onSubscriptionData: (data) => {
        const brandSettings = data.subscriptionData.data.storeSettings.filter(
          (setting) => setting.type === 'brand'
        );
        const visualSettings = data.subscriptionData.data.storeSettings.filter(
          (setting) => setting.type === 'visual'
        );
        const availabilitySettings = data.subscriptionData.data.storeSettings.filter(
          (setting) => setting.type === 'availability'
        );

        let brandState = {};
        brandSettings.forEach(({ identifier, value }) => {
          switch (identifier) {
            case 'Brand Logo': {
              brandState.logo = value.url;
              return;
            }
            case 'Brand Name': {
              brandState.name = value.name;
              return;
            }
            default: {
              return;
            }
          }
        });
        setBrand({ ...brandState });

        let visualState = {};
        visualSettings.forEach(({ identifier, value }) => {
          switch (identifier) {
            case 'Primary Color': {
              visualState.color = value.color;
              return;
            }
            case 'Cover': {
              visualState.cover = value.url;
              return;
            }
            default: {
              return;
            }
          }
        });
        setVisual({ ...visualState });

        let availabilityState = {};
        availabilitySettings.forEach(({ identifier, value }) => {
          switch (identifier) {
            case 'Store Availability': {
              availabilityState.store = value;
              return;
            }
            case 'Pickup Availability': {
              availabilityState.pickup = value;
              return;
            }
            case 'Delivery Availability': {
              availabilityState.delivery = value;
              return;
            }
            default: {
              return;
            }
          }
        });
        setAvailability({ ...availabilityState });
      },
    }
  );

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const response = await axios.post(`${DAILYOS_SERVER_URL}/api/menu`, {
        input: date,
      });
      console.log(response.data);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  // Effects
  React.useEffect(() => {
    if (availability && isStoreOpen()) {
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

  React.useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

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

  const isStoreOpen = () => {
    const current = new Date();
    if (availability.store.isOpen) {
      const minutes = current.getMinutes() + current.getHours() * 60;
      const from = availability.store.from.split(':');
      const to = availability.store.to.split(':');
      const fromMinutes = parseInt(from[1]) + parseInt(from[0]) * 60;
      const toMinutes = parseInt(to[1]) + parseInt(to[0]) * 60;

      if (minutes >= fromMinutes && minutes <= toMinutes) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

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

  if (availability && !isStoreOpen())
    return (
      <>
        <Header title='Home' search options navigation={props.navigation} />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontWeight: 500, fontSize: 24, marginBottom: 20 }}>
            Store Closed
          </Text>
          <Text style={{ fontSize: 20 }}>{availability.store.shutMessage}</Text>
        </View>
      </>
    );

  const _renderItem = ({ section, index }) => {
    let numColumns = width > 1000 ? 3 : 1;

    if (index % numColumns !== 0) return null;

    const items = [];

    for (let i = index; i < index + numColumns; i++) {
      if (i >= section.data.length) {
        break;
      }

      items.push(
        <Card
          {...props}
          type={section.data[i].type}
          key={Math.floor(Math.random() * 100000)}
          id={section.data[i].id}
        />
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {items}
      </View>
    );
  };

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
                style={styles.selectStyle}
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
  let sectionsData = [];

  if (data.length) {
    data.forEach((category, _id) => {
      pickerData.push(category.name);
      let dataItems = [];
      Object.keys(category)?.forEach((key) => {
        if (
          key != 'name' &&
          key != '__typename' &&
          key != 'title' &&
          key != 'data'
        ) {
          category[key]?.forEach((el) =>
            dataItems.push({
              type: key,
              id: el,
            })
          );
        }
      });
      sectionsData.push({
        title: category.name,
        data: dataItems,
      });
    });
  }
  data.forEach((el) => {
    el.title = el.name;
    el.data = [{ ...el }];
  });
  return (
    <>
      <Header
        title={brand?.name ? brand?.name : 'Home'}
        search
        options
        navigation={props.navigation}
      />
      <ScrollView style={styles.home}>
        <View style={styles.img_container}>
          <Image
            source={{
              uri: visual.cover,
            }}
            style={styles.cover_image}
          />
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
          }}
        >
          <Image
            style={{ width: 50, height: 50, borderRadius: 25 }}
            source={{ uri: brand.logo }}
          />
          <Text style={styles.title}>{brand.name}</Text>
        </View>
        <View style={styles.headerContainer}>
          <SafetyBanner {...props} />
        </View>

        <View style={styles.flexContainerMiddle}>
          <View style={styles.cardContainer}>
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
                style={styles.selectStyle}
                value={pickerData[selectedIndex.row]}
                onSelect={(_selectedIndex) => {
                  setselectedPickerItem(_selectedIndex.row);
                  setSelectedIndex(_selectedIndex);
                  sectionListRef.current.scrollToLocation({
                    animated: true,
                    itemIndex: 0,
                    sectionIndex: _selectedIndex.row,
                    viewOffset: 60,
                  });
                }}
              >
                {pickerData.map((title, key) => (
                  <SelectItem key={key} title={title} />
                ))}
              </Select>
            </View>
            <SectionList
              ref={sectionListRef}
              sections={data}
              style={{
                height: height - 16 * 4.125 - 80 - 48,
              }}
              stickySectionHeadersEnabled={true}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader={({ section: { title } }) => (
                <View style={{ backgroundColor: '#fff' }}>
                  <Text
                    style={[
                      styles.header,
                      { textAlign: 'center', fontSize: 12, color: 'gray' },
                    ]}
                  >
                    Now Showing
                  </Text>
                  <Text
                    style={[
                      styles.header,
                      { textAlign: 'center', fontSize: 18, color: 'gray' },
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              )}
              stickyHeaderIndices={[0]}
              renderItem={({ item: category }) => (
                <Products category={category} />
              )}
            />
          </View>
        </View>
        <View style={{ height: height * 0.08 }} />
        <Cart
          label={pickerData[selectedIndex.row]}
          to='OrderSummary'
          {...props}
          text='Checkout'
        />
      </ScrollView>
    </>
  );
};

const styles = EStyleSheet.create({
  home: {
    flex: 1,
    // alignItems: 'center',
    marginTop: 2,
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
    height: 80,
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
    padding: 10,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    paddingLeft: '2rem',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  selectStyle: {
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    userSelect: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    outlineWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderColor: '#E4E9F2',
    backgroundColor: '#F7F9FC',
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 40,
    paddingVertical: 7,
  },
});

export default Home;
