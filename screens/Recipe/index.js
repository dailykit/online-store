import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { Spinner } from 'native-base'
import React from 'react'
import { Image, Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import CheckoutBar from '../../components/CheckoutBar'
import { Drawer } from '../../components/Drawer'
import Header from '../../components/Header'
import Nutrition from '../../components/Nutrition'
import Recommendations from '../../components/Recommendations'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import {
   COMBO_PRODUCT,
   CUSTOMIZABLE_PRODUCT,
   SIMPLE_PRODUCT,
   SIMPLE_RECIPE,
} from '../../graphql'
import { height, width } from '../../utils/Scalaing'
import styled from 'styled-components/native'

import PhotoShowcase from './PhotoShowcase'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import AddToCart from '../AddToCart'
import RecipeSkeleton from '../../components/skeletons/recipe'

const Recipe = ({ route, navigation }) => {
   let { recipeId, refId, refType } = route.params

   const { visual, masterLoading } = useAppContext()

   const [fetching, setFetching] = React.useState(false)
   const ingredientsRef = React.useRef()
   const nutritionRef = React.useRef()
   const cookingStepsRef = React.useRef()

   // For Drawer
   const [isModalVisible, setIsModalVisible] = React.useState(false)
   const [refProduct, setRefProduct] = React.useState({})

   const { data: { simpleRecipe = {} } = {}, loading, error } = useQuery(
      SIMPLE_RECIPE,
      {
         variables: {
            id: recipeId,
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.simpleRecipeProduct)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchCustomizableProduct] = useLazyQuery(CUSTOMIZABLE_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.customizableProduct)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchComboProduct] = useLazyQuery(COMBO_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.comboProduct)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const buy = () => {
      if (Object.keys(refProduct).length) {
         setIsModalVisible(true)
      }
   }

   const renderPricing = () => {
      switch (refType) {
         case 'simpleRecipeProduct':
            return (
               <AddToCart
                  showInfo={false}
                  setIsModalVisible={true}
                  navigation={navigation}
                  id={refProduct.id}
                  type={refProduct?.__typename?.split('_')[1]}
                  data={refProduct}
               />
            )
         case 'customizableProduct':
            return (
               <BuyBtn color={visual.color} onPress={buy}>
                  <BuyBtnText>Buy Now</BuyBtnText>
               </BuyBtn>
            )
         case 'comboProduct':
            return (
               <BuyBtn color={visual.color} onPress={buy}>
                  <BuyBtnText>Buy Now</BuyBtnText>
               </BuyBtn>
            )
         default:
            return <ContentText>No matching product found!</ContentText>
      }
   }

   React.useEffect(() => {
      switch (refType) {
         case 'simpleRecipeProduct':
            return fetchSimpleRecipeProduct({ variables: { id: refId } })
         case 'customizableProduct':
            return fetchCustomizableProduct({ variables: { id: refId } })
         case 'comboProduct':
            return fetchComboProduct({ variables: { id: refId } })
         default:
            return console.log('No type matched for fetching!')
      }
   }, [refType, refId])

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (loading) {
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <RecipeSkeleton />
         </>
      )
   }

   console.log(simpleRecipe)

   return (
      <>
         <Drawer
            isVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            navigation={navigation}
            data={refProduct}
            type={refType}
            id={refId}
            showInfo={true}
         />
         <Header title="Home" navigation={navigation} />
         <Wrapper>
            <DetailsContainer
               showsVerticalScrollIndicator={false}
               stickyHeaderIndices={[6]}
            >
               <PhotoShowcase images={[simpleRecipe.image] || []} />
               <Spacer size="32px" />
               <Type type={simpleRecipe.type}>{simpleRecipe.type}</Type>
               <Spacer size="16px" />
               <Flex>
                  <Info>
                     <MaterialCommunityIcons
                        name="food"
                        color="#888d9d"
                        style={{ marginRight: 8 }}
                        size={16}
                     />
                     <ContentText>{simpleRecipe.cuisine}</ContentText>
                  </Info>
                  <Info>
                     <MaterialCommunityIcons
                        name="timelapse"
                        color="#888d9d"
                        style={{ marginRight: 8 }}
                        size={16}
                     />
                     <ContentText>{simpleRecipe.cookingTime} mins.</ContentText>
                  </Info>
                  <Info>
                     <MaterialCommunityIcons
                        name="chef-hat"
                        color="#888d9d"
                        style={{ marginRight: 8 }}
                        size={16}
                     />
                     <ContentText>{simpleRecipe.author}</ContentText>
                  </Info>
               </Flex>
               <Spacer size="20px" />
               <ContentText>{simpleRecipe.description}</ContentText>
               <Spacer size="20px" />
               {Boolean(simpleRecipe.utensils.length) && (
                  <ContentText>
                     Utensils required: {simpleRecipe.utensils.join(', ')}
                  </ContentText>
               )}
               <Spacer size="32px" />
               <Tabs horizontal showsHorizontalScrollIndicator={false}>
                  <Tab
                     active
                     color={visual.color}
                     onPress={() =>
                        ingredientsRef.current.scrollIntoView({
                           behavior: 'smooth',
                        })
                     }
                  >
                     <TabText active color={visual.color}>
                        Ingredients
                     </TabText>
                  </Tab>
                  <Tab
                     color={visual.color}
                     onPress={() =>
                        nutritionRef.current.scrollIntoView({
                           behavior: 'smooth',
                        })
                     }
                  >
                     <TabText color={visual.color}>Nutritional Values</TabText>
                  </Tab>
                  <Tab
                     color={visual.color}
                     onPress={() => {
                        // scrollTo(0, 500)
                        cookingStepsRef.current?.scrollTo(0, 500)
                     }}
                  >
                     <TabText color={visual.color}>Cooking Steps</TabText>
                  </Tab>
               </Tabs>
               <Spacer size="28px" />
               <SectionHeader color={visual.color} ref={ingredientsRef}>
                  {
                     simpleRecipe.simpleRecipeYields[0].ingredientSachets.filter(
                        ing => ing.isVisible
                     ).length
                  }{' '}
                  Ingredients
               </SectionHeader>
               <Spacer size="20px" />
               {simpleRecipe.simpleRecipeYields[0].ingredientSachets
                  .filter(ing => ing.isVisible)
                  .map((ing, i) => (
                     <>
                        <ContentText key={ing.id}>{`${i + 1}. ${
                           ing.ingredientSachet.quantity
                        } ${ing.ingredientSachet.unit} ${
                           ing.slipName
                        }`}</ContentText>
                        <Spacer size="20px" />
                     </>
                  ))}
               <Spacer size="68px" />
               {Boolean(simpleRecipe.simpleRecipeYields[0].nutritionalInfo) && (
                  <>
                     <SectionHeader color={visual.color} ref={nutritionRef}>
                        Nutritional Values
                     </SectionHeader>
                     <Spacer size="20px" />
                     <Nutrition
                        values={
                           simpleRecipe.simpleRecipeYields[0].nutritionalInfo
                        }
                     />
                     <Spacer size="68px" />
                  </>
               )}
               <SectionHeader
                  color={visual.color}
                  nativeID="cookingSteps"
                  ref={cookingStepsRef}
               >
                  Cooking Steps
               </SectionHeader>
               <Spacer size="40px" />
               {simpleRecipe.procedures.map((procedure, k) => (
                  <>
                     <ProcedureText>{procedure.title}</ProcedureText>
                     <Spacer size="28px" />
                     {procedure.steps
                        .filter(step => step.isVisible)
                        .map((step, i) => (
                           <>
                              <DescriptionWrapper>
                                 <StepIndicator>
                                    <StepIndicatorText>
                                       {i + 1}
                                    </StepIndicatorText>
                                 </StepIndicator>
                                 <StepDescText>
                                    <StepText>
                                       {step.title ? step.title + ': ' : ''}
                                    </StepText>
                                    {step.description}
                                 </StepDescText>
                                 <StepImageWrapper>
                                    {Boolean(step.assets?.images?.length) && (
                                       <StepImage
                                          source={{
                                             uri: step.assets.images[0].url,
                                          }}
                                       />
                                    )}
                                 </StepImageWrapper>
                              </DescriptionWrapper>
                              <Spacer size="20px" />
                           </>
                        ))}
                     <Spacer size="40px" />
                  </>
               ))}
            </DetailsContainer>
            <PricingContainer>
               {fetching ? (
                  <ContentText>Loading...</ContentText>
               ) : (
                  <>
                     <Title>{refProduct.name}</Title>
                     <Spacer size="16px" />
                     {renderPricing()}
                  </>
               )}
            </PricingContainer>
         </Wrapper>
         {width < 768 && <CheckoutBar navigation={navigation} />}
      </>
   )
}

