import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default class Cart extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("OrderSummary")}
        style={styles.container}
      >
        <View style={styles.container_left}>
          <Text style={styles.text}>$ 2.50</Text>
        </View>
        <View style={styles.container_right}>
          <Text style={styles.text}>
            {this.props.text}
            {"    "}
          </Text>
          <Ionicons
            name="ios-arrow-forward"
            color="#fff"
            size={20}
            style={{ marginTop: 2 }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export class CartSummary extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container_left}>
          <Text style={[styles.text, { fontSize: 18 }]}>2 items | $ 2.50</Text>
          <Text style={[styles.text, { fontSize: 10 }]}>
            *extra charges may apply
          </Text>
        </View>
        <View style={styles.container_right}>
          <Text style={styles.text}>
            {this.props.text}
            {"    "}
          </Text>
          <Ionicons
            name="ios-arrow-forward"
            color="#fff"
            size={20}
            style={{ marginTop: 2 }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.08,
    width,
    backgroundColor: "#3fa4ff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  container_left: {
    flex: 2,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  container_right: {
    flex: 3,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
