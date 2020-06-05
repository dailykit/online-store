import React from 'react';
import { View } from 'native-base';
import { StyleSheet } from 'react-native';
import { height, width } from '../utils/Scalaing';

const Container = ({ children }) => {
   return (
      <View style={styles.container}>
         <View style={styles.content}>{children}</View>
      </View>
   );
};

export default Container;

const styles = StyleSheet.create({
   container: {
      maxWidth: width > 1280 ? 1280 : width,
      minHeight: height,
      backgroundColor: '#fff',
      alignItems: 'center',
   },
   content: {
      maxWidth: 768,
      height: '100%',
   },
});
