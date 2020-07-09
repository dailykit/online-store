import React, { useEffect, useState } from 'react'
import InventoryProductCollapsed from './InventoryProductItemCollapsed'

const InventoryProductItem = ({
   _id,
   openModal,
   showInfo,
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
   refId,
   comboProductComponent,
}) => {
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOptionId = (id, price) => {
      let newItem = objToAdd
      newItem.option.id = id
      newItem.price = price
      setobjToAdd(newItem)
      setcartItem(newItem)
   }

   useEffect(() => {
      if (
         product?.inventoryProductOptions === undefined ||
         !product?.inventoryProductOptions[0]
      )
         return
      let objToPush = {
         id: product?.id,
         name: product?.name,
         price: product?.inventoryProductOptions[0]?.price[0]?.value,
         image: product?.assets?.images[0],
         option: {
            id: product?.inventoryProductOptions[0]?.id, // product option id
         },
         type: 'inventoryProduct',
      }
      if (comboProductComponent) {
         objToPush.comboProductComponentId = comboProductComponent.id
         objToPush.comboProductComponentLabel = comboProductComponent.label
      }
      setobjToAdd(objToPush)
      if (!tunnelItem && independantItem) {
         setPrice(product?.inventoryProductOptions[0]?.price[0]?.value)
         setcardData(product)
      }
      if (tunnelItem && isSelected) {
         setcartItem(objToPush)
      }
      if (tunnelItem && independantItem) {
         setcartItem(objToPush)
      }
   }, [])

   useEffect(() => {
      if (tunnelItem && isSelected && objToAdd?.product?.price) {
         setcartItem(objToAdd)
      }
   }, [isSelected])

   return (
      <InventoryProductCollapsed
         showInfo={showInfo}
         _id={_id}
         data={product}
         openModal={openModal}
         navigation={navigation}
         label={label}
         tunnelItem={tunnelItem}
         setProductOptionId={setProductOptionId}
         setSelected={setSelected}
         isSelected={isSelected}
         refId={refId}
      />
   )
}

export default InventoryProductItem
