import { useLazyQuery } from '@apollo/react-hooks'
import React from 'react'
import { FlatList, SafeAreaView, StyleSheet } from 'react-native'
import {
   COMBO_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
} from '../graphql'
import { width } from '../utils/Scaling'
import Card from './Card'
import CardSkeleton from './skeletons/card'
import {
   resolveCustomizableProductPrices,
   resolveComboProductPrices,
} from '../utils/products'
import ProductCard from './ProductCard'

const Products = ({
   category,
   navigation,
   horizontal,
   recommendations = false,
}) => {
   const [products, setProducts] = React.useState([])

   React.useEffect(() => {
      // empty products on route change
      setProducts([])
      fetchInventoryProducts()
      fetchSimpleRecipeProducts()
      fetchCustomizableProducts()
      fetchComboProducts()
   }, [category])

   // Subscriptions
   const [
      fetchInventoryProducts,
      { loading: inventoryProductsLoading },
   ] = useLazyQuery(INVENTORY_PRODUCTS, {
      variables: {
         ids: category.inventoryProducts,
      },
      onCompleted: data => {
         setProducts([...products, ...data.inventoryProducts])
      },
      fetchPolicy: 'cache-and-network',
   })

   const [
      fetchSimpleRecipeProducts,
      { loading: simpleRecipeProductsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCTS, {
      variables: {
         ids: category.simpleRecipeProducts,
      },
      onCompleted: data => {
         setProducts([...products, ...data.simpleRecipeProducts])
      },
      fetchPolicy: 'cache-and-network',
   })

   const [
      fetchCustomizableProducts,
      { loading: customizableProductsLoading },
   ] = useLazyQuery(CUSTOMIZABLE_PRODUCTS, {
      variables: {
         ids: category.customizableProducts,
      },
      onCompleted: data => {
         const updatedCustomizableProducts = resolveCustomizableProductPrices(
            data.customizableProducts
         )
         setProducts([...products, ...updatedCustomizableProducts])
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchComboProducts, { loading: comboProductsLoading }] = useLazyQuery(
      COMBO_PRODUCTS,
      {
         variables: {
            ids: category.comboProducts,
         },
         onCompleted: data => {
            const updatedComboProducts = resolveComboProductPrices(
               data.comboProducts
            )
            setProducts([...products, ...updatedComboProducts])
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   if (
      [
         inventoryProductsLoading,
         simpleRecipeProductsLoading,
         customizableProductsLoading,
         comboProductsLoading,
      ].some(item => item)
   )
      return (
         <SafeAreaView
            style={{
               margin: recommendations ? 0 : width > 768 ? 20 : 5,
            }}
         >
            {horizontal ? (
               <FlatList
                  showsHorizontalScrollIndicator={true}
                  horizontal={true}
                  data={[1, 2, 3]}
                  keyExtractor={item => item.toString()}
                  renderItem={() => <CardSkeleton />}
               />
            ) : (
               <FlatList
                  showsVerticalScrollIndicator={false}
                  style={styles.productList}
                  numColumns={width > 768 ? 4 : 2}
                  data={[1, 2, 3]}
                  keyExtractor={item => item.toString()}
                  renderItem={() => <CardSkeleton />}
               />
            )}
         </SafeAreaView>
      )

   return (
      <SafeAreaView
         style={{ margin: recommendations ? 0 : width > 768 ? 20 : 5 }}
      >
         {Boolean(products.length) &&
            (horizontal ? (
               <FlatList
                  showsHorizontalScrollIndicator={true}
                  horizontal={true}
                  data={products}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item: product }) => (
                     <ProductCard product={product} navigation={navigation} />
                  )}
               />
            ) : (
               <FlatList
                  showsVerticalScrollIndicator={false}
                  style={styles.productList}
                  data={products}
                  numColumns={width > 768 ? 4 : 2}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item: product }) => (
                     <ProductCard product={product} navigation={navigation} />
                  )}
               />
            ))}
      </SafeAreaView>
   )
}

export default Products

const styles = StyleSheet.create({
   productList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: 'auto',
   },
})
