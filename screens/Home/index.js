import { Spinner } from 'native-base'
import { Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import Carousel from 'react-native-banner-carousel'
import {
   Image,
   ScrollView,
   SectionList,
   Text,
   TouchableOpacity,
   View,
   ListView,
} from 'react-native'
// Change number to edit: 3 (shit package)
import { Header, Icon } from '../../components'
import Cart from '../../components/Cart'
import { CategoryBanner } from '../../components/CategoryBanner'
import Products from '../../components/Products'
import { SafetyBanner } from '../../components/SafetyBanner'
import { useAppContext } from '../../context/app'
import { useAuth } from '../../context/auth'
import { useCartContext } from '../../context/cart'
import { height, width } from '../../utils/Scalaing'
import { styles } from './styles'
import CategoriesButton from '../../components/CategoriesButton'
import Footer from '../../components/Footer'
import { Feather } from '@expo/vector-icons'

import { AsyncStorage } from 'react-native-web'
import BottomNav from '../../components/CheckoutBar'
import CheckoutBar from '../../components/CheckoutBar'
import AppSkeleton from '../../components/skeletons/app'
import MenuSkeleton from '../../components/skeletons/menu'

const BannerWidth = Dimensions.get('window').width
const BannerHeight = width > 768 ? height * 0.6 : height * 0.3

const Home = props => {
   const {
      brand,
      visual,
      availability,
      menuData,
      menuLoading,
      masterLoading,
   } = useAppContext()

   const isStoreOpen = () => {
      const current = new Date()
      if (availability.store.isOpen) {
         const minutes = current.getMinutes() + current.getHours() * 60
         const from = availability.store.from.split(':')
         const to = availability.store.to.split(':')
         const fromMinutes = parseInt(from[1]) + parseInt(from[0]) * 60
         const toMinutes = parseInt(to[1]) + parseInt(to[0]) * 60

         if (minutes >= fromMinutes && minutes <= toMinutes) {
            return true
         } else {
            return false
         }
      } else {
         return false
      }
   }

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (availability && !isStoreOpen())
      return (
         <View style={styles.reallyBigContainer}>
            <ScrollView>
               <View>
                  <Header
                     title="Home"
                     search
                     options
                     navigation={props.navigation}
                  />
                  <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontWeight: 500,
                           fontSize: 24,
                           marginBottom: 20,
                        }}
                     >
                        Store Closed
                     </Text>
                     <Text style={{ fontSize: 20 }}>
                        {availability.store.shutMessage}
                     </Text>
                  </View>
               </View>
               <View style={styles.flexContainer}>
                  <Spinner size="large" />
               </View>
               <View style={{ height: height * 0.08 }} />
            </ScrollView>
            <Cart to="OrderSummary" {...props} text="Checkout" />
         </View>
      )
   let pickerData = []
   let sectionsData = []

   if (menuData.length) {
      menuData.forEach((category, _id) => {
         pickerData.push(category.name)
         let dataItems = []
         Object.keys(category)?.forEach(key => {
            if (
               key != 'name' &&
               key != '__typename' &&
               key != 'title' &&
               key != 'data'
            ) {
               category[key]?.forEach(el =>
                  dataItems.push({
                     type: key,
                     id: el,
                  })
               )
            }
         })
         sectionsData.push({
            title: category.name,
            data: dataItems,
         })
      })
   }
   menuData.forEach(el => {
      el.title = el.name
      el.data = [{ ...el }]
   })
   return (
      <>
         <Header
            title={brand?.name ? brand?.name : 'Home'}
            search
            options
            navigation={props.navigation}
         />
         <ScrollView
            stickyHeaderIndices={[2]}
            style={[styles.reallyBigContainer]}
            showsVerticalScrollIndicator={false}
         >
            {/* <Tabs /> */}
            {Boolean(visual?.slides?.length) && (
               <View style={styles.img_container}>
                  <Carousel
                     autoplay
                     autoplayTimeout={3000}
                     loop
                     index={0}
                     pageSize={BannerWidth}
                  >
                     {visual.slides.map((slide, index) => (
                        <View key={index}>
                           <Image
                              style={{
                                 width: BannerWidth,
                                 height: BannerHeight,
                                 resizeMode: 'cover',
                              }}
                              source={{ uri: slide.url }}
                           />
                        </View>
                     ))}
                  </Carousel>
               </View>
            )}
            {menuLoading && <MenuSkeleton />}
            {Boolean(menuData.length) && (
               <View style={[styles.picker_container, { marginBottom: 4 }]}>
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
                              props.navigation.navigate(
                                 'CategoryProductsPage',
                                 {
                                    category: category.name,
                                 }
                              )
                           }
                        />
                     ))}
                  </ScrollView>
               </View>
            )}
            {Boolean(menuData.length) && (
               <View style={styles.sections}>
                  {menuData.map(category => (
                     <View style={styles.category}>
                        <CategoryBanner
                           navigation={props.navigation}
                           title={category.name}
                           showLink={true}
                        />
                        <Products
                           navigation={props.navigation}
                           category={category}
                           horizontal={true}
                        />
                     </View>
                  ))}
               </View>
            )}
            {!menuLoading && Boolean(!menuData.length) && (
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                     padding: 20,
                     minHeight: 200,
                  }}
               >
                  <Feather name="frown" size={28} color="#666" />
                  <Text
                     style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#666',
                        marginTop: 10,
                        textAlign: 'center',
                     }}
                  >
                     Sorry! No products available at this moment.
                  </Text>
               </View>
            )}
            <View style={styles.headerContainer}>
               <SafetyBanner {...props} />
            </View>
            <Footer />
         </ScrollView>
         {width < 768 && <CheckoutBar navigation={props.navigation} />}
      </>
   )
}

export default Home
