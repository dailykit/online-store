import { useSubscription } from '@apollo/react-hooks';
import React from 'react';
import { FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import {
  COMBO_PRODUCTS,
  CUSTOMIZABLE_PRODUCTS,
  INVENTORY_PRODUCTS,
  SIMPLE_RECIPE_PRODUCTS,
} from '../graphql';
import { width } from '../utils/Scalaing';
import Card from './Card';
import { Spinner } from '@ui-kitten/components';

const Products = ({ category, navigation, horizontal }) => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    // empty products on route change
    setProducts([]);
  }, [category]);

  // Subscriptions
  const { loading: inventoryProductsLoading } = useSubscription(
    INVENTORY_PRODUCTS,
    {
      variables: {
        ids: category.inventoryProducts,
      },
      onSubscriptionData: (data) => {
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
      onSubscriptionData: (data) => {
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
      onSubscriptionData: (data) => {
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
    onSubscriptionData: (data) => {
      setProducts([...products, ...data.subscriptionData.data.comboProducts]);
    },
  });

  if (
    inventoryProductsLoading ||
    simpleRecipeProductsLoading ||
    customizableProductsLoading ||
    comboProductsLoading
  )
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );

  return (
    <SafeAreaView style={{ margin: 20 }}>
      {Boolean(products.length) &&
        (horizontal ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: product }) => (
              <Card navigation={navigation} product={product} />
            )}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.productList}
            data={products}
            numColumns={width > 768 ? 4 : 1}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: product }) => (
              <Card navigation={navigation} product={product} />
            )}
          />
        ))}
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 'auto',
  },
});
