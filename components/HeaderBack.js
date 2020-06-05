import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { height } from '../utils/Scalaing';

const HeaderBack = ({ title, navigation }) => {
   return (
      <TouchableOpacity
         onPress={() => navigation.goBack()}
         style={styles.header}
      >
         <Ionicons name="ios-arrow-back" size={24} />
         <Text style={styles.header_text}> {`    ${title}`}</Text>
      </TouchableOpacity>
   );
};
const styles = StyleSheet.create({
   header: {
      height: height * 0.07,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
   },
   header_text: {
      fontSize: 16,
   },
});

export default HeaderBack;
