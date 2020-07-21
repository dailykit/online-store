import React from 'react'
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ScrollView,
} from 'react-native'
import styled from 'styled-components/native'
import Header from '../../components/Header'
import { useAppContext } from '../../context/app'
import { useLazyQuery } from '@apollo/react-hooks'
import { SEARCH_PRODUCTS } from '../../graphql/queries'
import { Feather } from '@expo/vector-icons'
import { width } from '../../utils/Scalaing'

const Search = ({ navigation }) => {
   const { menuData } = useAppContext()

   const [mergedData, setMergedData] = React.useState(undefined)
   const [query, setQuery] = React.useState('')

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
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
         <Header navigation={navigation} />
         <Wrapper>
            <SearchContainer>
               <SearchInputWrapper>
                  <Feather name="search" size={28} color="#3D4157" />
                  <SearchInput
                     onChangeText={text => setQuery(text)}
                     value={query}
                     placeholder="Search for products and tags"
                  />
               </SearchInputWrapper>
               <EscapeContainer onPress={() => navigation.goBack()}>
                  <Feather name="x" size={28} color="#3D4157" />
                  <EscapeText>Esc</EscapeText>
               </EscapeContainer>
            </SearchContainer>
         </Wrapper>
      </View>
   )
}

export default Search

const Wrapper = styled.View`
   width: ${width > 1280 ? '1280px' : width + 'px'};
   margin: 20px auto 0px;
   padding: 10px;
`

const SearchContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const SearchInputWrapper = styled.View`
   width: 100%;
   border: 1px solid #d4d5d9;
   flex-direction: row;
   align-items: center;
   padding: 1.2rem;
`

const SearchInput = styled.TextInput`
   flex: 1;
   margin-left: 1.2rem;
   font-size: 1.2rem;
   color: #282c3f;
   font-weight: 500;
`

const EscapeContainer = styled.TouchableOpacity`
   margin-left: 16px;
   align-items: center;
`

const EscapeText = styled.Text`
   font-size: 1.1rem;
   color: #666;
`
