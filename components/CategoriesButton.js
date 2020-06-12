import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scalaing';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useAppContext } from '../context/app';

const CategoriesButton = ({ title, id, onPress, selectedIndex, length }) => {
  const { visual } = useAppContext();

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
        backgroundColor: selectedIndex == id ? visual.color : '#fff',
        paddingVertical: 30,
        marginHorizontal: 10,
        width: width / length - 30,
        minWidth: 120,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: isHovered ? visual.color : '#333',
        // opacity: isHovered ? 0.6 : 1,
        shadowColor: isHovered ? '#111' : '#fff',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: isHovered ? 0.3 : 0.1,
        shadowRadius: 4.65,
        elevation: isHovered ? 24 : 4,
      }}
    >
      <Text
        style={[
          {
            textAlign: 'center',
            color:
              selectedIndex == id ? '#fff' : isHovered ? visual.color : '#333',
            fontWeight: selectedIndex == id || isHovered ? 'bold' : 'normal',
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
