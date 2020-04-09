import React from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

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
                  <Text color="white" size={60}>
                    Placeholder
                  </Text>
                </Block>
                <Block>
                  <Text color="white" size={60}>
                    Screen
                  </Text>
                </Block>
                <Block row>
                  <Text color="white" size={60}>
                    Dailykit
                  </Text>
                </Block>
              </Block>
              <Text
                size={16}
                color="rgba(255,255,255,0.6)"
                style={{ marginTop: 35 }}
              >
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
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: "absolute",
    bottom:
      Platform.OS === "android" ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
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
