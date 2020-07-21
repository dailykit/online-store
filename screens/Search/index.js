import React from 'react'
import { View, Text } from 'react-native'
import Header from '../../components/Header'
import { useAppContext } from '../../context/app'

const Search = ({ navigation }) => {
   const { menuData } = useAppContext()

   const [mergedData, setMergedData] = React.useState(undefined)

   const squashAndMerge = data => {
      console.log(data)
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
      console.log(prepData)
      setMergedData(prepData)
   }

   React.useEffect(() => {
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
