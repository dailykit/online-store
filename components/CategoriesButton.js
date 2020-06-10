import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scalaing';
import EStyleSheet from 'react-native-extended-stylesheet';

const CategoriesButton = ({ title, id, onPress, selectedIndex, length }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <TouchableOpacity
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPress={() => onPress(id)}
      style={{
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        backgroundColor: selectedIndex == id ? '#3fa4ff' : '#e3e3e3',
        paddingVertical: 30,
        marginHorizontal: 10,
        width: width / length - 30,
        minWidth: 120,
        opacity: isHovered ? 0.6 : 1,
      }}
    >
      <Text
        style={[
          {
            color: selectedIndex == id ? '#fff' : 'black',
            fontWeight: selectedIndex == id ? 'bold' : 'normal',
          },
          styles.button,
        ]}
      >
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoriesButton;

const styles = EStyleSheet.create({
  button: {
    fontSize: '$s',
  },
});
