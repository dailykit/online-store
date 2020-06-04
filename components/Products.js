import { useSubscription } from '@apollo/react-hooks';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
   COMBO_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
} from '../graphql';
import { width } from '../utils/Scalaing';
import Card from './Card';

const Products = ({ category }) => {
   const [products, setProducts] = React.useState([]);

   // Subscriptions
   const { loading: inventoryProductsLoading } = useSubscription(
      INVENTORY_PRODUCTS,
      {
         variables: {
            ids: category.inventoryProducts,
         },
         onSubscriptionData: data => {
            setProducts([
               ...products,
               ...data.subscriptionData.data.inventoryProducts,
            ]);
         },
      }
   );

   const { loading: simpleRecipeProductsLoading } = useSubscription(
      SIMPLE_RECIPE_PRODUCTS,
      {
         variables: {
            ids: category.simpleRecipeProducts,
         },
         onSubscriptionData: data => {
            setProducts([
               ...products,
               ...data.subscriptionData.data.simpleRecipeProducts,
            ]);
         },
      }
   );

   const { loading: customizableProductsLoading } = useSubscription(
      CUSTOMIZABLE_PRODUCTS,
      {
         variables: {
            ids: category.customizableProducts,
         },
         onSubscriptionData: data => {
            setProducts([
               ...products,
               ...data.subscriptionData.data.customizableProducts,
            ]);
         },
      }
   );

   const { loading: comboProductsLoading } = useSubscription(COMBO_PRODUCTS, {
      variables: {
         ids: category.comboProducts,
      },
      onSubscriptionData: data => {
         setProducts([
            ...products,
            ...data.subscriptionData.data.comboProducts,
         ]);
      },
   });

   return (
      <View>
         {Boolean(products.length) && (
            <>
               <FlatList
                  style={styles.productList}
                  numColumns={width > 1000 ? 3 : 1}
                  data={products}
                  keyExtractor={item => item.id}
                  renderItem={({ item: product }) => <Card product={product} />}
               />
            </>
         )}
      </View>
   );
};

export default Products;

const styles = StyleSheet.create({
   productList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 48,
   },
});
