import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { stylesCollapsed as styles } from './styles';

const CustomizableProductItemCollapsed = ({
   _id,
   setSelected,
   isLast,
   navigation,
   setExpanded,
   data,
   label,
   independantItem,
   numberOfOptions,
   tunnelItem,
}) => {
   let simpleRecipeProduct = data.simpleRecipeProduct;
   return (
      <TouchableOpacity
         onPress={() => {
            if (!tunnelItem) {
               setExpanded(false);
            }
         }}
         style={[
            styles.item_container,
            {
               borderBottomWidth: isLast ? 0 : 1,
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
            >{`${simpleRecipeProduct?.simpleRecipe?.author} `}</Text>
            <Text style={styles.item_category}>vegeterian</Text>
         </View>
         <View style={styles.item_container_three}>
            <View style={styles.item_three_upper}>
               <TouchableOpacity
                  onPress={() => {
                     if (!independantItem) {
                        setSelected(_id);
                        setExpanded(true);
                     } else {
                        setExpanded(true);
                     }
                  }}
               >
                  <Text style={styles.options_text}>
                     {numberOfOptions} options{' '}
                     <Ionicons name="ios-arrow-down" />
                  </Text>
               </TouchableOpacity>
            </View>
            <View style={styles.item_three_lower}>
               <Text style={styles.item_details}>
                  Mealkit | <Feather name="user" />{' '}
                  <Text style={{ fontWeight: 'bold' }}>1</Text>
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};



export default CustomizableProductItemCollapsed;
