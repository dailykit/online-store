import React from 'react'
import { View, ScrollView } from 'react-native'
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
   const { data, category } = route.params

   const { masterLoading } = useAppContext()

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
               {data.map((category, key) => (
                  <CategoriesButton
                     title={category.name}
                     key={key}
                     id={key}
                     length={data?.length}
                     onPress={() =>
                        navigation.navigate('CategoryProductsPage', {
                           data,
                           category,
                        })
                     }
                  />
               ))}
            </ScrollView>
         </View>
         <CategoryBanner title={category.title} showLink={false} />
         <ScrollView>
            <Products
               navigation={navigation}
               category={category}
               horizontal={false}
            />
            <Footer />
         </ScrollView>
         {width < 768 && <CheckoutBar navigation={navigation} />}
      </>
   )
}

export default CategoryProductsPage
