import React, { useState } from 'react';
import SimpleProductItemCollapsed from './SimpleProductItemCollapsed';

const SimpleProductItem = ({
   _id,
   openModal,
   navigation,
   setPrice,
   independantItem,
   setcartItem,
   setcardData,
   tunnelItem,
   setSelected,
   isSelected,
   name,
   label,
   product,
}) => {
   const [objToAdd, setobjToAdd] = useState({});

   const setProductOptionId = (id, price) => {
      let newItem = objToAdd;
      newItem.product.option.id = id;
      newItem.product.price = price;
      setobjToAdd(newItem);
      setcartItem(newItem);
   };

   React.useEffect(() => {
      if (product.simpleRecipeProductOptions[0]) {
         let objToPush = {
            product: {
               id: product.id,
               name: product.name,
               price: product.simpleRecipeProductOptions[0]?.price[0].value,
               option: {
                  id: product.simpleRecipeProductOptions[0]?.id, // product option id
                  type: product.simpleRecipeProductOptions[0]?.type,
               },
               type: 'Simple Recipe',
            },
         };
         if (!independantItem) {
            objToPush['name'] = name;
         }
         setobjToAdd(objToPush);
         if (!tunnelItem && independantItem) {
            setPrice(product.simpleRecipeProductOptions[0]?.price[0]?.value);
            setcardData(product);
         }
         if (tunnelItem && isSelected) {
            setcartItem(objToPush);
         }
         if (tunnelItem && independantItem) {
            setcartItem(objToPush);
         }
      }
   }, []);

   return (
      <SimpleProductItemCollapsed
         _id={_id}
         data={product}
         openModal={openModal}
         navigation={navigation}
         label={label}
         tunnelItem={tunnelItem}
         setProductOptionId={setProductOptionId}
         setSelected={setSelected}
         isSelected={isSelected}
      />
   );
};

export default SimpleProductItem;
