import React from 'react'
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ScrollView,
   FlatList,
} from 'react-native'
import styled from 'styled-components/native'
import Header from '../../components/Header'
import { useAppContext } from '../../context/app'
import { useLazyQuery } from '@apollo/react-hooks'
import { SEARCH_PRODUCTS } from '../../graphql/queries'
import { Feather } from '@expo/vector-icons'
import { width } from '../../utils/Scalaing'
import { Card } from '../../components'
import CardSkeleton from '../../components/skeletons/card'
import CheckoutBar from '../../components/CheckoutBar'
import AppSkeleton from '../../components/skeletons/app'

const Search = ({ navigation }) => {
   const { menuData, masterLoading } = useAppContext()

   const [mergedData, setMergedData] = React.useState(undefined)
   const [query, setQuery] = React.useState('')

   const [products, setProducts] = React.useState([])
   const [error, setError] = React.useState('')

   // Query
   const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS, {
      variables: {
         ...mergedData,
         name: `%${query}%`,
         tag: query,
      },
      onCompleted: data => {
         const items = [
            ...data.comboProducts,
            ...data.customizableProducts,
            ...data.simpleRecipeProducts,
            ...data.inventoryProducts,
         ]
         if (items.length) {
            setProducts(items)
         } else {
            setError('Sorry! No items found.')
         }
      },
      onError: error => {
         console.log(error)
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

   const handleKeyDown = e => {
      if (e.which === 27) {
         navigation.goBack() || navigation.navigate('Home')
      }
      if (e.which === 13) {
         setError('')
         searchProducts()
      }
   }

   React.useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
         document.removeEventListener('keydown', handleKeyDown)
      }
   }, [])

   React.useEffect(() => {
      console.log('Menu Data: ', menuData)
      squashAndMerge(menuData)
   }, [menuData])

   if (masterLoading) {
      return <AppSkeleton />
   }

   return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
         <Header navigation={navigation} />
         <Wrapper>
            <SearchContainer>
               <SearchInputWrapper>
                  <Feather
                     name="search"
                     size={width > 768 ? 28 : 16}
                     color="#3D4157"
                  />
                  <SearchInput
                     onChangeText={text => setQuery(text)}
                     value={query}
                     placeholder="Search for products and tags"
                     autoFocus={true}
                  />
               </SearchInputWrapper>
               <EscapeContainer onPress={() => navigation.goBack()}>
                  <Feather
                     name="x"
                     size={width > 768 ? 28 : 16}
                     color="#3D4157"
                  />
                  <EscapeText>Esc</EscapeText>
               </EscapeContainer>
            </SearchContainer>
            {Boolean(error) && <Error>{error}</Error>}
            <ProductsContainer>
               {loading ? (
                  <FlatList
                     showsVerticalScrollIndicator={false}
                     style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginHorizontal: 'auto',
                     }}
                     numColumns={width > 768 ? 3 : 2}
                     data={[1, 2, 3]}
                     keyExtractor={item => item.toString()}
                     renderItem={() => <CardSkeleton />}
                  />
               ) : (
                  <>
                     {Boolean(products.length) && (
                        <FlatList
                           showsVerticalScrollIndicator={false}
                           style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              marginHorizontal: 'auto',
                           }}
                           data={products}
                           numColumns={width > 768 ? 3 : 2}
                           keyExtractor={item => item.id.toString()}
                           renderItem={({ item: product }) => (
                              <Card navigation={navigation} product={product} />
                           )}
                        />
                     )}
                  </>
               )}
            </ProductsContainer>
         </Wrapper>
         {width < 768 && <CheckoutBar navigation={navigation} />}
      </View>
   )
}

export default Search

const Wrapper = styled.View`
   width: ${width > 1280 ? '1280px' : width + 'px'};
   margin: ${width > 768 ? '20px auto 0px' : '10px auto 0px'};
   margin-bottom: ${width < 768 ? '70px' : '0px'};
   flex: 1;
`

const SearchContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const SearchInputWrapper = styled.View`
   width: ${width > 768 ? '100%' : '90%'};
   border: 1px solid #d4d5d9;
   flex-direction: row;
   align-items: center;
   padding: ${width > 768 ? '1.2rem' : '1rem'};
`

const SearchInput = styled.TextInput`
   flex: 1;
   margin-left: ${width > 768 ? '1.2rem' : '1rem'};
   font-size: ${width > 768 ? '1.2rem' : '1rem'};
   color: #282c3f;
   font-weight: 500;
   outline: none;
`

const EscapeContainer = styled.TouchableOpacity`
   margin-left: ${width > 768 ? '16px' : '8px'};
   align-items: center;
`

const EscapeText = styled.Text`
   font-size: ${width > 768 ? '1.1rem' : '0.8rem'};
   color: #666;
`

const Error = styled.Text`
   color: #666;
`

const ProductsContainer = styled.ScrollView`
   flex: 1;
   margin-top: 10px;
`
