import React from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import Block from "../components/Block";

const { height, width } = Dimensions.get("screen");
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

export default class Placeholder extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <ImageBackground
            source={Images.Onboarding}
            style={{ flex: 1, height: height, width, zIndex: 1 }}
          />
          <Block space="between" style={styles.padded}>
            <Block>
              <Block>
                <Block>
                  <Text style={{ color: "white", fontSize: 60 }}>
                    Placeholder
                  </Text>
                </Block>
                <Block>
                  <Text style={{ color: "white", fontSize: 60 }}>Screen</Text>
                </Block>
                <Block row>
                  <Text style={{ color: "white", fontSize: 60 }}>Dailykit</Text>
                </Block>
              </Block>
              <Text style={{ color: "white", fontSize: 35 }}>
                Under construction.
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: 16 * 2,
    zIndex: 3,
    position: "absolute",
    bottom: Platform.OS === "android" ? 16 * 2 : 16 * 3,
  },
  button: {
    width: width - 16 * 4,
    height: 16 * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },

  gradient: {
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
});
