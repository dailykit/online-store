import React, { Component } from 'react';
import {
   Text,
   StyleSheet,
   View,
   ScrollView,
   Image,
   Dimensions,
   TouchableOpacity,
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import cooking from '../assets/imgs/cooking.png';
import EStyleSheet from 'react-native-extended-stylesheet';

import TabsNew from './Tabs';

import { Tabs, Tab } from 'native-base';

import { height, width } from '../utils/Scalaing';
import { useQuery } from '@apollo/react-hooks';
import { SIMPLE_RECIPE } from '../graphql';
import { Spinner } from '@ui-kitten/components';

const ModalContent = ({ route, navigation }) => {
   let { recipeId } = route.params;

   const { data, loading, error } = useQuery(SIMPLE_RECIPE, {
      variables: {
         id: recipeId,
      },
   });

   if (loading) {
      return (
         <View style={styles.center}>
            <Spinner />
         </View>
      );
   }

   if (error) {
      return (
         <View style={styles.center}>
            <Text>
               Oops! We could not get recipe details. Check again later.
            </Text>
         </View>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.title_container}>
            <View style={styles.details}>
               <Text style={styles.item_title}>{data.simpleRecipe.name}</Text>
               <Text style={styles.item_chef}>{data.simpleRecipe.author}</Text>
               <Text style={styles.item_category}>
                  {data.simpleRecipe.type}
               </Text>
            </View>
            <View style={styles.close_container}>
               <TouchableOpacity
                  onPress={() => {
                     navigation.goBack();
                  }}
               >
                  <AntDesign size={30} name="close" />
               </TouchableOpacity>
            </View>
         </View>
         <View style={styles.image_cover_container}>
            <Image
               source={{
                  uri: data.simpleRecipe.image,
               }}
               style={styles.image_cover}
            />
         </View>
         <TabsNew data={data.simpleRecipe.tags} />
         <View style={styles.desc}>
            <Text style={styles.desc_content}>
               {data.simpleRecipe.description}.
            </Text>
            <View style={styles.cooking_container}>
               <Image source={cooking} style={styles.cooking_img} />
               <Text style={styles.desc_time}>
                  Cooking Time: {data.simpleRecipe.cookingTime} mins.
               </Text>
            </View>
            <Text style={styles.desc_equipments}>
               Equipments needed: {data.simpleRecipe.utensils.join(', ')}
            </Text>
            {/* <Text style={styles.desc_allergy}>
            Alergans: Allergan1, Allergan 2
          </Text> */}
         </View>
         <Tabs
            tabBarUnderlineStyle={{
               backgroundColor: 'white',
               borderColor: 'black',
            }}
            tabBarBackgroundColor="#fff"
         >
            <Tab tabBarBackgroundColor="#fff" heading="Ingredients">
               {data.simpleRecipe.ingredients.map((ing, key) => (
                  <View style={styles.ing_container} key={key}>
                     <Image
                        source={{
                           uri: ing.image,
                        }}
                        style={styles.ing_img}
                     />
                     <Text style={styles.ing_text}>
                        {ing.name} - {ing.ingredientProcessing.processingName}
                     </Text>
                  </View>
               ))}
            </Tab>
            <Tab heading="Procedure">
               {data.simpleRecipe.procedures.map((procedure, key) => (
                  <View style={styles.procedure} key={key}>
                     <Text style={styles.procedureTitle}>
                        {procedure.title}
                     </Text>
                     {procedure.steps.map((step, key) => (
                        <View style={styles.step} key={key}>
                           <Text style={styles.stepTitle}>
                              {key + 1}. {step.title}
                           </Text>
                           <Text style={styles.stepDesc}>
                              {step.description}
                           </Text>
                        </View>
                     ))}
                  </View>
               ))}
            </Tab>
            {/* <Tab heading='Nuritional Values'>
            <Text style={styles.procedure}>` 1. Lorem ipsum `</Text>
            <Text style={styles.procedure}>
              ` 2. Lorem ipsum dnbfkj dfiusabdfks dfsudfb skdfsiu dfisgbdf`
            </Text>
            <Text style={styles.procedure}>` 3. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 4. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 5. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 6. Lorem ipsum `</Text>
          </Tab> */}
         </Tabs>
      </ScrollView>
   );
};

export default ModalContent;

const styles = StyleSheet.create({
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: { flex: 1 },
   item_title: {
      fontSize: 16,
   },
   item_chef: {
      color: 'gray',
      fontSize: 12,
   },
   item_category: {
      backgroundColor: '#56b783',
      color: 'white',
      width: 70,
      textAlign: 'center',
      marginTop: 5,
      paddingVertical: 2,
      borderRadius: 2,
      fontSize: 12,
   },
   title_container: {
      height: 100,
      flexDirection: 'row',
      padding: 20,
   },
   close_container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
   },
   details: {
      flex: 1,
   },
   image_cover_container: {
      height: height * 0.7,
      width: width > 1280 ? 1280 : width,
   },
   image_cover: {
      flex: 1,
      height: null,
      width: null,
   },
   desc: {
      padding: 20,
   },
   cooking_container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   cooking_img: {
      height: 20,
      resizeMode: 'contain',
   },
   desc_content: {
      marginBottom: 20,
   },
   desc_equipments: {
      marginBottom: 20,
   },
   ing_img: {
      height: 50,
      width: 80,
   },
   ing_container: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
   },
   ing_text: {
      paddingLeft: 10,
   },
   procedure: {
      margin: 10,
      color: '#666',
   },
   procedureTitle: {
      fontWeight: 500,
      fontSize: 18,
   },
   step: {
      marginHorizontal: 8,
   },
   stepTitle: {
      fontWeight: 500,
      fontSize: 14,
   },
   stepDesc: {
      marginLeft: 14,
   },
});
