import React from 'react';
import { View, FlatList } from 'react-native';
import { useSubscription } from '@apollo/react-hooks';
import {
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCTS,
} from '../graphql';
import { Text } from 'native-base';
import { Spinner } from '@ui-kitten/components';
import Card from './Card';
import { width } from '../utils/Scalaing';

const Products = ({ category }) => {
   console.log(category, 'rendered');
   const [products, setProducts] = React.useState([]);

   // Subscriptions
   const { loading: inventoryProductsLoading } = useSubscription(
      INVENTORY_PRODUCTS,
      {
         variables: {
            ids: category.inventoryProducts,
         },
         onSubscriptionData: data => {
            console.log(data.subscriptionData.data.inventoryProducts);
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
            console.log(data.subscriptionData.data.simpleRecipeProducts);
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
            console.log(data.subscriptionData.data.customizableProducts);
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
         console.log(data.subscriptionData.data.comboProducts);
         setProducts([
            ...products,
            ...data.subscriptionData.data.comboProducts,
         ]);
      },
   });

   //  if (
   //     inventoryProductsLoading ||
   //     simpleRecipeProductsLoading ||
   //     customizableProductsLoading ||
   //     comboProductsLoading
   //  )
   //     return (
   //        <View
   //           style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
   //        >
   //           <Spinner />
   //        </View>
   //     );

   return (
      <View>
         {Boolean(products.length) && (
            <>
               <FlatList
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
