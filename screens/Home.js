import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  Modal,
  ActivityIndicator,
} from "react-native";

const { width, height } = Dimensions.get("screen");
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import axios from "axios";
import { Picker, DatePicker } from "native-base";
import { Feather } from "@expo/vector-icons";
import Cart from "../components/Cart";

class Home extends React.Component {
  state = {
    loading: true,
  };
  async componentDidMount() {
    try {
      // let res = await axios.get(
      //   "http://restaurantmealkits.com/api/menu/5e84484b6ab57abd3498d508"
      // );
      // let res_name = res.data.data.name
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.flexContainer}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.home}>
        <Tabs />
        <ScrollView style={{ flex: 1 }}>
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
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date(2018, 1, 1)}
                // maximumDate={new Date(2018, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"slide"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "#000" }}
                placeHolderTextStyle={{ color: "#000" }}
                onDateChange={(date) => console.log(date)}
                disabled={false}
                style={{ flex: 1 }}
              />
            </View>
            <Picker
              mode="dropdown"
              iosHeader="Category"
              iosIcon={<Feather name="arrow-down" />}
              style={styles.picker_placeholder}
              selectedValue={"key1"}
              onValueChange={(value) => console.log(value)}
            >
              <Picker.Item label="Wallet" value="key0" />
              <Picker.Item label="ATM Card" value="key1" />
              <Picker.Item label="Debit Card" value="key2" />
              <Picker.Item label="Credit Card" value="key3" />
              <Picker.Item label="Net Banking" value="key4" />
            </Picker>
          </View>
          {[1, 2, 3].map((data, _id) => {
            return <Card {...this.props} key={_id} data={data} />;
          })}
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <Cart text="Checkout" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  flexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
