import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from "react-native";
import Block from "./Block";

const { height, width } = Dimensions.get("window");

import { argonTheme } from "../constants";

class Card extends React.Component {
  render() {
    const {
      navigation,
      item,
      horizontal,
      full,
      style,
      ctaColor,
      imageStyle,
    } = this.props;

    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow,
    ];

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Placeholder")}
        >
          <Block flex style={imgContainer}>
            <Image source={{ uri: item.image }} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Placeholder")}
        >
          <Block flex space="between" style={styles.cardDescription}>
            <Text size={14} style={styles.cardTitle}>
              {item.title}
            </Text>
            <Text
              size={12}
              style={{
                color: ctaColor || argonTheme.COLORS.ACTIVE,
                fontWeight: "bold",
              }}
            >
              {item.cta}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: argonTheme.COLORS.WHITE,
    marginVertical: 10,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16,
    borderRadius: 5,
    height: height * 0.2,
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  cardDescription: {
    padding: 5,
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: "hidden",
    flex: 1,
  },
  image: {
    borderRadius: 3,
    resizeMode: "cover",
    flex: 1,
    height: null,
    width: null,
  },
  horizontalImage: {
    width: "auto",
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    flex: 1,
  },
  fullImage: {
    height: 214,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default withNavigation(Card);
