import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

import InventoryProductCollapsed from './InventoryProductItemCollapsed';
import { INVENTORY_PRODUCT } from '../../gql/Queries';

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
}) => {
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
        data: INVENTORY_PRODUCT(id),
      });
      set_inventoryProduct(res.data.data);
      let item = res.data.data;
      if (
        res.data.data.inventoryProduct.inventoryProductOptions[0] &&
        independantItem
      ) {
        let objToAddToCart = {};
        if (!tunnelItem) {
          setPrice(
            res.data.data.inventoryProduct.inventoryProductOptions[0].price[0]
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
      tunnelItem={tunnelItem}
    />
  );
};

export default InventoryProductItem;
