import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import InventoryProductCollapsed from './InventoryProductItemCollapsed';
import { INVENTORY_PRODUCT } from '../../graphql';
import { useQuery } from '@apollo/react-hooks';

const InventoryProductItem = ({
  _id,
  openModal,
  navigation,
  id,
  setPrice,
  tunnelItem,
  independantItem,
  setcartItem,
  setcardData,
  setSelected,
  isSelected,
  name,
}) => {
  const [objToAdd, setobjToAdd] = useState({});

  const setProductOptionId = (id, price) => {
    let newItem = objToAdd;
    newItem.product.option.id = id;
    newItem.product.price = price;
    setobjToAdd(newItem);
    setcartItem(newItem);
  };

  useEffect(() => {
    if (tunnelItem && isSelected && !loading) {
      setcartItem(objToAdd);
    }
  }, [isSelected]);

  const { data, loading, error } = useQuery(INVENTORY_PRODUCT, {
    variables: { id },
    onCompleted: (_data) => {
      let item = _data;
      if (_data.inventoryProduct.inventoryProductOptions[0]) {
        let objToPush = {
          product: {
            id: item.inventoryProduct.id,
            name: item.inventoryProduct.name,
            price:
              item.inventoryProduct.inventoryProductOptions[0].price[0].value,
            option: {
              id: item.inventoryProduct.inventoryProductOptions[0].id, // product option id
            },
            type: 'Inventory',
          },
        };
        if (!independantItem) {
          objToPush['name'] = name;
        }
        setobjToAdd(objToPush);
        if (!tunnelItem && independantItem) {
          setPrice(
            _data.inventoryProduct.inventoryProductOptions[0].price[0].value
          );
          setcardData(item);
        }
        if (tunnelItem && isSelected) {
          setcartItem(objToPush);
        }
        if (tunnelItem && independantItem) {
          setcartItem(objToPush);
        }
      }
    },
  });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  if (!data.inventoryProduct) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  let inventoryProduct = data.inventoryProduct;
  if (!inventoryProduct) return <Text>Bad Data</Text>;
  return (
    <InventoryProductCollapsed
      _id={_id}
      data={inventoryProduct}
      openModal={openModal}
      navigation={navigation}
      label={'dinner'}
      tunnelItem={tunnelItem}
      setProductOptionId={setProductOptionId}
      setSelected={setSelected}
    />
  );
};

export default InventoryProductItem;
