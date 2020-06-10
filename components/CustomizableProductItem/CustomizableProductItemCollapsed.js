import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import InventoryProductCollapsed from '../InventoryProductItem/InventoryProductItemCollapsed';
import SimpleProductItemCollapsed from '../SimpleProductItem/SimpleProductItemCollapsed';
import { stylesCollapsed as styles } from './styles';

const CustomizableProductItemCollapsed = ({
  _id,
  setSelected,
  isLast,
  navigation,
  setExpanded,
  data,
  label,
  independantItem,
  numberOfOptions,
  tunnelItem,
}) => {
  if (data?.simpleRecipeProduct !== null) {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (!independantItem) {
              setSelected(_id);
              setExpanded(true);
            } else {
              setExpanded(true);
            }
          }}
        >
          <Text style={[styles.item_chef, styles.options_text]}>
            {numberOfOptions} options <Ionicons name='ios-arrow-down' />
          </Text>
        </TouchableOpacity>
        <SimpleProductItemCollapsed
          navigation={navigation}
          data={data.simpleRecipeProduct}
          tunnelItem={tunnelItem}
        />
      </>
    );
  } else {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (!independantItem) {
              setSelected(_id);
              setExpanded(true);
            } else {
              setExpanded(true);
            }
          }}
        >
          <Text style={[styles.item_chef, styles.options_text]}>
            {numberOfOptions} options <Ionicons name='ios-arrow-down' />
          </Text>
        </TouchableOpacity>
        <InventoryProductCollapsed
          navigation={navigation}
          data={data.inventoryProduct}
          tunnelItem={tunnelItem}
        />
      </>
    );
  }
};

export default CustomizableProductItemCollapsed;
