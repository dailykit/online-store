import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import SimpleProductItemCollapsed from './SimpleProductItemCollapsed';

const SimpleProductItem = ({ _id, openModal, navigation, id, setPrice }) => {
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
          query MyQuery {
            simpleRecipeProduct(id: ${id}) {
                name
                default
                simpleRecipeProductOptions {
                    price
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
      set_simpleProduct(res.data.data);
      if (res.data.data.simpleRecipeProduct.simpleRecipeProductOptions[0]) {
        setPrice(
          res.data.data.simpleRecipeProduct.simpleRecipeProductOptions[0]
            .price[0].value
        );
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
    />
  );
};

export default SimpleProductItem;
