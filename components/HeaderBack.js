import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../utils/Scalaing';

const HeaderBack = ({ title, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
      <Ionicons name='ios-arrow-back' size={24} />
      <Text style={styles.header_text}> {`    ${title}`}</Text>
    </TouchableOpacity>
  );
};
const styles = EStyleSheet.create({
  header: {
    height: height * 0.07,
    padding: 10,
    paddingHorizontal: width > 768 ? 120 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header_text: {
    fontSize: '$m',
  },
});

export default HeaderBack;
