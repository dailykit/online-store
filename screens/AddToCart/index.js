import React, { lazy, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Cart, { ComboProductItemProceed } from '../../components/Cart'
import { useCartContext } from '../../context/cart'
import { height } from '../../utils/Scaling'
import { styles } from './styles'
const ComboProduct = lazy(() => import('../../components/ComboProduct'))
const CustomizableProductItem = lazy(() =>
   import('../../components/CustomizableProductItem')
)
const InventoryProductItem = lazy(() =>
   import('../../components/InventoryProductItem')
)
const SimpleProductItem = lazy(() =>
   import('../../components/SimpleProductItem')
)

const ModalContent = ({
   showInfo,
   route,
   navigation,
   setIsModalVisible,
   data,
   type,
   id,
   ...restProps
}) => {
   const { comboProductAdded } = useCartContext()

   const [cartItem, setcartItem] = useState(null) // obj to push to jaguar
   const [isLastComboItem, setIsLastComboItem] = useState(false)
   const [comboProductItems, setcomboProductItems] = useState([])
   const [numberOfComboProductItem, setnumberOfComboProductItem] = useState(
      data?.comboProductComponents?.length || 0
   )
   const [currentComboProductIndex, setCurrentComboProductIndex] = useState(0)

   const [isDisabled, setIsDisabled] = React.useState(false)

   React.useEffect(() => {
      if (data.comboProductComponents) {
         setnumberOfComboProductItem(data.comboProductComponents.length)
      }
   }, [data.comboProductComponents])

   React.useEffect(() => {
      setCurrentComboProductIndex(0)
   }, [comboProductAdded])

   const selectComponent = item => {
      console.log('Item recived: ', item)
      // filter removes empty objects
      let auxArray = comboProductItems.filter(
         item => item.comboProductComponentId
      )
      const index = auxArray.findIndex(
         component =>
            component.comboProductComponentId === item.comboProductComponentId
      )
      if (index !== -1) {
         auxArray.splice(index, 1)
      }
      const refacItem = {
         ...item,
         totalPrice: parseFloat(item.price),
         unitPrice: parseFloat(item.price),
         quantity: 1,
      }
      delete refacItem.price
      auxArray.push(refacItem)
      setcomboProductItems(auxArray)
   }

   return (
      <View style={{ flex: 1 }}>
         <ScrollView style={styles.container}>
            <View style={styles.item_parent_container}>
               {type == 'comboProduct' && (
                  <ComboProduct
                     setcartItem={item => selectComponent(item)}
                     navigation={navigation}
                     tunnelItem
                     setIsLastComboItem={setIsLastComboItem}
                     setCurrentComboProductIndex={setCurrentComboProductIndex}
                     setnumberOfComboProductItem={setnumberOfComboProductItem}
                     currentComboProductIndex={currentComboProductIndex}
                     name={data.name}
                     id={id}
                     product={data}
                     onModifiersValidityChange={isValid =>
                        setIsDisabled(!isValid)
                     }
                     {...restProps}
                  />
               )}
               {type == 'customizableProduct' && (
                  <CustomizableProductItem
                     setcartItem={setcartItem}
                     navigation={navigation}
                     independantItem
                     tunnelItem
                     isSelected
                     id={id}
                     product={data}
                     onModifiersValidityChange={isValid =>
                        setIsDisabled(!isValid)
                     }
                     {...restProps}
                  />
               )}
               {type == 'simpleRecipeProduct' && (
                  <SimpleProductItem
                     setcartItem={item => setcartItem(item)}
                     navigation={navigation}
                     showInfo={showInfo}
                     independantItem
                     tunnelItem
                     isSelected
                     id={id}
                     product={data}
                     onModifiersValidityChange={isValid =>
                        setIsDisabled(!isValid)
                     }
                     {...restProps}
                  />
               )}
               {type == 'inventoryProduct' && (
                  <InventoryProductItem
                     setcartItem={item => {
                        setcartItem(item)
                     }}
                     showInfo={showInfo}
                     navigation={navigation}
                     independantItem={true}
                     tunnelItem
                     isSelected
                     id={id}
                     product={data}
                     onModifiersValidityChange={isValid =>
                        setIsDisabled(!isValid)
                     }
                     {...restProps}
                  />
               )}
            </View>
            <View style={{ height: height * 0.08 }} />
         </ScrollView>
         <View style={{ marginTop: 40 }}>
            {type !== 'comboProduct' && (
               <Cart
                  cartItem={cartItem}
                  navigation={navigation}
                  to={'Home'}
                  {...restProps}
                  product={data}
                  text="Add to Cart"
                  tunnelItem
                  type={type}
                  setIsModalVisible={setIsModalVisible}
                  isDisabled={isDisabled}
               />
            )}
            {type == 'comboProduct' &&
               numberOfComboProductItem - 1 == currentComboProductIndex && (
                  <Cart
                     cartItem={cartItem}
                     navigation={navigation}
                     {...restProps}
                     text="Add to Cart"
                     product={data}
                     comboProductItems={comboProductItems}
                     tunnelItem
                     type={type}
                     setIsModalVisible={setIsModalVisible}
                     isDisabled={isDisabled}
                  />
               )}
            {type == 'comboProduct' &&
               numberOfComboProductItem - 1 != currentComboProductIndex && (
                  <ComboProductItemProceed
                     setCurrentComboProductIndex={setCurrentComboProductIndex}
                     currentComboProductIndex={currentComboProductIndex}
                     isDisabled={isDisabled}
                  />
               )}
         </View>
         {/* )} */}
      </View>
   )
}

export default ModalContent
