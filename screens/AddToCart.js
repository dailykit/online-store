import React, { Component, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";

import Cart from "../components/Cart";

const { width, height } = Dimensions.get("window");

const ServingSelect = ({ index, isSelected, setServingIndex }) => {
  return (
    <TouchableOpacity
      onPress={() => setServingIndex(index - 1)}
      style={[
        styles.servingSelectContainer,
        { borderColor: isSelected ? "#3fa4ff" : "#ececec" },
      ]}
    >
      <View style={styles.servingSelectContainer_one}>
        <Feather size={14} name="user" />
        <Text style={{ fontWeight: "bold" }}>
          {"    "}
          {index}
        </Text>
      </View>
      <View style={styles.servingSelectContainer_two}>
        <Text style={styles.price_text}>$ 2.50</Text>
      </View>
      <View style={styles.servingSelectContainer_three}>
        {isSelected && (
          <View style={styles.done_container}>
            <MaterialIcons name="done" size={16} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const Item = ({
  isLast,
  isSelected,
  setSelected,
  _id,
  openModal,
  navigation,
}) => {
  const [typeSelected, setTypeSelected] = useState(true);
  const [servingIndex, setServingIndex] = useState(0);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          console.log(_id);
          setSelected(_id);
        }}
        style={[
          styles.item_container,
          {
            borderBottomWidth: isLast ? 0 : 1,
            flex: isSelected ? 8 : 7,
          },
        ]}
      >
        <View
          style={[
            styles.item_container_one,
            { display: isSelected ? "flex" : "none" },
          ]}
        >
          <Text style={styles.item_image_title}>Dal</Text>
          <Image
            source={{
              uri:
                "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            }}
            style={styles.item_image}
          />
        </View>
        <View
          style={[
            styles.item_container_two,
            {
              paddingTop: isSelected ? 15 : 0,
              paddingLeft: isSelected ? 10 : 0,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.item_title}>Dal Makhani </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
              <Feather size={14} name="info" />
            </TouchableOpacity>
          </View>
          <Text style={styles.item_chef}>Gordon Ramsay</Text>
          <Text style={styles.item_category}>vegeterian</Text>
        </View>
        <View style={styles.item_container_three}>
          <View style={styles.item_three_upper}>
            <TouchableOpacity>
              <Text style={styles.options_text}>3 options</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item_three_lower}>
            <Text style={styles.item_details}>
              Mealkit | <Feather name="user" />{" "}
              <Text style={{ fontWeight: "bold" }}>1</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {isSelected && (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.type_container}>
            <View style={{ flex: 1 }}></View>
            <View style={styles.type_container_right}>
              <TouchableOpacity
                style={[
                  styles.type_button,
                  typeSelected ? styles.selected_type_conatiner : {},
                ]}
                onPress={() => setTypeSelected(!typeSelected)}
              >
                <Text style={styles.type_text}>Meal Kit</Text>
                {typeSelected && (
                  <View style={styles.done_container}>
                    <MaterialIcons name="done" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTypeSelected(!typeSelected)}
                style={[
                  styles.type_button,
                  !typeSelected ? styles.selected_type_conatiner : {},
                ]}
              >
                <Text style={styles.type_text}>Ready To Eat</Text>
                {!typeSelected && (
                  <View style={[styles.done_container]}>
                    <MaterialIcons name="done" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.item_chef}>Avaliable Servings:</Text>
          {[1, 2, 3, 4, 5, 6].map((item_data, key) => {
            return (
              <ServingSelect
                key={key}
                index={key + 1}
                isSelected={servingIndex == key ? true : false}
                setServingIndex={(index) => setServingIndex(index)}
              />
            );
          })}
        </View>
      )}
    </>
  );
};

export default class ModalContent extends Component {
  state = {
    selected: 0,
    modalVisible: false,
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.title_container}>
            <View style={styles.details}>
              <Text style={styles.title}>Dal Makhani</Text>
            </View>
            <View style={styles.close_container}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <AntDesign size={30} name="close" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.item_parent_container}>
            {[1, 2, 3].map((data, _id) => {
              let last = false;
              let selected = this.state.selected;
              let isSelected = selected == _id ? true : false;
              if (_id == 2) {
                last = true;
              }
              return (
                <Item
                  isSelected={isSelected}
                  _id={_id}
                  setSelected={(index) => this.setState({ selected: index })}
                  isLast={last}
                  key={_id}
                  openModal={() => this.setState({ modalVisible: true })}
                  navigation={this.props.navigation}
                />
              );
            })}
          </View>
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <Cart {...this.props} text="Proceed" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  item_title: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
  },
  item_chef: {
    color: "gray",
    fontSize: 12,
  },
  item_category: {
    backgroundColor: "#56b783",
    color: "white",
    width: 70,
    textAlign: "center",
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 12,
  },
  title_container: {
    height: 100,
    flexDirection: "row",
    padding: 20,
  },
  close_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  card_container: {
    height: height * 0.55,
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: {},
  },
  card_title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card_title_text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  is_customizable: {
    fontSize: 8,
    color: "gray",
  },
  item_parent_container: {
    flex: 5,
  },
  item_container: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 5,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 20,
  },
  item_container_one: {
    flex: 2,
    position: "relative",
    paddingTop: 20,
  },
  item_container_two: {
    flex: 4,
    paddingTop: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  item_container_three: {
    flex: 2,
    justifyContent: "space-between",
  },
  bottom_container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  item_image_title: {
    position: "absolute",
    zIndex: 8,
    color: "gray",
    fontWeight: "bold",
  },
  item_image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },
  item_title: {
    fontSize: 14,
  },
  item_chef: {
    color: "gray",
    fontSize: 10,
  },
  item_category: {
    backgroundColor: "#56b783",
    color: "white",
    width: 70,
    textAlign: "center",
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 10,
  },
  options_text: {
    color: "#3fa4fd",
    textAlign: "right",
    fontSize: 12,
  },
  item_details: {
    textAlign: "right",
  },
  price: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  add_to_cart_container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#3fa4ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  add_to_card_text: {
    color: "white",
    fontSize: 14,
  },
  price_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  details: {
    justifyContent: "center",
  },
  type_container: {
    height: height * 0.1,
    flexDirection: "row",
  },
  type_container_right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
  },
  type_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
  },
  done_container: {
    backgroundColor: "#3fa4ff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  selected_type_conatiner: {
    backgroundColor: "#fff",
    borderRadius: 1,
    borderWidth: 2,
    borderColor: "#d9d9d9",
  },
  servingSelectContainer: {
    height: 50,
    flexDirection: "row",
    borderWidth: 1,
    marginBottom: 5,
    borderColor: "#ececec",
  },
  servingSelectContainer_one: {
    flex: 7,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 20,
  },
  servingSelectContainer_two: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  servingSelectContainer_three: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
