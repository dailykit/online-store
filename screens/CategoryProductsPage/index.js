import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { Header } from '../../components'
import { CategoryBanner } from '../../components/CategoryBanner'
import Products from '../../components/Products'
import { width } from '../../utils/Scalaing'
import CategoriesButton from '../../components/CategoriesButton'
import Footer from '../../components/Footer'
import CheckoutBar from '../../components/CheckoutBar'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'

const CategoryProductsPage = ({ navigation, route }) => {
   const { category } = route.params

   const { masterLoading, menuData } = useAppContext()
   const [index, setIndex] = React.useState(-1)

   React.useEffect(() => {
      const i = menuData.findIndex(categoryObj => categoryObj.name === category)
      setIndex(i)
   }, [menuData, category])

   if (masterLoading) {
      return <AppSkeleton />
   }

   return (
      <>
         <Header title="Home" navigation={navigation} />
         <View
            style={{
               height: 80,
               flexDirection: 'row',
               alignItems: 'center',
               width: width,
               justifyContent: 'center',
               backgroundColor: '#fff',
            }}
         >
            <ScrollView
               horizontal
               style={{
                  flex: 1,
               }}
               contentContainerStyle={{
                  marginHorizontal: 10,
               }}
               showsHorizontalScrollIndicator={false}
            >
               {menuData.map((category, key) => (
                  <CategoriesButton
                     title={category.name}
                     key={key}
                     id={key}
                     length={menuData?.length}
                     onPress={() =>
                        navigation.navigate('CategoryProductsPage', {
                           category: category.name,
                        })
                     }
                  />
               ))}
            </ScrollView>
         </View>
         {index === -1 ? (
            <>
               <View
                  style={{
                     flex: 1,
                     alignItems: 'center',
                     justifyContent: 'center',
                     padding: 20,
                  }}
               >
                  <Text
                     style={{
                        fontSize: '1.2rem',
                        color: '#666',
                        fontWeight: 'bold',
                     }}
                  >
                     This may be a category in your head but not on our store!
                     Choose another.
                  </Text>
               </View>
               <Footer />
            </>
         ) : (
            <>
               <CategoryBanner title={category} showLink={false} />
               <ScrollView>
                  <Products
                     navigation={navigation}
                     category={
                        menuData.filter(
                           categoryObj => categoryObj.name === category
                        )[0] || {}
                     }
                     horizontal={false}
                  />
                  <Footer />
               </ScrollView>
            </>
         )}
         {width < 768 && <CheckoutBar navigation={navigation} />}
      </>
   )
}

export default CategoryProductsPage
