import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CustomizableProductItem from '../CustomizableProductItem';
import SimpleProductItem from '../SimpleProductItem';
import InventoryProductItem from '../InventoryProductItem';
import { COMBO_PRODUCT } from '../../graphql';
import { useQuery } from '@apollo/react-hooks';

const { width, height } = Dimensions.get('window');

const ComboProduct = ({
  tunnelItem,
  navigation,
  setcardData,
  id,
  setcartItem,
  setIsLastComboItem,
  setCurrentComboProductIndex,
  setnumberOfComboProductItem,
  currentComboProductIndex,
  setPrice,
}) => {
  const [selected, setSelected] = useState(0);

  const [comboProductsArray, setcomboProductsArray] = useState([]);

  const { data, loading, error } = useQuery(COMBO_PRODUCT, {
    variables: { id },
    onCompleted: (_data) => {
      let items = _data;
      if (_data?.comboProduct?.comboProductComponents === undefined) return;
      if (!tunnelItem) {
        setcardData(_data.comboProduct);
        let price = 0;
        _data.comboProduct.comboProductComponents.forEach((product) => {
          if (product.inventoryProductId !== null) {
            price =
              price +
              parseFloat(
                product.inventoryProduct.inventoryProductOptions[0].price[0]
                  .value
              );
          }
          if (product.simpleRecipeProductId !== null) {
            price =
              price +
              parseFloat(
                product.simpleRecipeProduct.simpleRecipeProductOptions[0]
                  .price[0].value
              );
          }
          if (product.customizableProductId !== null) {
            price =
              price +
              parseFloat(
                product.customizableProduct?.customizableProductOptions[0]
                  ?.simpleRecipeProduct?.simpleRecipeProductOptions[0]?.price[0]
                  ?.value
              );
          }
        });
        setPrice(price);
      }
      if (tunnelItem) {
        setcartItem(comboProductsArray);
        setnumberOfComboProductItem(
          items.comboProduct.comboProductComponents.length
        );
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.flexContainer}>
        <ActivityIndicator />
      </View>
    );
  }
  if (data == null || data == undefined) {
    return <Text>Bad Data / Empty comboProduct product id {id}</Text>;
  }

  let { comboProduct } = data;
  let comboProductComponents = comboProduct?.comboProductComponents;
  if (comboProductComponents == undefined) return <Text>Bad Data</Text>;
  let selectedArr = data?.comboProduct?.comboProductComponents?.map(
    (el, _id) => false
  );
  return (
    <View style={styles.container}>
      <View style={styles.item_parent_container}>
        {comboProductComponents.map((el, _id) => {
          let last = false;
          let isSelected = false;
          if (!tunnelItem) {
            isSelected = selected == _id;
            if (_id == comboProductComponents.length - 1) {
              last = true;
            }
          } else {
            last = false;
            isSelected = currentComboProductIndex == _id;
            if (_id == comboProductComponents.length - 1) {
              last = true;
            }
          }
          if (el.customizableProductId !== null) {
            return (
              <CustomizableProductItem
                isSelected={isSelected}
                _id={_id}
                data={el}
                setSelected={(index) => {
                  selectedArr[index] = true;
                  setSelected(index);
                  if (selectedArr.every((item) => item == true)) {
                    setIsLastComboItem(true);
                  }
                }}
                isLast={last}
                key={_id}
                navigation={navigation}
                tunnelItem={tunnelItem}
                id={el.customizableProductId}
                setcartItem={setcartItem}
                setDefault={(item) => setcomboProductsArray(item)}
                name={data.comboProduct?.name}
              />
            );
          }
          if (el.simpleRecipeProductId !== null) {
            return (
              <SimpleProductItem
                isSelected={isSelected}
                _id={_id}
                data={el}
                setSelected={(index) => {
                  selectedArr[index] = true;
                  setSelected(index);
                  if (selectedArr.every((item) => item == true)) {
                    setIsLastComboItem(true);
                  }
                }}
                isLast={last}
                key={_id}
                navigation={navigation}
                id={el.simpleRecipeProductId}
                tunnelItem={tunnelItem}
                setcartItem={setcartItem}
                name={data.comboProduct?.name}
              />
            );
          }
          if (el.inventoryProductId !== null) {
            return (
              <InventoryProductItem
                isSelected={isSelected}
                _id={_id}
                data={el}
                setSelected={(index) => {
                  selectedArr[index] = true;
                  setSelected(index);
                  console.log(selectedArr);
                  if (selectedArr.every((item) => item == true)) {
                    setIsLastComboItem(true);
                  }
                }}
                isLast={last}
                key={_id}
                navigation={navigation}
                id={el.inventoryProductId}
                tunnelItem={tunnelItem}
                setcartItem={setcartItem}
                name={data.comboProduct.name}
              />
            );
          }
        })}
      </View>
    </View>
  );
};

export default ComboProduct;

const styles = EStyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  card_container: {
    height: height * 0.55,
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
  },
  card_title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_title_text: {
    fontSize: '$m',
    fontWeight: 'bold',
  },
  is_customizable: {
    fontSize: '$xxxs',
    color: 'gray',
  },
  item_parent_container: {
    flex: 5,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
