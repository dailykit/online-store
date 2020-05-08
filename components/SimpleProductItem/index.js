import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import SimpleProductItemCollapsed from './SimpleProductItemCollapsed';
import { SIMPLE_PRODUCT } from '../../gql/Queries';

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
  const [objToAdd, setobjToAdd] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const setProductOptionId = (id, price) => {
    let newItem = objToAdd;
    newItem.product.option.id = id;
    newItem.product.price = price;
    setobjToAdd(newItem);
    setcartItem(newItem);
  };

  const fetchData = async () => {
    try {
      let res = await axios({
        url: 'https://dailykitdatahub.herokuapp.com/v1/graphql',
        method: 'POST',
        data: SIMPLE_PRODUCT(id),
      });
      let item = res.data.data;
      set_simpleProduct(item);
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
        setobjToAdd(objToPush);
        if (!tunnelItem && independantItem) {
          setPrice(
            item.simpleRecipeProduct.simpleRecipeProductOptions[0].price[0]
              .value
          );
          setcardData(item);
        }
        if (tunnelItem) {
          setcartItem(objToPush);
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
      setProductOptionId={setProductOptionId}
    />
  );
};

export default SimpleProductItem;
