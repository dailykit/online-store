import { useQuery } from '@apollo/react-hooks'
import { Spinner, Tab, Tabs } from 'native-base'
import React from 'react'
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SIMPLE_RECIPE } from '../graphql'
import { height, width } from '../utils/Scalaing'
import { FlatList } from 'react-native'
import { useAppContext } from '../context/app'

const ModalContent = ({ route, navigation }) => {
   let { recipeId } = route.params

   const { visual } = useAppContext()

   const [option, setOption] = React.useState(undefined)
   const [selected, setSelected] = React.useState(new Map())

   React.useEffect(() => {
      console.log(option)
   }, [option])

   const onSelect = React.useCallback(
      id => {
         const newSelected = new Map(selected)
         newSelected.set(id, !selected.get(id))

         setSelected(newSelected)
      },
      [selected]
   )

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
         <ScrollView style={styles.container}>
            <Image source={{ uri: simpleRecipe?.image }} style={styles.image} />
            <View style={styles.info}>
               {/* Name */}
               <Text
                  style={{
                     fontSize: width > 768 ? 32 : 24,
                     fontWeight: 'bold',
                     marginBottom: 16,
                  }}
               >
                  {simpleRecipe.name}
               </Text>
               {/* Tags */}
               {Boolean(simpleRecipe?.tags?.length) && (
                  <View style={styles.section}>
                     {simpleRecipe.tags.map(tag => (
                        <View style={styles.tag}>{tag}</View>
                     ))}
                  </View>
               )}
               {/* Description */}
               {Boolean(simpleRecipe?.description) && (
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Description</Text>
                     <Text style={styles.text}>{simpleRecipe.description}</Text>
                  </View>
               )}
               {/* Basic Info */}
               <View style={[styles.section, { flexDirection: 'row' }]}>
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
            </View>
         </ScrollView>
      </>
   )
}

export default ModalContent

const styles = EStyleSheet.create({
   container: {},
   image: {
      width: width,
      height: height * 0.5,
      resizeMode: 'cover',
   },
   info: {
      margin: width > 768 ? 20 : 8,
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
   },
})
