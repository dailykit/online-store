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
        <ScrollView>
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
            <Text style={styles.picker_placeholder}>Picker 1</Text>
            <Text style={styles.picker_placeholder}>Picker 2</Text>
          </View>
          {[1, 2, 3].map((data, _id) => {
            return <Card key={_id} data={data} />;
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {},
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },
  picker_placeholder: {
    flex: 1,
    textAlign: "center",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
