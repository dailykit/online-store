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
  label,
  product,
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
    if (product?.inventoryProductOptions === undefined) return;
    if (product?.inventoryProductOptions[0]) {
      let objToPush = {
        product: {
          id: product?.id,
          name: product?.name,
          price: product?.inventoryProductOptions[0]?.price[0]?.value,
          option: {
            id: product?.inventoryProductOptions[0]?.id, // product option id
          },
          type: 'Inventory',
        },
      };
      if (!independantItem) {
        objToPush['name'] = name;
      }
      setobjToAdd(objToPush);
      if (!tunnelItem && independantItem) {
        setPrice(product?.inventoryProductOptions[0]?.price[0]?.value);
        setcardData(product);
      }
      if (tunnelItem && isSelected) {
        setcartItem(objToPush);
      }
      if (tunnelItem && independantItem) {
        setcartItem(objToPush);
      }
    }
  }, []);

  useEffect(() => {
    if (tunnelItem && isSelected) {
      setcartItem(objToAdd);
    }
  }, [isSelected]);

  return (
    <InventoryProductCollapsed
      _id={_id}
      data={product}
      openModal={openModal}
      navigation={navigation}
      label={label}
      tunnelItem={tunnelItem}
      setProductOptionId={setProductOptionId}
      setSelected={setSelected}
    />
  );
};

export default InventoryProductItem;
