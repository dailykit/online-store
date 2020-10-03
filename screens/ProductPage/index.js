import { useLazyQuery } from '@apollo/react-hooks'
import { Spinner } from 'native-base'
import React from 'react'
import {
   Image,
   SafeAreaView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import defaultProductImage from '../../assets/imgs/default-product-image.png'
import { Header } from '../../components'
import CheckoutBar from '../../components/CheckoutBar'
import { Drawer } from '../../components/Drawer'
import HeaderBack from '../../components/HeaderBack'
import Nutrition from '../../components/Nutrition'
import Recommendations from '../../components/Recommendations'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../../graphql'
import { width } from '../../utils/Scalaing'
import AddToCart from '../AddToCart'

const ProductPage = ({ navigation, route }) => {
   const { id, type } = route.params

   const { visual, masterLoading } = useAppContext()

   const [product, setProduct] = React.useState({})
   const [isModalVisible, setIsModalVisible] = React.useState(false)

   const [fetchInventoryProduct, { loading: IPLoading }] = useLazyQuery(
      INVENTORY_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.inventoryProduct)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const [fetchSimpleRecipeProduct, { loading: SRPLoading }] = useLazyQuery(
      SIMPLE_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.simpleRecipeProduct)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   React.useEffect(() => {
      switch (type) {
         case 'inventoryProduct': {
            return fetchInventoryProduct({
               variables: {
                  id,
               },
            })
         }
         case 'simpleRecipeProduct': {
            return fetchSimpleRecipeProduct({
               variables: {
                  id,
               },
            })
         }
         default: {
            return console.log('Invalid type')
         }
      }
   }, [id, type])

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (IPLoading || SRPLoading)
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Spinner size="large" />
         </View>
      )

   return (
      <>
         <Drawer
            isVisible={isModalVisible}
            navigation={navigation}
            data={product}
            type={product?.__typename?.split('_')[1]}
            id={product?.id}
            setIsModalVisible={setIsModalVisible}
         />
         <SafeAreaView
            style={[styles.safeArea, { paddingBottom: width < 768 ? 70 : 0 }]}
         >
            {width > 768 ? (
               <Header title="Home" navigation={navigation} />
            ) : (
               <HeaderBack title="Go Back" navigation={navigation} />
            )}
            <ScrollView style={{ paddingHorizontal: '1rem' }}>
               <View style={styles.container}>
                  <View
                     style={{
                        alignItems: 'center',
                        flex: 1,
                        marginBottom: width > 768 ? 5 : 20,
                     }}
                  >
                     <Image
                        source={{
                           uri:
                              product?.assets?.images[0] || defaultProductImage,
                        }}
                        style={styles.image}
                     />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.productName}>{product?.name}</Text>
                     <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        {product?.tags?.map(tag => (
                           <Text style={styles.tag}>{tag.toUpperCase()}</Text>
                        ))}
                     </View>
                     {product?.description && (
                        <>
                           <Text style={styles.sectionTitle}>Description</Text>
                           <Text style={styles.text}>
                              {product?.description}
                           </Text>
                        </>
                     )}
                     {product?.__typename?.includes('simpleRecipeProduct') && (
                        <View style={{ marginBottom: 10 }}>
                           <View style={{ flexDirection: 'row', width: 250 }}>
                              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                                 Author
                              </Text>
                              <Text style={[styles.text, { flex: 1 }]}>
                                 {product?.simpleRecipe?.author}
                              </Text>
                           </View>
                           <View style={{ flexDirection: 'row', width: 250 }}>
                              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                                 Cuisine
                              </Text>
                              <Text style={[styles.text, { flex: 1 }]}>
                                 {product?.simpleRecipe?.cuisine}
                              </Text>
                           </View>
                           <View style={{ flexDirection: 'row', width: 250 }}>
                              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                                 Type
                              </Text>
                              <Text style={[styles.text, { flex: 1 }]}>
                                 {product?.simpleRecipe?.type}
                              </Text>
                           </View>
                           <TouchableOpacity
                              onPress={() =>
                                 navigation.navigate('Recipe', {
                                    recipeId: product?.simpleRecipe?.id,
                                 })
                              }
                           >
                              <Text
                                 style={[
                                    styles.text,
                                    {
                                       color: visual.color,
                                       textDecorationLine: 'underline',
                                    },
                                 ]}
                              >
                                 See Recipe for this product
                              </Text>
                           </TouchableOpacity>
                        </View>
                     )}
                     {/* {product?.__typename?.includes('inventoryProduct')
                ? product.inventoryProductOptions?.map((option) => (
                    <View style={styles.option}>
                      <Text style={styles.text}>{option.label}</Text>
                      <Text style={[styles.text, { fontWeight: 'bold' }]}>
                        $ {option.price[0].value}
                      </Text>
                    </View>
                  ))
                : product.simpleRecipeProductOptions?.map((option) => (
                    <View style={styles.option}>
                      <Text style={{ width: 120 }}>
                        {option.type === 'mealKit'
                          ? 'Meal Kit'
                          : 'Ready to Eat'}
                      </Text>
                      <Text style={styles.text}>
                        <Feather size={18} name='user' />{' '}
                        {option.simpleRecipeYield.yield.serving}
                      </Text>
                      <Text
                        style={[styles.text, { fontWeight: 'bold', width: 50 }]}
                      >
                        $ {option.price[0].value}
                      </Text>
                    </View>
                  ))} */}
                     {/* <Nutrition /> */}
                     <AddToCart
                        showInfo={false}
                        setIsModalVisible={true}
                        navigation={navigation}
                        id={id}
                        type={product?.__typename?.split('_')[1]}
                        data={product}
                     />

                     {/* <TouchableOpacity
                style={[styles.button, { backgroundColor: visual.color }]}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={{ color: '#fff' }}>
                  ADD TO CART <Feather size={14} name='plus' />
                </Text>
              </TouchableOpacity> */}
                  </View>
               </View>
               {Boolean(product.accompaniments) && (
                  <Recommendations
                     navigation={navigation}
                     recommendations={product.accompaniments}
                  />
               )}
            </ScrollView>
            {width < 768 && <CheckoutBar navigation={navigation} />}
         </SafeAreaView>
      </>
   )
}

export default ProductPage

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: '#fff',
   },
   container: {
      paddingVertical: width > 768 ? 40 : 10,
      paddingHorizontal: 10,
      maxWidth: 1280,
      width: '100%',
      marginHorizontal: 'auto',
      flexDirection: width > 768 ? 'row' : 'column',
      marginBottom: '32px',
   },
   image: {
      width: width > 768 ? 400 : width * 0.6,
      height: width > 768 ? 400 : width * 0.6,
      resizeMode: 'contain',
   },
   productName: {
      fontSize: '2.125rem',
      fontWeight: 'bold',
      lineHeight: '2.5rem',
      marginBottom: '1rem',
      letterSpacing: 0.85,
   },
   sectionTitle: { fontSize: '100%', color: '#666', marginBottom: 5 },
   tag: {
      padding: 5,
      backgroundColor: '#e3e3e3',
      marginRight: 5,
   },
   text: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
   },
   option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      maxWidth: 400,
   },
   button: {
      textAlign: 'center',
      borderRadius: 4,
      maxWidth: 200,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
   },
})
