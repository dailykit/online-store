import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import SimpleProductItemCollapsed from './SimpleProductItemCollapsed';
import { SIMPLE_PRODUCT } from '../../graphql';
import { useQuery } from '@apollo/react-hooks';

const SimpleProductItem = ({
  _id,
  openModal,
  navigation,
  id,
  setPrice,
  independantItem,
  setcartItem,
  setcardData,
  tunnelItem,
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

  const { data, loading, error } = useQuery(SIMPLE_PRODUCT, {
    variables: { id },
    onCompleted: (_data) => {
      let item = _data;
      if (item.simpleRecipeProduct.simpleRecipeProductOptions[0]) {
        let objToPush = {
          product: {
            id: item.simpleRecipeProduct.id,
            name: item.simpleRecipeProduct.name,
            price:
              item.simpleRecipeProduct.simpleRecipeProductOptions[0].price[0]
                .value,
            option: {
              id: item.simpleRecipeProduct.simpleRecipeProductOptions[0].id, // product option id
              type: item.simpleRecipeProduct.simpleRecipeProductOptions[0].type,
            },
            type: 'Simple Recipe',
          },
        };
        if (!independantItem) {
          objToPush['name'] = name;
        }
        setobjToAdd(objToPush);
        if (!tunnelItem && independantItem) {
          setPrice(
            item.simpleRecipeProduct.simpleRecipeProductOptions[0].price[0]
              .value
          );
          setcardData(item.simpleRecipeProduct);
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
  return (
    <SimpleProductItemCollapsed
      _id={_id}
      data={data}
      openModal={openModal}
      navigation={navigation}
      label={'dinner'}
      tunnelItem={tunnelItem}
      setProductOptionId={setProductOptionId}
      setSelected={setSelected}
      isSelected={isSelected}
    />
  );
};

export default SimpleProductItem;
