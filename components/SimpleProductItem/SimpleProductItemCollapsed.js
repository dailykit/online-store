import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import {styles} from './styles'
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



export default SimpleProductItemCollapsed;
