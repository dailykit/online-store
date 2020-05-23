import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Datepicker } from "@ui-kitten/components";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import moment from "moment";
} from 'react-native';
import { Datepicker } from '@ui-kitten/components';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';

import { GET_MENU, CUSTOMERS, CREATE_CUSTOMER } from "../graphql";
const { width, height } = Dimensions.get("screen");
import Card from "../components/Card";
import Cart from "../components/Cart";
import { SafetyBanner } from "../components/SafetyBanner";

import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";

const Home = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedPickerItem, setselectedPickerItem] = useState(0);
  const [calendarDate, setcalendarDate] = useState(new Date());
  const [user, setUser] = useState({ email: undefined, userid: undefined });

  const { loading, data, error, refetch } = useQuery(GET_MENU, {
    variables: {
      year: moment().year(),
      month: moment().month(),
      day: moment().date(),
    },
  });

  // Mutations
  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    onCompleted: async (data) => {
      await AsyncStorage.setItem(
        "customerId",
        data.createCustomer.id.toString()
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Queries
  const [customers] = useLazyQuery(CUSTOMERS, {
    onCompleted: async (data) => {
      if (data.customers.length) {
        await AsyncStorage.setItem(
          "customerId",
          data.customers[0].id.toString()
        );
      } else {
        createCustomer({
          variables: {
            object: {
              dailyKeyUserId: user.userid,
              email: user.email,
              source: "RMK",
            },
          },
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { loading, data, error } = useQuery(GET_MENU, {
    variables: { year: date.year, month: date.month, day: date.year },
  });

  // Effects
  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      const userid = await AsyncStorage.getItem("userid");
      setUser({
        email,
        userid,
      });
      customers({
        variables: {
          dailyKeyID: userid,
          email,
        },
      });
    })();
  }, []);

  if (loading) {
  if (loading || data.getMenu.length == 0) {
    return (
      <View style={styles.home}>
        {/* <Tabs /> */}
        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.img_container}>
            <Image
              source={{
                uri:
                  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
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
                  setdate({
                    day: moment(_date).date(),
                    month: moment(_date).month(),
                    year: moment(_date).year(),
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
                <SelectItem title={""} />
              </Select>
            </View>
          </View>
          <View style={styles.flexContainer}>
            <ActivityIndicator />
          </View>
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <Cart to="OrderSummary" {...props} text="Checkout" />
      </View>
    );
  }
  let pickerData = [];
  let menuItems = {};

  data.getMenu.forEach((category, _id) => {
    pickerData.push(category.name);
    menuItems[category.name] = {};
    Object.keys(category).forEach((key) => {
      if (key != "name" && key != "__typename") {
        menuItems[category.name][key] = category[key];
      }
    });
  });
  console.log(pickerData[selectedPickerItem]);
  console.log(selectedPickerItem);

  return (
    <View style={styles.home}>
      {/* <Tabs /> */}
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.img_container}>
          <Image
            source={{
              uri:
                "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
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
                refetch({
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
      <Cart to="OrderSummary" {...props} text="Checkout" />
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
    resizeMode: "cover",
    height: null,
    width: null,
  },
  picker_container: {
    height: height * 0.06,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },
  picker_placeholder: {
    flex: 1,
    justifyContent: "center",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: '1.2rem',
    padding: 20,
    fontWeight: "bold",
  },
});

export default Home;
