import React from 'react'
import {
   SafeAreaView,
   View,
   Image,
   Text,
   StyleSheet,
   TouchableOpacity,
} from 'react-native'
import { Header } from '../../components'
import { useLazyQuery } from '@apollo/react-hooks'
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../../graphql'
import { Spinner } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import { height, width } from '../../utils/Scalaing'
import { Drawer } from '../../components/Drawer'
import { Feather } from '@expo/vector-icons'
import { useAppContext } from '../../context/app'
import HeaderBack from '../../components/HeaderBack'
import AddToCart from '../AddToCart'
import CheckoutBar from '../../components/CheckoutBar'
import AppSkeleton from '../../components/skeletons/app'

const ProductPage = ({ navigation, route }) => {
   const { id, type } = route.params

   const { visual, settingsLoading } = useAppContext()

   const [product, setProduct] = React.useState({})
   const [isModalVisible, setIsModalVisible] = React.useState(false)

   const [fetchInventoryProduct, { loading: IPLoading }] = useLazyQuery(
      INVENTORY_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.inventoryProduct)
         },
      }
   )

   const [fetchSimpleRecipeProduct, { loading: SRPLoading }] = useLazyQuery(
      SIMPLE_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.simpleRecipeProduct)
         },
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

   if (settingsLoading) {
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
            <ScrollView>
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
                              product?.assets?.images[0] ||
                              'data:image/png;base64,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',
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
