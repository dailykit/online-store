import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

const ServingSelect = ({
  index,
  isSelected,
  setServingIndex,
  size,
  price,
  display,
  type,
  id,
  setproductOptionId,
  customizableProduct,
  simpleRecipeProductId,
  name,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setServingIndex(index - 1);
        if (customizableProduct) {
          setproductOptionId(id, price, simpleRecipeProductId, name);
        } else {
          setproductOptionId(id, price);
        }
      }}
      style={[
        styles.servingSelectContainer,
        {
          borderColor: isSelected ? '#3fa4ff' : '#ececec',
          backgroundColor: '#fff',
          display: display == type ? 'flex' : 'none',
        },
      ]}
    >
      <View style={styles.servingSelectContainer_one}>
        <Feather size={14} name='user' />
        <Text style={{ fontWeight: 'bold' }}>
          {'    '}
          {size}
        </Text>
      </View>
      <View style={styles.servingSelectContainer_two}>
        <Text style={styles.price_text}>$ {price}</Text>
      </View>
      <View style={styles.servingSelectContainer_three}>
        {isSelected && (
          <View style={styles.done_container}>
            <MaterialIcons name='done' size={16} color='#fff' />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  done_container: {
    backgroundColor: '#3fa4ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  servingSelectContainer: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 5,
    borderColor: '#fff',
  },
  servingSelectContainer_one: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  servingSelectContainer_two: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingSelectContainer_three: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServingSelect;
