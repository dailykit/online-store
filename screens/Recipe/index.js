import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { Spinner, Tab, Tabs } from 'native-base'
import React from 'react'
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import {
   SIMPLE_RECIPE,
   SIMPLE_PRODUCT,
   CUSTOMIZABLE_PRODUCT,
   COMBO_PRODUCT,
} from '../../graphql'
import { height, width } from '../../utils/Scalaing'
import { FlatList } from 'react-native'
import { useAppContext } from '../../context/app'
import Header from '../../components/Header'
import { Drawer } from '../../components/Drawer'
import CheckoutBar from '../../components/CheckoutBar'
import AppSkeleton from '../../components/skeletons/app'
import DrawerLayout from '../../components/DrawerLayout'

const Recipe = ({ route, navigation }) => {
   let { recipeId, refId, refType } = route.params

   const { visual, masterLoading } = useAppContext()

   const [option, setOption] = React.useState(undefined)
   const [fetching, setFetching] = React.useState(false)
   const [selected, setSelected] = React.useState(new Map())

   // For Drawer
   const [isModalVisible, setIsModalVisible] = React.useState(false)
   const [refProduct, setRefProduct] = React.useState({})

   const { data: { simpleRecipe = {} } = {}, loading, error } = useQuery(
      SIMPLE_RECIPE,
      {
         variables: {
            id: recipeId,
         },
         onCompleted: data => {
            if (data.simpleRecipe.simpleRecipeYields[0]) {
               setOption(data.simpleRecipe.simpleRecipeYields[0])
            }
         },
      }
   )

   const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.simpleRecipeProduct)
         setIsModalVisible(true)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchCustomizableProduct] = useLazyQuery(CUSTOMIZABLE_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.customizableProduct)
         setIsModalVisible(true)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchComboProduct] = useLazyQuery(COMBO_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.comboProduct)
         setIsModalVisible(true)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const buy = () => {
      if (fetching) return
      else {
         setFetching(true)
         switch (refType) {
            case 'simpleRecipeProduct':
               return fetchSimpleRecipeProduct({ variables: { id: refId } })
            case 'customizableProduct':
               return fetchCustomizableProduct({ variables: { id: refId } })
            case 'comboProduct':
               return fetchComboProduct({ variables: { id: refId } })
            default:
               return console.log('No type matched for fetching!')
         }
      }
   }

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (loading) {
      return (
         <View style={styles.center}>
            <Spinner size="large" />
         </View>
      )
   }

   console.log(simpleRecipe)

   return (
      <>
         <Drawer
            isVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            navigation={navigation}
            data={refProduct}
            type={refType}
            id={refId}
            showInfo={true}
         />
         <Header title="Home" navigation={navigation} />
         <ScrollView style={styles.container}>
            <Image source={{ uri: simpleRecipe?.image }} style={styles.image} />
            <View style={styles.info}>
               <TouchableOpacity
                  style={[styles.buyBtn, { backgroundColor: visual.color }]}
                  onPress={buy}
               >
                  <Text style={{ color: '#fff' }}>
                     {fetching ? 'Wait...' : 'Buy Now'}
                  </Text>
               </TouchableOpacity>
               {/* Name */}
               <Text
                  style={{
                     fontSize: width > 768 ? 48 : 24,
                     fontWeight: 'bold',
                     marginBottom: 16,
                  }}
               >
                  {simpleRecipe.name}
               </Text>
               {/* Description */}
               {Boolean(simpleRecipe?.description) && (
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Description</Text>
                     <Text style={styles.text}>{simpleRecipe.description}</Text>
                  </View>
               )}
               {/* Basic Info */}
               <View
                  style={[
                     styles.section,
                     {
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 0,
                     },
                  ]}
               >
                  <View style={styles.tile}>
                     <Text style={styles.sectionTitle}>Type</Text>
                     <Text
                        style={[
                           styles.text,
                           {
                              color:
                                 simpleRecipe?.type === 'Non-vegetarian'
                                    ? '#FF545A'
                                    : '#FF545A',
                           },
                        ]}
                     >
                        {simpleRecipe?.type}
                     </Text>
                  </View>
                  <View style={styles.tile}>
                     <Text style={styles.sectionTitle}>Cuisine</Text>
                     <Text style={styles.text}>{simpleRecipe?.cuisine}</Text>
                  </View>
                  <View style={styles.tile}>
                     <Text style={styles.sectionTitle}>Author</Text>
                     <Text style={styles.text}>{simpleRecipe?.author}</Text>
                  </View>
                  <View style={styles.tile}>
                     <Text style={styles.sectionTitle}>Cooking Time</Text>
                     <Text style={styles.text}>
                        {simpleRecipe?.cookingTime} mins.
                     </Text>
                  </View>
               </View>
               {Boolean(simpleRecipe?.utensils?.length) && (
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Utensils Required</Text>
                     <Text style={styles.text}>
                        {simpleRecipe.utensils.join(', ')}
                     </Text>
                  </View>
               )}
               {Boolean(option) && (
                  <>
                     <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Servings</Text>
                        <View style={{ flexDirection: 'row' }}>
                           {simpleRecipe.simpleRecipeYields.map(item => (
                              <TouchableOpacity
                                 style={[
                                    styles.tag,
                                    {
                                       backgroundColor:
                                          item.id === option.id
                                             ? visual.color
                                             : '#e3e3e3',
                                    },
                                 ]}
                                 onPress={() => setOption(item)}
                              >
                                 <Text
                                    style={{
                                       color:
                                          item.id === option.id
                                             ? '#fff'
                                             : '#111',
                                    }}
                                 >
                                    {item.yield.serving}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                     <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <ScrollView horizontal>
                           {option.ingredientSachets.map(item => (
                              <View
                                 key={item.ingredientSachetId}
                                 style={{ marginRight: 16 }}
                              >
                                 {/* Image */}
                                 {item.ingredientSachet.ingredient.image ? (
                                    <Image
                                       style={{
                                          height: 100,
                                          width: 100,
                                          marginHorizontal: 'auto',
                                          borderRadius: 8,
                                       }}
                                       source={{
                                          uri:
                                             item.ingredientSachet.ingredient
                                                .image,
                                       }}
                                    />
                                 ) : (
                                    <View
                                       style={{ height: 100, width: 100 }}
                                    ></View>
                                 )}
                                 {/* Slip Name */}
                                 <Text
                                    style={{
                                       fontSize: 16,
                                       textAlign: 'center',
                                    }}
                                 >
                                    {item.slipName}
                                 </Text>
                                 {/* Quantity */}
                                 <Text
                                    style={{
                                       fontSize: 14,
                                       textAlign: 'center',
                                       color: '#666',
                                    }}
                                 >
                                    {`${item.ingredientSachet.quantity} ${item.ingredientSachet.unit}`}
                                 </Text>
                              </View>
                           ))}
                        </ScrollView>
                        {/* <FlatList
                           data={option.ingredientSachets}
                           renderItem={item => (
                              <View key={item.ingredientSachetId}>
                                 <Text style={{ color: 'green' }}>
                                    {item.slipName}
                                 </Text>
                              </View>
                           )}
                           keyExtractor={item => item.ingredientSachetId}
                           extraData={selected}
                        /> */}
                     </View>
                  </>
               )}
               {/* Procedure */}
               {Boolean(simpleRecipe?.procedures?.length) && (
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Cooking Steps</Text>
                     {simpleRecipe.procedures.map(procedure => (
                        <View style={styles.procedure}>
                           <Text style={styles.procedureTitle}>
                              {procedure.title}
                           </Text>
                           {procedure.steps
                              .filter(step => step.isVisible)
                              .map(step => (
                                 <View style={styles.step}>
                                    {step.assets?.images[0] && (
                                       <Image
                                          style={{
                                             height: 100,
                                             width: 100,
                                             margin: 8,
                                             borderRadius: 2,
                                          }}
                                          source={{
                                             uri: step.assets?.images[0].url,
                                          }}
                                       />
                                    )}
                                    <View style={styles.stepInfo}>
                                       <Text
                                          style={[
                                             styles.text,
                                             { fontWeight: 'bold' },
                                          ]}
                                       >
                                          {step.title}
                                       </Text>
                                       <Text style={styles.text}>
                                          {step.description}
                                       </Text>
                                    </View>
                                 </View>
                              ))}
                        </View>
                     ))}
                  </View>
               )}
            </View>
            <DrawerLayout />
         </ScrollView>
         {width < 768 && <CheckoutBar navigation={navigation} />}
      </>
   )
}

export default Recipe

const styles = EStyleSheet.create({
   container: {
      backgroundColor: '#fff',
   },
   image: {
      width: width,
      height: height * 0.5,
      resizeMode: 'cover',
   },
   info: {
      margin: width > 768 ? 40 : 8,
      position: 'relative',
   },
   buyBtn: {
      position: 'absolute',
      top: -65,
      right: 0,
      padding: 16,
      borderRadius: 4,
   },
   section: {
      marginBottom: width > 768 ? 32 : 16,
   },
   sectionTitle: {
      color: '#666',
      fontSize: 14,
      marginBottom: 8,
   },
   text: {
      fontSize: width > 768 ? 18 : 16,
   },
   tag: {
      padding: 10,
      backgroundColor: '#e3e3e3',
      marginRight: 5,
      borderRadius: 2,
   },
   tile: {
      marginRight: 32,
      marginBottom: width > 768 ? 32 : 16,
   },
   procedure: {
      paddingVertical: width > 768 ? 16 : 8,
   },
   procedureTitle: {
      fontWeight: 'bold',
      color: '#666',
      marginBottom: 8,
      fontSize: 16,
   },
   step: {
      backgroundColor: '#fff',
      borderRadius: 4,
      marginBottom: 8,
      padding: width > 768 ? 16 : 8,
      flexDirection: width > 768 ? 'row' : 'column',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
   },
   stepInfo: {
      margin: 8,
   },
})
