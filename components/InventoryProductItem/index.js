import React, { useEffect, useState } from 'react';
import InventoryProductCollapsed from './InventoryProductItemCollapsed';

const InventoryProductItem = ({
   _id,
   openModal,
   navigation,
   setPrice,
   tunnelItem,
   independantItem,
   setcartItem,
   setcardData,
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

   useEffect(() => {
      if (
         product?.inventoryProductOptions === undefined ||
         !product?.inventoryProductOptions[0]
      )
         return;
      let objToPush = {
         product: {
            id: product?.id,
            name: product?.name,
            price: product?.inventoryProductOptions[0]?.price[0]?.value,
            option: {
               id: product?.inventoryProductOptions[0]?.id, // product option id
            },
            type: 'Inventory',
         },
      };
      if (!independantItem) {
         objToPush['name'] = name;
      }
      setobjToAdd(objToPush);
      if (!tunnelItem && independantItem) {
         setPrice(product?.inventoryProductOptions[0]?.price[0]?.value);
         setcardData(product);
      }
      if (tunnelItem && isSelected) {
         setcartItem(objToPush);
      }
      if (tunnelItem && independantItem) {
         setcartItem(objToPush);
      }
   }, []);

   useEffect(() => {
      if (tunnelItem && isSelected && objToAdd?.product?.price) {
         setcartItem(objToAdd);
      }
   }, [isSelected]);

   return (
      <InventoryProductCollapsed
         _id={_id}
         data={product}
         openModal={openModal}
         navigation={navigation}
         label={label}
         tunnelItem={tunnelItem}
         setProductOptionId={setProductOptionId}
         setSelected={setSelected}
      />
   );
};

export default InventoryProductItem;
