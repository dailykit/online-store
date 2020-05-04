import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import SimpleProductItemCollapsed from './SimpleProductItemCollapsed';

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
}) => {
  const [loading, setLoading] = useState(true);
  const [simpleProduct, set_simpleProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let res = await axios({
        url: 'https://dailykitdatahub.herokuapp.com/v1/graphql',
        method: 'POST',
        data: JSON.stringify({
          query: `
           {
            simpleRecipeProduct(id: ${id}) {
              name
              default
              id
              simpleRecipeProductOptions {
                id
                price
                type
                simpleRecipeYield {
                  yield
                }
                simpleRecipeYieldId
              }
              simpleRecipe {
                author
                cookingTime
                assets
                cuisine
                description
                id
                image
                name
                procedures
                show
                utensilsRequired
              }
            }
          }          
        `,
        }),
      });
      let item = res.data.data;
      set_simpleProduct(item);
      if (
        item.simpleRecipeProduct.simpleRecipeProductOptions[0] &&
        independantItem
      ) {
        let objToAddToCart = {
          product: {
            id: item.simpleRecipeProduct.id,
            option: {
              id: item.simpleRecipeProduct.simpleRecipeProductOptions[0].id, // product option id
              type: 'Meal Kit',
            },
            type: 'Simple Recipe',
          },
        };
        if (!tunnelItem) {
          setPrice(
            item.simpleRecipeProduct.simpleRecipeProductOptions[0].price[0]
              .value
          );
        }
        if (tunnelItem) {
          setcartItem(objToAddToCart);
        }
        if (independantItem && !tunnelItem) {
          setcardData(item);
        }
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  if (loading || !simpleProduct) {
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
      data={simpleProduct}
      openModal={openModal}
      navigation={navigation}
      label={'dinner'}
      tunnelItem={tunnelItem}
    />
  );
};

export default SimpleProductItem;
