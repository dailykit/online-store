import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { DrawerItem as DrawerCustomItem } from '../components';
import Images from '../constants/Images';

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const screens = [
    { title: 'Home', screen: 'Home' },
    { title: 'Cart', screen: 'OrderSummary' },
    { title: 'Profile', screen: 'Profile' },
    { title: 'Orders', screen: 'OrderHistory' },
    { title: 'Log out', screen: 'DeliveryScreen' },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={Images.Logo} />
      </View>
      <View
        style={{
          paddingLeft: 8,
          paddingRight: 14,
          flex: 1,
        }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item.title}
                screen={item.screen}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
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
    justifyContent: 'center',
    flex: 0.06,
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
});

export default CustomDrawerContent;
