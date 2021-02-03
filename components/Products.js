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

const Products = ({
   category,
   navigation,
   horizontal,
   recommendations = false,
}) => {
   console.log(category)

   return (
      <SafeAreaView
         style={{ margin: recommendations ? 0 : width > 768 ? 20 : 5 }}
      >
         {Boolean(category?.products?.length) &&
            (horizontal ? (
               <FlatList
                  showsHorizontalScrollIndicator={true}
                  horizontal={true}
                  data={category.products}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item: product }) => (
                     <Card navigation={navigation} product={product} />
                  )}
               />
            ) : (
               <FlatList
                  showsVerticalScrollIndicator={false}
                  style={styles.productList}
                  data={category.products}
                  numColumns={width > 768 ? 4 : 2}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item: product }) => (
                     <Card navigation={navigation} product={product} />
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
