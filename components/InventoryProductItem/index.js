import React, { useEffect, useState } from 'react'
import { discountedPrice, priceSort } from '../../utils'
import InventoryProductCollapsed from './InventoryProductItemCollapsed'

const InventoryProductItem = ({
   _id,
   openModal,
   showInfo,
   navigation,
   setPrice,
   setDiscount,
   tunnelItem,
   independantItem,
   setcartItem,
   setcardData,
   setSelected,
   isSelected,
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
         discount: option.price[0].discount,
         modifiers: [],
      })
      setcartItem({
         ...objToAdd,
         option: { id: option.id, label: option.label },
         price: option.price[0].value,
         discount: option.price[0].discount,
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
         discount: option.price[0].discount,
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
         if (option.price[0].discount)
            setDiscount(parseFloat(option.price[0].discount))
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
         onModifiersSelected={modifiersHandler}
         onValidityChange={onModifiersValidityChange}
      />
   )
}

export default InventoryProductItem
