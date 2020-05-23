import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import CustomizableProductItemCollapsed from './CustomizableProductItemCollapsed';
import CustomizableProductItemExpanded from './CustomizableProductItemExpanded';
import { CUSTOMIZABLE_PRODUCT } from '../../graphql';
import { useQuery } from '@apollo/react-hooks';

const CustomizableProductItem = ({
  isSelected,
  _id,
  setSelected,
  isLast,
  openModal,
  navigation,
  id,
  independantItem,
  tunnelItem,
  setcardData,
  setcartItem,
  setPrice,
  name,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [numberOfOptions, setnumberOfOptions] = useState(0);
  const [objToAdd, setobjToAdd] = useState({});

  const setproductOptionId = (id, price, simpleRecipeProductId, name) => {
    let newItem = objToAdd;
    newItem.product.option.id = id;
    newItem.product.price = price;
    newItem.product.id = simpleRecipeProductId;
    newItem.product.name = name;
    setobjToAdd(newItem);
    setcartItem(newItem);
  };

  useEffect(() => {
    if (tunnelItem && isSelected && !loading) {
      setcartItem(objToAdd);
    }
  }, [isSelected]);

  const { data, loading, error } = useQuery(CUSTOMIZABLE_PRODUCT, {
    variables: { id },
    onCompleted: (_data) => {
      if (_data !== undefined) {
        if (
          _data &&
          _data.customizableProduct &&
          _data.customizableProduct.customizableProductOptions
        ) {
          setnumberOfOptions(
            _data.customizableProduct.customizableProductOptions.length
          );
        }
        let item = _data.customizableProduct;
        if (item.customizableProductOptions[0]) {
          let default_product = item.customizableProductOptions[0];
          let objToAddToCart = {
            customizableProductId: item.id,
            customizableProductOptionId: default_product.id,
            product: {
              id: default_product.simpleRecipeProduct.id,
              name: default_product.simpleRecipeProduct.name,
              price:
                default_product.simpleRecipeProduct
                  .simpleRecipeProductOptions[0].price[0].value,
              option: {
                id:
                  default_product.simpleRecipeProduct
                    .simpleRecipeProductOptions[0].id, // product option id
                type:
                  default_product.simpleRecipeProduct
                    .simpleRecipeProductOptions[0].type,
              },
              type: 'Simple Recipe',
            },
          };
          if (!independantItem) {
            objToAddToCart['name'] = name;
          }
          setobjToAdd(objToAddToCart);
          if (!tunnelItem && independantItem) {
            setPrice(
              item.customizableProductOptions[0].simpleRecipeProduct
                .simpleRecipeProductOptions[0].price[0].value
            );
            setcardData(item);
          }
          if (tunnelItem && isSelected) {
            setcartItem(objToAddToCart);
          }
          if (tunnelItem && independantItem) {
            setcartItem(objToAddToCart);
          }
        }
      }
    },
  });

  if (loading || !data.customizableProduct) {
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
  const { customizableProduct } = data;
  let default_first_product =
    customizableProduct !== null
      ? customizableProduct.customizableProductOptions[0]
      : null;
  if (
    customizableProduct == null ||
    customizableProduct.customizableProductOptions == null
  ) {
    return <Text>Bad data</Text>;
  }
  if (
    (isSelected && expanded) ||
    (tunnelItem && isSelected) ||
    (independantItem && expanded)
  ) {
    return (
      <CustomizableProductItemExpanded
        isSelected={isSelected}
        _id={_id}
        data={customizableProduct.customizableProductOptions}
        setSelected={setSelected}
        isLast={isLast}
        openModal={openModal}
        navigation={navigation}
        setExpanded={setExpanded}
        label={independantItem ? '' : customizableProduct.label}
        independantItem={independantItem ? true : false}
        numberOfOptions={numberOfOptions}
        tunnelItem={tunnelItem && isSelected}
        setproductOptionId={setproductOptionId}
      />
    );
  }
  return (
    <CustomizableProductItemCollapsed
      isSelected={isSelected}
      _id={_id}
      data={default_first_product}
      setSelected={setSelected}
      isLast={isLast}
      openModal={openModal}
      navigation={navigation}
      setExpanded={setExpanded}
      label={independantItem ? '' : data.label}
      independantItem={independantItem ? true : false}
      numberOfOptions={numberOfOptions}
      tunnelItem={tunnelItem}
    />
  );
};

export default CustomizableProductItem;
