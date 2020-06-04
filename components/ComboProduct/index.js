import React, { useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import CustomizableProductItem from '../CustomizableProductItem';
import InventoryProductItem from '../InventoryProductItem';
import SimpleProductItem from '../SimpleProductItem';

const ComboProduct = ({
   tunnelItem,
   navigation,
   setcardData,
   setcartItem,
   setIsLastComboItem,
   setCurrentComboProductIndex,
   setnumberOfComboProductItem,
   currentComboProductIndex,
   setPrice,
   product,
}) => {
   const [selected, setSelected] = useState(0);

   const [comboProductsArray, setcomboProductsArray] = useState([]);

   React.useEffect(() => {
      let price = 0;
      product.comboProductComponents.forEach(product => {
         if (product.inventoryProductId !== null) {
            price =
               price +
               parseFloat(
                  product.inventoryProduct.inventoryProductOptions[0].price[0]
                     .value
               );
         }
         if (product.simpleRecipeProductId !== null) {
            price =
               price +
               parseFloat(
                  product.simpleRecipeProduct.simpleRecipeProductOptions[0]
                     .price[0].value
               );
         }
         if (product.customizableProductId !== null) {
            price =
               price +
               parseFloat(
                  product.customizableProduct?.customizableProductOptions[0]
                     ?.simpleRecipeProduct?.simpleRecipeProductOptions[0]
                     ?.price[0]?.value
               );
         }
      });
      setPrice(price);
   }, []);

   // let comboProductComponents = product.comboProductComponents;
   let selectedArr = product.comboProductComponents?.map((el, _id) => false);
   // if (comboProductComponents == undefined) return <Text>Bad Data</Text>;
   return (
      <View style={styles.container}>
         <View style={styles.item_parent_container}>
            {product.comboProductComponents.map((el, _id) => {
               let last = false;
               let isSelected = false;
               if (!tunnelItem) {
                  isSelected = selected == _id;
                  if (_id == product.comboProductComponents.length - 1) {
                     last = true;
                  }
               } else {
                  last = false;
                  isSelected = currentComboProductIndex == _id;
                  if (_id == product.comboProductComponents.length - 1) {
                     last = true;
                  }
               }
               if (el.customizableProductId !== null) {
                  return (
                     <CustomizableProductItem
                        isSelected={isSelected}
                        _id={_id}
                        product={el.customizableProduct}
                        setSelected={index => {
                           selectedArr[index] = true;
                           setSelected(index);
                           if (selectedArr.every(item => item == true)) {
                              setIsLastComboItem(true);
                           }
                        }}
                        isLast={last}
                        key={_id}
                        navigation={navigation}
                        tunnelItem={tunnelItem}
                        id={el.customizableProductId}
                        setcartItem={setcartItem}
                        setDefault={item => setcomboProductsArray(item)}
                        name={el.name}
                     />
                  );
               }
               if (el.simpleRecipeProductId !== null) {
                  return (
                     <SimpleProductItem
                        isSelected={isSelected}
                        _id={_id}
                        product={el.simpleRecipeProduct}
                        setSelected={index => {
                           selectedArr[index] = true;
                           setSelected(index);
                           if (selectedArr.every(item => item == true)) {
                              setIsLastComboItem(true);
                           }
                        }}
                        isLast={last}
                        key={_id}
                        navigation={navigation}
                        id={el.simpleRecipeProductId}
                        tunnelItem={tunnelItem}
                        setcartItem={setcartItem}
                        name={el.name}
                     />
                  );
               }
               if (el.inventoryProductId !== null) {
                  return (
                     <InventoryProductItem
                        isSelected={isSelected}
                        _id={_id}
                        product={el.inventoryProduct}
                        setSelected={index => {
                           selectedArr[index] = true;
                           setSelected(index);
                           console.log(selectedArr);
                           if (selectedArr.every(item => item == true)) {
                              setIsLastComboItem(true);
                           }
                        }}
                        isLast={last}
                        key={_id}
                        navigation={navigation}
                        id={el.inventoryProductId}
                        tunnelItem={tunnelItem}
                        setcartItem={setcartItem}
                        name={el.name}
                     />
                  );
               }
            })}
         </View>
      </View>
   );
};

export default ComboProduct;

const styles = EStyleSheet.create({
   container: { backgroundColor: '#fff' },

   card_title: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   card_title_text: {
      fontSize: '$m',
      fontWeight: 'bold',
   },
   is_customizable: {
      fontSize: '$xxxs',
      color: 'gray',
   },
   item_parent_container: {
      backgroundColor: '#fff',
   },
   flexContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