export default Recipe

const Wrapper = styled.View`
   flex: 1;
   flex-direction: row;
   padding: 16px 48px;
   background: rgb(233, 236, 238);
`

const Flex = styled.View`
   flex-direction: row;
   align-items: center;
   flex-wrap: wrap;
`

const Spacer = styled.View`
   height: ${props => props.size || '16px'};
`

const DetailsContainer = styled.ScrollView`
   margin-right: 24px;
   padding: 0 20px;
   background: #fff;
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

const SectionHeader = styled.Text`
   color: ${props => props.color || '#888d9d'};
   font-size: 28px;
   font-weight: 600;
`

const ContentText = styled.Text`
   line-height: 23px;
   font-size: 18px;
   color: #636363;
`

const ProcedureText = styled(ContentText)`
   font-size: 20px;
   font-weight: 600;
   color: #000;
   text-transform: uppercase;
`

const StepIndicator = styled.View`
   width: 40px;
   height: 40px;
   border-radius: 20px;
   align-items: center;
   justify-content: center;
   background: #eae8e8;
`

const StepIndicatorText = styled.Text`
   color: #636363;
   font-size: 18px;
   font-weight: bold;
`

const StepText = styled(ContentText)`
   font-weight: bold;
   font-size: 18px;
   color: #000;
`

const StepDescText = styled(ContentText)`
   font-size: 18px;
   margin-left: 16px;
   line-height: 23px;
`

const DescriptionWrapper = styled.View`
   flex-direction: row;
`

const StepImageWrapper = styled.View`
   margin-left: 16px;
   width: 400px;
`

const StepImage = styled.Image`
   width: 350px;
   height: 200px;
   border-radius: 4px;
`

const PricingContainer = styled.View`
   background: #fff;
   min-width: 31vw;
   padding: 20px;
`

const Title = styled(ContentText)`
   font-size: 28px;
   line-height: 40px;
   font-weight: bold;
`

const getColorForType = type => {
   switch (type) {
      case 'Vegetarian':
         return '#4FECAA'
      case 'Vegan':
         return '#4FECD0'
      case 'Non-Vegetarian':
         return ''
      default:
         return '#FF5A52'
   }
}

const Type = styled.Text`
   background: ${props => getColorForType(props.type)}
   padding: 4px 8px;
   color: #fff;
   font-size: 16px;
   width: fit-content;
   border-radius: 2px;
`

const Info = styled.View`
   flex-direction: row;
   align-items: center;
   margin-right: 32px;
`

const BuyBtn = styled.TouchableOpacity`
   margin-top: 32px;
   background: ${props => props.color || '#888d98'};
   text-align: center;
   padding: 16px;
`

const BuyBtnText = styled.Text`
   color: #fff;
`
