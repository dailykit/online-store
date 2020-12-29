import React from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import styled, { css } from 'styled-components/native'
import { Header } from '../../components'
import { Drawer } from '../../components/Drawer'
import Nutrition from '../../components/Nutrition'
import PhotoShowcase from '../../components/PhotoShowcase'
import AppSkeleton from '../../components/skeletons/app'
import RecipeSkeleton from '../../components/skeletons/recipe'
import SocialMediaShareButtons from '../../components/SocialMediaShareButtons'
import { useAppContext } from '../../context/app'
import {
   COMBO_PRODUCT,
   CUSTOMIZABLE_PRODUCT,
   INVENTORY_PRODUCT,
} from '../../graphql'
import { width } from '../../utils/Scaling'
import AddToCart from '../AddToCart'
import Recommendations from '../../components/Recommendations'
import {
   resolveComboProductPrices,
   resolveCustomizableProductPrices,
} from '../../utils/products'
import { Helmet } from 'react-helmet'

const ProductPage = ({ navigation, route }) => {
   const { id, type } = route.params

   const { visual, masterLoading } = useAppContext()

   const [product, setProduct] = React.useState({})
   const [scrollHeight, setScrollHeight] = React.useState(0)
   const [activeTab, setActiveTab] = React.useState('description')
   const nutritionPosition = React.useRef(undefined)
   const containerRef = React.useRef()
   const [isModalVisible, setIsModalVisible] = React.useState(false)

   React.useEffect(() => {
      if (
         scrollHeight < nutritionPosition.current ||
         nutritionPosition.current === undefined
      ) {
         return setActiveTab('description')
      }
      if (scrollHeight >= nutritionPosition.current) {
         return setActiveTab('nutrition')
      }
      return setActiveTab('description')
   }, [scrollHeight])

   const [fetchInventoryProduct, { loading: IPLoading }] = useLazyQuery(
      INVENTORY_PRODUCT,
      {
         onCompleted: data => {
            setProduct(data.inventoryProduct)
         },
         fetchPolicy: 'cache-and-network',
      }
   )
   const [fetchCustomizableProduct, { loading: CUSLoading }] = useLazyQuery(
      CUSTOMIZABLE_PRODUCT,
      {
         onCompleted: data => {
            setProduct(
               resolveCustomizableProductPrices([data.customizableProduct])[0]
            )
         },
         fetchPolicy: 'cache-and-network',
      }
   )
   const [fetchComboProduct, { loading: COMLoading }] = useLazyQuery(
      COMBO_PRODUCT,
      {
         onCompleted: data => {
            setProduct(resolveComboProductPrices([data.comboProduct])[0])
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
         case 'customizableProduct': {
            return fetchCustomizableProduct({
               variables: {
                  id,
               },
            })
         }
         case 'comboProduct': {
            return fetchComboProduct({
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

   if (IPLoading || COMLoading || CUSLoading)
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
         <Helmet>
            <title>{`${product.name} | ${visual.appTitle}`}</title>
            <meta name="description" content={product.description || ''} />
            <meta
               name="keywords"
               content={product.tags?.length ? product.tags.join(',') : ''}
            />
            <script type="application/ld+json">
               {JSON.stringify(product.richResult)}
            </script>
         </Helmet>
         <Header title="Home" navigation={navigation} />
         <Wrapper>
            <DetailsContainer
               showsVerticalScrollIndicator={false}
               stickyHeaderIndices={[4]}
               ref={containerRef}
               onScroll={e => setScrollHeight(e.nativeEvent.contentOffset.y)}
            >
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
               <Tabs
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ marginHorizontal: 'auto' }}
               >
                  {Boolean(product.description) && (
                     <Tab
                        active={activeTab === 'description'}
                        color={visual.color}
                        onPress={() =>
                           containerRef.current.scrollTo({
                              y: 0,
                           })
                        }
                     >
                        <TabText
                           active={activeTab === 'description'}
                           color={visual.color}
                        >
                           Description
                        </TabText>
                     </Tab>
                  )}
                  {Boolean(
                     product.nutritionalInfo || product.allergens?.length
                  ) && (
                     <Tab
                        active={activeTab === 'nutrition'}
                        color={visual.color}
                        onPress={() =>
                           containerRef.current.scrollTo({
                              y: nutritionPosition.current,
                           })
                        }
                     >
                        <TabText
                           active={activeTab === 'nutrition'}
                           color={visual.color}
                        >
                           Nutrition and Allergens
                        </TabText>
                     </Tab>
                  )}
               </Tabs>
               {Boolean(product.description) && (
                  <>
                     <Spacer size="28px" />
                     <ContentText style={{ textAlign: 'center' }}>
                        {product.description}
                     </ContentText>
                  </>
               )}
               <Spacer size="68px" />
               {Boolean(
                  product.allergens?.length || product.nutritionalInfo
               ) && (
                  <>
                     <SectionHeader
                        color={visual.color}
                        onLayout={e => {
                           nutritionPosition.current =
                              e.nativeEvent.layout.y - 60
                        }}
                     >
                        Nutrition and Allergens
                     </SectionHeader>
                     {Boolean(product.nutritionalInfo) && (
                        <>
                           <Spacer size="20px" />
                           <NutritionWrapper>
                              <Nutrition values={product.nutritionalInfo} />
                           </NutritionWrapper>
                           <Spacer size="20px" />
                        </>
                     )}
                     {Boolean(product.allergens?.length) && (
                        <>
                           <Spacer size="20px" />
                           <AllergensText style={{ textAlign: 'center' }}>
                              Allergens:{' '}
                              {product.allergens
                                 .map(allergen => allergen.title)
                                 .join(', ')}
                           </AllergensText>
                        </>
                     )}
                     <Spacer size="20px" />
                  </>
               )}
               {Boolean(product.recommendations) && (
                  <>
                     <Spacer size="80px" />
                     <Recommendations
                        navigation={navigation}
                        recommendations={product.recommendations}
                     />
                     <Spacer size="68px" />
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
   color: #000;
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

const AllergensText = styled(ContentText)`
   font-size: 20px;
   font-weight: 600;
`

const Tabs = styled.ScrollView`
   background: #fff;
   border-bottom-width: 1px;
   border-bottom-color: #cecece;
`

const Tab = styled.TouchableOpacity`
   margin-right: 48px;
   padding: 16px 0;
   border-bottom-width: 3px;
   border-bottom-color: ${props => (props.active ? props.color : '#fff')};
`

const TabText = styled.Text`
   line-height: 24px;
   font-size: 16px;
   color: ${props => (props.active ? props.color : '#888D9D')};
   font-weight: 600;
`
