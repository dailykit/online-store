import React from "react";
import { StyleSheet, Dimensions, ScrollView, View } from "react-native";
import Block from "../components/Block";

import { Card } from "../components";
import articles from "../constants/articles";
const { width, height } = Dimensions.get("screen");
import Tabs from "../components/Tabs";

class Home extends React.Component {
  renderArticles = () => {
    return (
      <>
        <Tabs />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block flex>
            <Card item={articles[0]} horizontal />
            <Card item={articles[1]} horizontal />
            <Card item={articles[2]} horizontal />
            <Card item={articles[3]} horizontal />
            <Card item={articles[4]} horizontal />
          </Block>
        </ScrollView>
      </>
    );
  };

  render() {
    return (
      <Block flex center style={[styles.home]}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - 16 * 2,
    paddingVertical: 16,
  },
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});

export default Home;
