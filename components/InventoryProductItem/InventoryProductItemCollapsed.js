import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../../utils/Scalaing';
import ServingSelect from '../ServingSelect';

const InventoryProductCollapsed = ({
   data: inventoryProduct,
   label,
   tunnelItem,
   setProductOptionId,
}) => {
   console.log('THISHISH', inventoryProduct);
   const [servingIndex, setServingIndex] = useState(0);
   if (!inventoryProduct) {
      return <Text>Bad Data</Text>;
   }
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
               },
            ]}
         >
            <View style={[styles.item_container_one, { display: 'flex' }]}>
               <Text style={styles.item_image_title}>{label}</Text>
               <Image
                  source={{
                     uri: inventoryProduct?.assets?.images[0]
                        ? inventoryProduct?.assets?.images[0]
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
                  >{`${inventoryProduct.name} `}</Text>

                  {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Modal', {
                  data: inventoryProduct,
                  author: inventoryProduct.author,
                  name: inventoryProduct?.name,
                });
              }}
            >
              <Feather size={14} name='info' />
            </TouchableOpacity> */}
               </View>
               <Text style={styles.item_category}></Text>
               <Text style={styles.item_chef}>
                  {inventoryProduct?.sachetItem?.unitSize &&
                     inventoryProduct?.sachetItem?.unitSize +
                        ' ' +
                        inventoryProduct?.sachetItem?.unit}
                  {inventoryProduct?.supplierItem?.unitSize &&
                     inventoryProduct?.supplierItem?.unitSize +
                        ' ' +
                        inventoryProduct?.supplierItem?.unit}
               </Text>
            </View>
            <View style={styles.item_container_three}>
               <View style={styles.item_three_upper}></View>
               <View style={styles.item_three_lower}>
                  <Text style={styles.item_details}>
                     {inventoryProduct?.inventoryProductOptions[0]?.label}
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
         {tunnelItem && (
            <View style={{ paddingHorizontal: 20 }}>
               <Text style={styles.something}>Avaliable Servings:</Text>
               {inventoryProduct.inventoryProductOptions.map(
                  (item_data, key) => {
                     return (
                        <ServingSelect
                           key={key}
                           index={key + 1}
                           isSelected={servingIndex == key ? true : false}
                           setServingIndex={index => setServingIndex(index)}
                           size={item_data.label}
                           price={item_data.price[0].value}
                           setproductOptionId={setProductOptionId}
                           id={item_data.id}
                        />
                     );
                  }
               )}
            </View>
         )}
      </>
   );
};

const styles = EStyleSheet.create({
   item_container: {
      flexDirection: 'row',
      paddingBottom: 5,
      marginBottom: 2,
      paddingBottom: 20,
      paddingHorizontal: 10,
      marginTop: 4,
      borderBottomWidth: 1,
      backgroundColor: '#fff',
      borderBottomColor: '#ececec',
      height: width < height ? height * 0.15 : height * 0.18,
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
      resizeMode: 'contain',
   },
   item_title: {
      fontSize: '$s',
   },
   item_chef: {
      fontSize: '$xs',
      color: '#4f4e4e',
   },
   something: {
      fontSize: '$xs',
      color: '#4f4e4e',
      marginVertical: 10,
   },
   item_category: {
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
      fontWeight: 'bold',
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

export default InventoryProductCollapsed;
