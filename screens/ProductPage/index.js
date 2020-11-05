import { useLazyQuery } from '@apollo/react-hooks'
import { Content, Spinner } from 'native-base'
import React from 'react'
import {
   Image,
   SafeAreaView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import defaultProductImage from '../../assets/imgs/default-product-image.png'
import { Header } from '../../components'
import CheckoutBar from '../../components/CheckoutBar'
import { Drawer } from '../../components/Drawer'
import HeaderBack from '../../components/HeaderBack'
import Nutrition from '../../components/Nutrition'
import Recommendations from '../../components/Recommendations'
import AppSkeleton from '../../components/skeletons/app'
import RecipeSkeleton from '../../components/skeletons/recipe'
import { useAppContext } from '../../context/app'
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../../graphql'
import { width } from '../../utils/Scaling'
import AddToCart from '../AddToCart'
import SocialMediaShareButtons from '../../components/SocialMediaShareButtons'
import PhotoShowcase from '../../components/PhotoShowcase'

import styled, { css } from 'styled-components/native'

const ProductPage = ({ navigation, route }) => {
   const { id, type } = route.params

   const { visual, masterLoading } = useAppContext()

   const [product, setProduct] = React.useState({})
   const [isModalVisible, setIsModalVisible] = React.useState(false)

   const [fetchInventoryProduct, { loading: IPLoading }] = useLazyQuery(
      INVENTORY_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.inventoryProduct)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const [fetchSimpleRecipeProduct, { loading: SRPLoading }] = useLazyQuery(
      SIMPLE_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.simpleRecipeProduct)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   React.useEffect(() => {
      switch (type) {
         case 'inventoryProduct': {
            return fetchInventoryProduct({
               variables: {
                  id,
               },
            })
         }
         case 'simpleRecipeProduct': {
            return fetchSimpleRecipeProduct({
               variables: {
                  id,
               },
            })
         }
         default: {
            return console.log('Invalid type')
         }
      }
   }, [id, type])

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (IPLoading || SRPLoading)
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <RecipeSkeleton />
         </>
      )

   return (
      <>
         <Drawer
            isVisible={isModalVisible}
            navigation={navigation}
            data={product}
            type={product?.__typename?.split('_')[1]}
            id={product?.id}
            setIsModalVisible={setIsModalVisible}
            showInfo={true}
         />
         <Header title="Home" navigation={navigation} />
         <Wrapper>
            <DetailsContainer showsVerticalScrollIndicator={false}>
               {Boolean(width <= 768) && (
                  <>
                     <Title>{product.name}</Title>
                     <Spacer size="16px" />
                     <TagsContainer>
                        {product?.tags?.map((tag, i) => (
                           <Tag key={i}>{tag}</Tag>
                        ))}
                     </TagsContainer>
                     <SocialMediaShareButtons />
                  </>
               )}
               <Spacer size="20px" />
               <PhotoShowcase images={product.assets?.images} />
               <Spacer size="40px" />
               <ContentText style={{ textAlign: 'center' }}>
                  {product.description}
               </ContentText>
               <Spacer size="68px" />
               {Boolean(
                  product.allergens?.length || product.nutritionalInfo
               ) && (
                  <>
                     <SectionHeader color={visual.color}>
                        Nutrition and Allergens
                     </SectionHeader>
                     {Boolean(product.allergens?.length) && (
                        <>
                           <Spacer size="20px" />
                           <ContentText style={{ textAlign: 'center' }}>
                              Allergens:{' '}
                              {product.allergens
                                 .map(allergen => allergen.title)
                                 .join(', ')}
                           </ContentText>
                        </>
                     )}
                     {Boolean(product.nutritionalInfo) && (
                        <>
                           <Spacer size="20px" />
                           <NutritionWrapper>
                              <Nutrition values={product.nutritionalInfo} />
                           </NutritionWrapper>
                        </>
                     )}
                     <Spacer size="100px" />
                  </>
               )}
            </DetailsContainer>
            {Boolean(width > 768) && (
               <PricingContainer>
                  <Title>{product.name}</Title>
                  <Spacer size="16px" />
                  <TagsContainer>
                     {product?.tags?.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                     ))}
                  </TagsContainer>
                  <SocialMediaShareButtons />
                  <AddToCart
                     showInfo={false}
                     setIsModalVisible={true}
                     navigation={navigation}
                     id={product.id}
                     type={product?.__typename?.split('_')[1]}
                     data={product}
                  />
               </PricingContainer>
            )}
         </Wrapper>
         {Boolean(width <= 768) && (
            <BuyBtn
               color={visual.color}
               onPress={() => setIsModalVisible(true)}
            >
               <BuyBtnText>Buy Now</BuyBtnText>
            </BuyBtn>
         )}
      </>
   )
}

export default ProductPage

const Wrapper = styled.View`
   flex: 1;
   flex-direction: row;
   padding: 16px 48px;
   background: #fefdfc;
   ${width <= 768 &&
   css`
      padding: 8px 12px;
   `}
`

const Spacer = styled.View`
   height: ${props => props.size || '16px'};
`

const DetailsContainer = styled.ScrollView`
   margin-right: 24px;
   padding: 0 20px;
   ${width <= 768 &&
   css`
      margin-right: 0;
      padding: 0;
   `}
`

const PricingContainer = styled.View`
   background: #fff;
   min-width: 31vw;
   padding: 20px;
   shadow-opacity: 1;
   shadow-radius: 2px;
   shadow-color: #f8f8f7;
   shadow-offset: -5px -5px;
   border-radius: 4px;
`

const ContentText = styled.Text`
   line-height: 23px;
   font-size: 18px;
   color: #636363;
   ${width <= 768 &&
   css`
      line-height: 21px;
      font-size: 16px;
   `}
`

const Title = styled(ContentText)`
   font-size: 28px;
   line-height: 40px;
   font-weight: bold;
`

const SectionHeader = styled.Text`
   color: ${props => props.color || '#888d9d'};
   font-size: 28px;
   font-weight: 600;
   text-align: center;
`

const TagsContainer = styled.View`
      flex-direction: row;
      flex-wrap: wrap;
      align-items center;
      margin-bottom: 16px;
`

const Tag = styled(ContentText)`
   font-size: 14px;
   padding: 4px 8px;
   border-radius: 4px;
   background: #eae8e8;
   margin-right: 8px;
`

const NutritionWrapper = styled.View`
   flex-direction: row;
   justify-content: center;
`

const BuyBtn = styled.TouchableOpacity`
   margin-top: 32px;
   background: ${props => props.color || '#888d98'};
   text-align: center;
   padding: 16px;
   ${width <= 768 &&
   css`
      margin-top: 0px;
   `}
`

const BuyBtnText = styled.Text`
   color: #fff;
`
