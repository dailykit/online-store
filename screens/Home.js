import React, { useEffect, useState, useRef } from 'react';
import {
   ScrollView,
   View,
   Image,
   Text,
   SectionList,
   TouchableOpacity,
} from 'react-native';
import { Datepicker, Spinner } from '@ui-kitten/components';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
   CREATE_CUSTOMER,
   CUSTOMER,
   CUSTOMER_DETAILS,
   STORE_SETTINGS,
} from '../graphql';
import { height, width } from '../utils/Scalaing';
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
import { CategoryBanner } from '../components/CategoryBanner';
import DrawerLayout from '../components/DrawerLayout';

const Home = props => {
   const [selectedIndex, setSelectedIndex] = useState(0);
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
         onSubscriptionData: data => {
            const brandSettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'brand'
            );
            const visualSettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'visual'
            );
            const availabilitySettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'availability'
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

   const fetchData = async date => {
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

   // Query
   const [customerDetails] = useLazyQuery(CUSTOMER_DETAILS, {
      variables: {
         keycloakId: user.sub || user.userid,
      },
      onCompleted: data => {
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
      onError: error => {
         console.log(error);
      },
   });

   // Subscription
   const { error } = useSubscription(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
         email: user.email,
      },
      onSubscriptionData: data => {
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
            <Spinner size="large" />
         </View>
      );
   }
   if (availability && !isStoreOpen())
      return (
         <View>
            <ScrollView>
               <View>
                  <Header
                     title="Home"
                     search
                     options
                     navigation={props.navigation}
                  />
                  <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontWeight: 500,
                           fontSize: 24,
                           marginBottom: 20,
                        }}
                     >
                        Store Closed
                     </Text>
                     <Text style={{ fontSize: 20 }}>
                        {availability.store.shutMessage}
                     </Text>
                  </View>
               </View>
               <View style={styles.flexContainer}>
                  <Spinner />
               </View>
               <View style={{ height: height * 0.08 }} />
            </ScrollView>
            <Cart to="OrderSummary" {...props} text="Checkout" />
         </View>
      );
   let pickerData = [];
   let sectionsData = [];

   if (data.length) {
      data.forEach((category, _id) => {
         pickerData.push(category.name);
         let dataItems = [];
         Object.keys(category)?.forEach(key => {
            if (
               key != 'name' &&
               key != '__typename' &&
               key != 'title' &&
               key != 'data'
            ) {
               category[key]?.forEach(el =>
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
   data.forEach(el => {
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
            {/* <Tabs /> */}
            <View style={styles.img_container}>
               <Image
                  source={{
                     uri: visual.cover,
                  }}
                  style={styles.cover_image}
               />
            </View>
            <View style={styles.headerContainer}>
               <SafetyBanner {...props} />
            </View>

            <View style={styles.flexContainerMiddle}>
               <View style={styles.cardContainer}>
                  <View style={styles.picker_container}>
                     <Text
                        style={{
                           width: width * 0.5,
                           fontWeight: 'bold',
                           paddingLeft: 20,
                           fontSize: 16,
                        }}
                     >
                        Order For
                     </Text>
                     <Datepicker
                        date={calendarDate}
                        style={{
                           width: width * 0.5,
                        }}
                        onSelect={_date => {
                           setcalendarDate(_date);
                           fetchData({
                              year: moment(_date).year(),
                              month: moment(_date).month(),
                              day: moment(_date).date(),
                           });
                        }}
                     />
                  </View>
                  <View style={styles.picker_container}>
                     <ScrollView
                        horizontal
                        style={{
                           flex: 1,
                        }}
                     >
                        {pickerData.map((title, key) => (
                           <TouchableOpacity
                              onPress={() => {
                                 setSelectedIndex(key);
                                 sectionListRef.current.scrollToLocation({
                                    animated: true,
                                    itemIndex: 0,
                                    sectionIndex: key,
                                    viewOffset: 60,
                                 });
                              }}
                              style={{
                                 paddingHorizontal: 10,
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 height: 80,
                                 flexDirection: 'row',
                              }}
                           >
                              <Text
                                 style={{
                                    color:
                                       selectedIndex == key
                                          ? '#3fa4ff'
                                          : 'grey',
                                    borderBottomColor:
                                       selectedIndex == key
                                          ? '#3fa4ff'
                                          : 'grey',
                                    paddingBottom: 4,
                                    borderBottomWidth:
                                       selectedIndex == key ? 3 : 0,
                                    fontWeight:
                                       selectedIndex == key ? 'bold' : 'normal',
                                    marginTop: 10,
                                 }}
                              >
                                 {title}
                              </Text>
                           </TouchableOpacity>
                        ))}
                     </ScrollView>
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
                        <CategoryBanner category={title} />
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
               to="OrderSummary"
               {...props}
               text="Checkout"
            />
            <DrawerLayout />
         </ScrollView>
      </>
   );
};

const styles = EStyleSheet.create({
   home: {
      flex: 1,
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
      width: width,
      justifyContent: 'center',
      backgroundColor: '#fff',
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
