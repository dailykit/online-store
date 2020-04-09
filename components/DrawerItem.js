import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Block from "./Block";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            name="home"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      // case "Articles":
      //   return (
      //     <Icon
      //       name="spaceship"
      //       family="ArgonExtra"
      //       size={14}
      //       color={focused ? "white" : argonTheme.COLORS.PRIMARY}
      //     />
      //   );
      case "Profile":
        return (
          <Icon
            name="user"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.WARNING}
          />
        );
      // case "Account":
      //   return (
      //     <Icon
      //       name="calendar-date"
      //       family="ArgonExtra"
      //       size={14}
      //       color={focused ? "white" : argonTheme.COLORS.INFO}
      //     />
      //   );

      case "Log out":
        return <Icon />;
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null,
    ];

    return (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() =>
          title == "Profile"
            ? navigation.navigate("Placeholder")
            : navigation.navigate(title)
        }
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              style={{
                color: focused ? "white" : "rgba(0,0,0,0.5)",
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
});

export default DrawerItem;
