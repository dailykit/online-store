import React from 'react'
import styled, { css } from 'styled-components/native'
import { useAppContext } from '../context/app'
import { priceSort, beautifyType } from '../utils'
import { Drawer } from './Drawer'

const ProductCard = ({ product, navigation }) => {
   const { visual } = useAppContext()

   const [isModalVisible, setIsModalVisible] = React.useState(false)
   const [isHovering, setIsHovering] = React.useState(false)

   const productType = (() => {
      if (product.__typename.includes('simpleRecipeProduct')) {
         return 'SRP'
      }
      if (product.__typename.includes('inventoryProduct')) {
         return 'IP'
      }
      if (product.__typename.includes('customizableProduct')) {
         return 'CUSP'
      }
      if (product.__typename.includes('comboProduct')) {
         return 'COMP'
      }
   })()

   const renderLabel = () => {
      if (productType === 'CUSP') {
         return <Label>Customizable</Label>
      }
      if (productType === 'COMP') {
         return <Label>Combo</Label>
      }
      return null
   }

   const openProductPage = () => {
      if (productType === 'SRP') {
         navigation.navigate('recipe', {
            recipeId: product.simpleRecipe.id,
            refId: product.id,
            refType: 'simpleRecipeProduct',
         })
      } else {
         navigation.navigate('ProductPage', {
            id: product.id,
            type:
               productType === 'IP'
                  ? 'inventoryProduct'
                  : productType === 'CUSP'
                  ? 'customizableProduct'
                  : 'comboProduct',
         })
      }
   }

   const renderProductInfo = () => {
      let leftText = ''
      let rightText = ''

      if (productType === 'SRP') {
         const option =
            product.defaultSimpleRecipeProductOption ||
            product.simpleRecipeProductOptions.sort(priceSort)[0]
         const serving = option?.simpleRecipeYield?.yield
         if (serving) {
            if (serving.label) {
               leftText = `${serving.label}`
            } else {
               leftText = `Serves ${serving.serving}`
            }
            rightText = beautifyType(option?.type)
         }
      }

      if (productType === 'IP') {
         const option =
            product.inventoryProductOption ||
            product.inventoryProductOptions.sort(priceSort)[0]
         leftText = option?.label
         if (product.sachetItem) {
            rightText = `${product.sachetItem.unitSize} ${product.sachetItem.unit}`
         }
         if (product.supplierItem) {
            rightText = `${product.supplierItem.unitSize} ${product.supplierItem.unit}`
         }
      }

      return (
         <SpaceApart>
            <ProductInfoText numberOfLines={1} ellipsizeMode="tail">
               {leftText}
            </ProductInfoText>
            <ProductInfoText numberOfLines={1} ellipsizeMode="tail">
               {rightText}
            </ProductInfoText>
         </SpaceApart>
      )
   }

   const renderProductPrice = () => {
      return (
         <PriceWrapper>
            <OriginalPrice>$10.00</OriginalPrice>
            <Price>$7.99</Price>
         </PriceWrapper>
      )
   }

   return (
      <Wrapper
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}
         isHovering={isHovering}
      >
         <Drawer
            isVisible={isModalVisible}
            navigation={navigation}
            data={product}
            type={product.__typename.split('_')[1]}
            id={product.id}
            setIsModalVisible={setIsModalVisible}
            showInfo={true}
         />
         {renderLabel()}
         <ProductImage
            size={productType === 'IP' ? 'contain' : 'cover'}
            source={{ uri: product.assets.images[0] }}
         />
         <CardBody>
            <CardBodyUpper onPress={openProductPage}>
               <ProductName
                  color={visual.color}
                  numberOfLines={2}
                  ellipsizeMode="tail"
               >
                  {product.name}
               </ProductName>
               {product.additionalText && (
                  <AdditionalText numberOfLines={2} ellipsizeMode="tail">
                     {product.additionalText}
                  </AdditionalText>
               )}
            </CardBodyUpper>
            <Spacer size="12px" />
            <CardBodyLower>
               {renderProductInfo()}
               <Spacer size="10px" />
               <SpaceApart>
                  {renderProductPrice()}
                  <AddToCart
                     color={visual.color}
                     onPress={() => setIsModalVisible(true)}
                  >
                     <AddToCartText> Add + </AddToCartText>
                  </AddToCart>
               </SpaceApart>
            </CardBodyLower>
         </CardBody>
      </Wrapper>
   )
}

export default ProductCard

const Spacer = styled.View`
   height: ${props => props.size};
`

const Wrapper = styled.View`
   border-radius: 8px;
   margin-right: 20px;
   margin-bottom: 10px;
   overflow: hidden;
   width: 240px;
   shadow-opacity: ${props => (props.isHovering ? '1' : '0.5')};
   shadow-radius: 5px;
   shadow-color: ${props => (props.isHovering ? '#aaa' : '#ccc')};
   shadow-offset: 0px 0px;
   position: relative;
`

const Label = styled.Text`
   background: #fff;
   border-radius: 2px;
   padding: 2px;
   text-transform: uppercase;
   font-size: 10px;
   position: absolute;
   z-index: 1;
   color: #686b78;
   top: 136px;
   left: 8px;
`

const ProductImage = styled.Image`
   height: 160px;
   resize-mode: ${props => props.size};
`

const CardBody = styled.View`
   padding: 12px 8px;
`

const CardBodyUpper = styled.TouchableOpacity`
   min-height: 60px;
`

const CardBodyLower = styled.View``

const ProductName = styled.Text`
   color: #0c102a;
   font-weight: bold;
   text-transform: uppercase;
`

const AdditionalText = styled.Text`
   color: #686b78;
`

const SpaceApart = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const ProductInfoText = styled.Text``

const PriceWrapper = styled.View`
   flex-direction: row;
   align-items: center;
`

const OriginalPrice = styled.Text`
   font-size: 12px;
   color: #686b78;
   text-decoration: line-through;
   margin-right: 2px;
`

const Price = styled.Text`
   font-weight: bold;
`

const AddToCart = styled.TouchableOpacity`
   border-radius: 4px;
   padding: 4px;
   background: ${props => props.color};
`

const AddToCartText = styled.Text`
   color: #ffffff;
   font-size: 14px;
   text-transform: uppercase;
`
