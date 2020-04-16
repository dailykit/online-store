import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import NavBar from "./NavBar";

import Icon from "./Icon";
import Block from "./Block";
import Input from "./Input";
import argonTheme from "../constants/Theme";

const { height, width } = Dimensions.get("window");

const BellButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate("Placeholder")}
  >
    <Icon
      size={16}
      name="bell"
      color={argonTheme.COLORS[isWhite ? "WHITE" : "ICON"]}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const BasketButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate("Placeholder")}
  >
    <Icon
      size={16}
      name="shopping-cart"
      color={argonTheme.COLORS[isWhite ? "WHITE" : "ICON"]}
    />
  </TouchableOpacity>
);

const SearchButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate("Placeholder")}
  >
    <Icon
      size={16}
      name="search"
      color={argonTheme.COLORS[isWhite ? "WHITE" : "ICON"]}
    />
  </TouchableOpacity>
);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };
  renderRight = () => {
    const { white, title, navigation } = this.props;

    if (title === "Title") {
      return [
        <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
        <BasketButton
          key="basket-title"
          navigation={navigation}
          isWhite={white}
        />,
      ];
    }

    switch (title) {
      case "Home":
        return [
          <BellButton
            key="chat-home"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-home"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Deals":
        return [
          <BellButton key="chat-categories" navigation={navigation} />,
          <BasketButton key="basket-categories" navigation={navigation} />,
        ];
      case "Categories":
        return [
          <BellButton
            key="chat-categories"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-categories"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Category":
        return [
          <BellButton
            key="chat-deals"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-deals"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Profile":
        return [
          <BellButton
            key="chat-profile"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-deals"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Product":
        return [
          <SearchButton
            key="search-product"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-product"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Search":
        return [
          <BellButton
            key="chat-search"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-search"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      case "Settings":
        return [
          <BellButton
            key="chat-search"
            navigation={navigation}
            isWhite={white}
          />,
          <BasketButton
            key="basket-search"
            navigation={navigation}
            isWhite={white}
          />,
        ];
      default:
        break;
    }
  };

  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      ...props
    } = this.props;

    const noShadow = [
      "Search",
      "Categories",
      "Deals",
      "Placeholder",
      "Profile",
    ].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
      { height: 40 },
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor },
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: "center" }}
          left={
            <Icon
              name={back ? "chevron-left" : "menu"}
              family="entypo"
              size={20}
              onPress={this.handleLeftPress}
              color={
                iconColor ||
                (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)
              }
              style={{ marginTop: 2 }}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? "WHITE" : "HEADER"] },
            titleColor && { color: titleColor },
          ]}
          {...props}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: "relative",
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    paddingVertical: 0,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: argonTheme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: 16 / 2,
    width: 16 / 2,
    position: "absolute",
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: argonTheme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: argonTheme.COLORS.ICON,
  },
  search: {
    height: 0,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER,
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: argonTheme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "400",
    color: argonTheme.COLORS.HEADER,
  },
});

export default withNavigation(Header);
