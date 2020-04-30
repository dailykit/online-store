import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import InventoryProductCollapsed from './InventoryProductItemCollapsed';

const InventoryProductItem = ({ _id, openModal, navigation, id, setPrice }) => {
  const [loading, setLoading] = useState(true);
  const [inventoryProduct, set_inventoryProduct] = useState(null);

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
            inventoryProduct(id: ${id}) {
              assets
              default
              description
              id
              name
              tags
              inventoryProductOptions {
                price
                quantity
                label
                inventoryProductId
              }
            }
          }   
        `,
        }),
      });
      set_inventoryProduct(res.data.data);
      setPrice(
        res.data.data.inventoryProduct.inventoryProductOptions[0].price[0].value
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  if (loading || !inventoryProduct) {
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
    <InventoryProductCollapsed
      _id={_id}
      data={inventoryProduct}
      openModal={openModal}
      navigation={navigation}
      label={'dinner'}
    />
  );
};

export default InventoryProductItem;
