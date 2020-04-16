import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Picker } from "native-base";
import Summary from "../components/Summary";

const { width, height } = Dimensions.get("window");

export default class OrderSummary extends Component {
  render() {
    return (
      <View style={styles.conatiner}>
        <View style={styles.title_container}>
          <View style={styles.title_container_left}>
            <Text style={styles.deliver_on_text}>Deliver on</Text>
            <Text style={styles.time_text}>Monday, Dec 9</Text>
          </View>
          <View style={styles.title_container_middle}>
            <Text style={[styles.time_text, { textAlign: "center", flex: 1 }]}>
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
      </View>
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
  summary_container: {
    height: height * 0.2,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderTopColor: "#fff",
  },
  summary_title_conatiner: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  picker_container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summary_bottom_conatiner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  summary_title_conatiner_left: {
    flex: 1,
    justifyContent: "center",
  },
  summary_title_conatiner_right: {
    flex: 1,
    justifyContent: "center",
  },
  summary_title_text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summary_bottom_conatiner_left: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  summary_bottom_conatiner_right: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  button_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3fa4ff",
  },
  price_text: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button_container_left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3fa4ff",
    height: height * 0.04,
  },
  button_container_middle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#278ce8",
    height: height * 0.04,
  },
  button_container_right: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3fa4ff",
    height: height * 0.04,
  },
  quantity_text: {
    color: "white",
    fontSize: 16,
  },
});
