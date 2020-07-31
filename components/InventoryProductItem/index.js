import React, { useEffect, useState } from 'react'
import InventoryProductCollapsed from './InventoryProductItemCollapsed'
import { priceSort, discountedPrice } from '../../utils'

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
   onModifiersValidityChange,
}) => {
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOption = option => {
      setobjToAdd({
         ...objToAdd,
         option: { id: option.id, label: option.label },
         price: option.price[0].value,
         modifiers: [],
      })
      setcartItem({
         ...objToAdd,
         option: { id: option.id, label: option.label },
         price: option.price[0].value,
         modifiers: [],
      })
   }

   const modifiersHandler = modifiers => {
      setobjToAdd({ ...objToAdd, modifiers })
      setcartItem({ ...objToAdd, modifiers })
   }

   useEffect(() => {
      const option =
         product.defaultInventoryProductOption ||
         product.inventoryProductOptions.sort(priceSort)[0]
      let objToPush = {
         id: product?.id,
         name: product?.name,
         price: option.price[0]?.value,
         image: product?.assets?.images[0],
         option: {
            id: option?.id, // product option id
            label: option?.label,
         },
         modifiers: [],
         type: 'inventoryProduct',
      }
      if (comboProductComponent) {
         objToPush.comboProductComponentId = comboProductComponent.id
         objToPush.comboProductComponentLabel = comboProductComponent.label
      }
      setobjToAdd(objToPush)
      if (!tunnelItem && independantItem) {
         setPrice(discountedPrice(option.price[0]))
         setcardData(product)
      }
      if (tunnelItem && isSelected) {
         setcartItem(objToPush)
      }
      if (tunnelItem && independantItem) {
         setcartItem(objToPush)
      }
   }, [product])

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
         setProductOption={setProductOption}
         setSelected={setSelected}
         isSelected={isSelected}
         refId={refId}
         onModifersSelected={modifiersHandler}
         onValidityChange={onModifiersValidityChange}
      />
   )
}

export default InventoryProductItem
