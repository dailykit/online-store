import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Picker } from "native-base";
import Summary from "../components/Summary";

import { CartSummary } from "../components/Cart";

const { width, height } = Dimensions.get("window");

export default class OrderSummary extends Component {
  render() {
    return (
      <>
        <ScrollView style={styles.conatiner}>
          <View style={styles.title_container}>
            <View style={styles.title_container_left}>
              <Text style={styles.deliver_on_text}>Deliver on</Text>
              <Text style={styles.time_text}>Monday, Dec 9</Text>
            </View>
            <View style={styles.title_container_middle}>
              <Text
                style={[styles.time_text, { textAlign: "center", flex: 1 }]}
              >
                9am - 10am
              </Text>
            </View>
            <View style={styles.title_container_right}>
              <View style={styles.edit}>
                <Text style={styles.edit_text}>edit{"  "}</Text>
                <Ionicons
                  style={{ paddingTop: 2 }}
                  size={16}
                  name="ios-arrow-forward"
                />
              </View>
            </View>
          </View>
          {[1, 2, 3].map((item, index) => {
            return <Summary item={item} key={index} />;
          })}
          <View style={styles.billing_details}>
            <View style={styles.bill_child_container}>
              <Text style={styles.billing_details_title_text}>
                Bill Details
              </Text>
            </View>
            <View style={styles.bill_child_container}>
              <View style={styles.bill_child_container_left}>
                <Text style={styles.billing_details_left_text}>Item Total</Text>
              </View>
              <View style={styles.bill_child_container_right}>
                <Text style={styles.billing_details_right_text}>$ 4.50</Text>
              </View>
            </View>
            <View style={styles.bill_child_container}>
              <View style={styles.bill_child_container_left}>
                <Text style={styles.billing_details_left_text}>
                  Delivery Fee
                </Text>
              </View>
              <View style={styles.bill_child_container_right}>
                <Text style={styles.billing_details_right_text}>$ 1.50</Text>
              </View>
            </View>
            <View style={styles.bill_child_container}>
              <View style={styles.bill_child_container_left}>
                <Text style={styles.billing_details_left_text}>Tax @2.5%</Text>
              </View>
              <View style={styles.bill_child_container_right}>
                <Text style={styles.billing_details_right_text}>$ 2.50</Text>
              </View>
            </View>
            <View style={styles.bill_child_container}>
              <View style={styles.bill_child_container_left}>
                <Text style={styles.billing_details_left_text}>Tip</Text>
              </View>
              <View style={styles.bill_child_container_right}>
                <Text
                  style={[
                    styles.billing_details_right_text,
                    {
                      fontWeight: "bold",
                      color: "#3fa4fd",
                    },
                  ]}
                >
                  Add
                </Text>
              </View>
            </View>
            <View style={styles.bill_child_container}>
              <View style={styles.bill_child_container_left}>
                <Text
                  style={[
                    styles.billing_details_left_text,
                    { fontWeight: "bold" },
                  ]}
                >
                  To Pay
                </Text>
              </View>
              <View style={styles.bill_child_container_right}>
                <Text
                  style={[
                    styles.billing_details_right_text,
                    { fontWeight: "bold" },
                  ]}
                >
                  $ 7.50
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <CartSummary text="CONFIRM AND PAY" />
      </>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  title_container: {
    height: height * 0.1,
    width,
    flexDirection: "row",
    backgroundColor: "#ededed",
    paddingVertical: 10,
  },
  title_container_left: {
    flex: 1,
    justifyContent: "space-between",
    padding: 5,
    paddingLeft: 20,
  },
  title_container_middle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 5,
    paddingLeft: 20,
  },
  title_container_right: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 20,
    justifyContent: "flex-end",
  },
  deliver_on_text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
  },
  edit: {
    flexDirection: "row",
    alignItems: "center",
  },
  time_text: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
  },
  edit_text: {
    fontSize: 16,
  },
  billing_details: {
    paddingHorizontal: 30,
  },
  bill_child_container: {
    flexDirection: "row",
    height: 40,
  },
  bill_child_container_left: {
    flex: 4,
  },
  bill_child_container_right: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  billing_details_right_text: {
    flex: 1,
    fontSize: 16,
  },
  billing_details_title_text: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "bold",
  },
  billing_details_left_text: {
    fontSize: 16,
  },
});
