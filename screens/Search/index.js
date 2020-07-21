import React from 'react'
import { View, Text } from 'react-native'
import Header from '../../components/Header'
import { useAppContext } from '../../context/app'
import { useLazyQuery } from '@apollo/react-hooks'
import { SEARCH_PRODUCTS } from '../../graphql/queries'

const Search = ({ navigation }) => {
   const { menuData } = useAppContext()

   const [mergedData, setMergedData] = React.useState(undefined)
   const [query, setQuery] = React.useState('Friday')

   // Query
   const [
      searchProducts,
      { data: { products = {} } = {}, loading, error },
   ] = useLazyQuery(SEARCH_PRODUCTS, {
      variables: {
         ...mergedData,
         name: `%${query}%`,
         tag: query,
      },
   })

   const squashAndMerge = data => {
      const prepData = data.reduce(
         (prepData, category) => {
            prepData.comboProducts = [
               ...new Set([
                  ...prepData.comboProducts,
                  ...category.comboProducts,
               ]),
            ]
            prepData.simpleRecipeProducts = [
               ...new Set([
                  ...prepData.simpleRecipeProducts,
                  ...category.simpleRecipeProducts,
               ]),
            ]
            prepData.customizableProducts = [
               ...new Set([
                  ...prepData.customizableProducts,
                  ...category.customizableProducts,
               ]),
            ]
            prepData.inventoryProducts = [
               ...new Set([
                  ...prepData.inventoryProducts,
                  ...category.inventoryProducts,
               ]),
            ]
            return prepData
         },
         {
            comboProducts: [],
            customizableProducts: [],
            simpleRecipeProducts: [],
            inventoryProducts: [],
         }
      )
      setMergedData(prepData)
   }

   React.useEffect(() => {
      console.log('Menu Data: ', menuData)
      squashAndMerge(menuData)
   }, [])

   return (
      <View>
         <Header navigation={navigation} />
         <Text>Searching ''...</Text>
      </View>
   )
}

export default Search
