import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { height } from '../../utils/Scalaing';
import ServingSelect from '../ServingSelect';

const SimpleProductItemCollapsed = ({
   navigation,
   data: simpleRecipeProduct,
   label,
   tunnelItem,
   setProductOptionId,
   isSelected,
}) => {
   const [typeSelected, setTypeSelected] = useState('mealKit');
   const [servingIndex, setServingIndex] = useState(0);

   return (
      <>
         <TouchableOpacity
            onPress={() => {
               if (!tunnelItem) {
               }
            }}
            style={[
               styles.item_container,
               {
                  borderBottomWidth: 1,
                  flex: 8,
                  height: 'auto',
               },
            ]}
         >
            <View style={[styles.item_container_one, { display: 'flex' }]}>
               <Text style={styles.item_image_title}>{label}</Text>
               <Image
                  source={{
                     uri: simpleRecipeProduct?.assets?.images[0]
                        ? simpleRecipeProduct?.assets?.images[0]
                        : 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                  }}
                  style={styles.item_image}
               />
            </View>
            <View
               style={[
                  styles.item_container_two,
                  {
                     paddingTop: 15,
                     paddingLeft: 10,
                  },
               ]}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                     style={styles.item_title}
                  >{`${simpleRecipeProduct?.name} `}</Text>

                  <TouchableOpacity
                     onPress={() =>
                        navigation.navigate('Modal', {
                           recipeId: simpleRecipeProduct?.simpleRecipe?.id,
                        })
                     }
                  >
                     <Feather size={14} name="info" />
                  </TouchableOpacity>
               </View>
               <Text
                  style={styles.item_chef}
               >{`${simpleRecipeProduct.simpleRecipe.author} `}</Text>
               <Text style={styles.item_category}>
                  {simpleRecipeProduct.simpleRecipe.type}
               </Text>
            </View>
            <View style={styles.item_container_three}>
               <View style={styles.item_three_upper}></View>
               <View style={styles.item_three_lower}>
                  <Text style={styles.item_details}>
                     Mealkit | <Feather name="user" />{' '}
                     <Text style={{ fontWeight: 'bold' }}>1</Text>
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
         {tunnelItem && isSelected && (
            <View style={{ paddingHorizontal: 20 }}>
               <View style={styles.type_container}>
                  <View style={{ flex: 1 }}></View>
                  <View style={styles.type_container_right}>
                     <TouchableOpacity
                        style={[
                           styles.type_button,
                           typeSelected === 'mealKit'
                              ? styles.selected_type_conatiner
                              : {},
                        ]}
                        onPress={() => setTypeSelected('mealKit')}
                     >
                        <Text style={styles.type_text}>Meal Kit</Text>
                        {typeSelected === 'mealKit' && (
                           <View style={styles.done_container}>
                              <MaterialIcons
                                 name="done"
                                 size={16}
                                 color="#fff"
                              />
                           </View>
                        )}
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={() => setTypeSelected('readyToEat')}
                        style={[
                           styles.type_button,
                           typeSelected === 'readyToEat'
                              ? styles.selected_type_conatiner
                              : {},
                        ]}
                     >
                        <Text style={styles.type_text}>Ready To Eat</Text>
                        {typeSelected === 'readyToEat' && (
                           <View style={[styles.done_container]}>
                              <MaterialIcons
                                 name="done"
                                 size={16}
                                 color="#fff"
                              />
                           </View>
                        )}
                     </TouchableOpacity>
                  </View>
               </View>
               <Text style={styles.item_chef}>Avaliable Servings:</Text>
               {simpleRecipeProduct.simpleRecipeProductOptions
                  .filter(serving => serving.type === typeSelected)
                  .map((item_data, key) => {
                     return (
                        <ServingSelect
                           key={key}
                           index={key + 1}
                           isSelected={servingIndex == key ? true : false}
                           setServingIndex={index => setServingIndex(index)}
                           size={item_data.simpleRecipeYield.yield.serving}
                           price={item_data.price[0].value}
                           display={
                              typeSelected === 'mealKit'
                                 ? 'Meal Kit'
                                 : 'Ready To Eat'
                           }
                           type={item_data.type}
                           setproductOptionId={setProductOptionId}
                           id={item_data.id}
                        />
                     );
                  })}
            </View>
         )}
      </>
   );
};

const styles = EStyleSheet.create({
   item_container: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 5,
      marginBottom: 2,
      paddingBottom: 20,
      paddingHorizontal: 10,
      marginTop: 4,
      borderBottomWidth: 1,
      backgroundColor: '#fff',
      borderBottomColor: '#ececec',
   },
   item_container_one: {
      flex: 2,
      position: 'relative',
      paddingTop: 20,
   },
   item_container_two: {
      flex: 4,
      paddingTop: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
      paddingTop: 15,
      paddingLeft: 10,
   },
   item_container_three: {
      flex: 2,
      paddingTop: 15,
   },
   bottom_container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
   },
   item_image_title: {
      position: 'absolute',
      zIndex: 8,
      color: 'gray',
      fontWeight: 'bold',
   },
   item_image: {
      flex: 1,
      height: null,
      width: null,
      resizeMode: 'cover',
      aspectRatio: 3 / 2,
   },
   item_title: {
      fontSize: '$xxs',
   },
   item_chef: {
      color: 'gray',
      fontSize: '$xxxs',
   },
   item_category: {
      backgroundColor: '#56b783',
      color: 'white',
      width: 70,
      textAlign: 'center',
      marginTop: 5,
      paddingVertical: 2,
      borderRadius: 2,
      fontSize: '$xxs',
   },
   options_text: {
      color: '#3fa4fd',
      textAlign: 'right',
      fontSize: '$xxs',
   },
   item_details: {
      textAlign: 'right',
      fontSize: '$xxs',
   },
   price: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
   },
   add_to_cart_container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
   },
   button: {
      backgroundColor: '#3fa4ff',
      paddingVertical: 5,
      paddingHorizontal: 15,
   },
   add_to_card_text: {
      color: 'white',
      fontSize: 14,
   },
   price_text: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   details: {
      justifyContent: 'center',
   },
   type_container: {
      height: height * 0.1,
      flexDirection: 'row',
   },
   type_container_right: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 15,
   },
   type_button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f1f1f1',
      paddingHorizontal: 10,
   },
   done_container: {
      backgroundColor: '#3fa4ff',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      height: 20,
      width: 20,
   },
   item_three_upper: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      flex: 1,
   },
   item_three_lower: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
   },
});

export default SimpleProductItemCollapsed;
