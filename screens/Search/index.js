import React from 'react'
import { Feather } from '@expo/vector-icons'
import { Helmet } from 'react-helmet'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'
import { Card } from '../../components'
import CheckoutBar from '../../components/CheckoutBar'
import Header from '../../components/Header'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { width } from '../../utils/Scaling'

const Search = ({ navigation }) => {
   const { menuData, masterLoading, visual } = useAppContext()

   const [query, setQuery] = React.useState('')

   const [products, setProducts] = React.useState([])
   const [error, setError] = React.useState('')

   // Search function
   React.useMemo(() => {
      setError('')
      const q = query.trim().toLowerCase()
      if (q) {
         const foundProducts = []
         for (let category of menuData) {
            for (let product of category.products) {
               const ts = product.tags
                  ? product.tags.map(tag => tag.toLowerCase())
                  : null
               if (
                  product.name.toLowerCase().includes(q) ||
                  (ts && ts.includes(q))
               ) {
                  foundProducts.push(product)
               }
            }
         }
         setProducts([...foundProducts])
         if (!foundProducts.length) {
            setError('No products found!')
         }
      } else {
         setProducts([])
      }
   }, [query])

   if (masterLoading) {
      return <AppSkeleton />
   }

   return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
         <Helmet>
            <title>Search | {visual.appTitle}</title>
         </Helmet>
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
               <EscapeContainer
                  onPress={() =>
                     navigation.goBack() || navigation.navigate('Home')
                  }
               >
                  <Feather
                     name="x"
                     size={width > 768 ? 28 : 16}
                     color="#3D4157"
                  />
               </EscapeContainer>
            </SearchContainer>
            {Boolean(error) && <Error>{error}</Error>}
            <ProductsContainer>
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
