import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HeaderBack = ({ title, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
      <Ionicons name='ios-arrow-back' size={24} />
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