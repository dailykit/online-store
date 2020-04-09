import React from "react";
import { useSafeArea } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Image, Text } from "react-native";
import Block from "../components/Block";

import Images from "../constants/Images";
import { DrawerItem as DrawerCustomItem } from "../components";

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  // const screens = ["Home", "Profile", "Account", "Articles"];
  const screens = ["Home", "Profile", "Placeholder"];
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.06} style={styles.header}>
        <Image style={styles.logo} source={Images.Logo} />
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text
              color="#8898AA"
              style={{ marginTop: 16, marginLeft: 8, color: "#8898AA" }}
            >
              Lorem Ipsum
            </Text>
          </Block>
          <DrawerCustomItem title="Placeholder" navigation={navigation} />
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: 16,
    paddingTop: 16 * 3,
    justifyContent: "center",
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "contain",
  },
});

export default CustomDrawerContent;
