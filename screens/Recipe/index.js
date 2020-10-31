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

import CookingTime from '../../assets/svgs/CookingTime'
import Cuisine from '../../assets/svgs/Cuisine'
import Chef from '../../assets/svgs/Chef'
import Utensils from '../../assets/svgs/Utensils'

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

   const renderCookingSteps = () => {
      return (
         <>
            {simpleRecipe.procedures.map((procedure, k) => (
               <>
                  <ProcedureText>{procedure.title}</ProcedureText>
                  <Spacer size="28px" />
                  <StepsWrapper>
                     {procedure.steps
                        .filter(step => step.isVisible)
                        .map((step, i) => (
                           <StepCard key={i}>
                              <StepIndicator>
                                 <StepIndicatorText>{i + 1}</StepIndicatorText>
                              </StepIndicator>
                              <StepDescText>
                                 <StepText>
                                    {step.title ? step.title + ': ' : ''}
                                 </StepText>
                                 {step.description}
                              </StepDescText>
                              {Boolean(step.assets.images.length) && (
                                 <StepImage
                                    source={{ uri: step.assets.images[0].url }}
                                 />
                              )}
                           </StepCard>
                        ))}
                  </StepsWrapper>
                  <Spacer size="40px" />
               </>
            ))}
         </>
      )
   }

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
               stickyHeaderIndices={[0]}
            >
               <Tabs
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ marginHorizontal: 'auto' }}
               >
                  <Tab
                     active
                     color={visual.color}
                     // onPress={() =>
                     //    ingredientsRef.current.scrollIntoView({
                     //       behavior: 'smooth',
                     //    })
                     // }
                  >
                     <TabText active color={visual.color}>
                        Description
                     </TabText>
                  </Tab>
                  <Tab
                     color={visual.color}
                     // onPress={() =>
                     //    ingredientsRef.current.scrollIntoView({
                     //       behavior: 'smooth',
                     //    })
                     // }
                  >
                     <TabText color={visual.color}>Ingredients</TabText>
                  </Tab>
                  <Tab
                     color={visual.color}
                     // onPress={() => {
                     //    cookingStepsRef.current?.scrollTo(0, 500)
                     // }}
                  >
                     <TabText color={visual.color}>Cooking Steps</TabText>
                  </Tab>
                  <Tab
                     color={visual.color}
                     // onPress={() =>
                     //    nutritionRef.current.scrollIntoView({
                     //       behavior: 'smooth',
                     //    })
                     // }
                  >
                     <TabText color={visual.color}>Nutritional Values</TabText>
                  </Tab>
               </Tabs>
               <Spacer size="28px" />
               <PhotoShowcase images={[simpleRecipe.image] || []} />
               <Spacer size="32px" />
               {/* <TypeWrapper type={simpleRecipe.type}>
                  <TypeText type={simpleRecipe.type}>
                     {simpleRecipe.type}
                  </TypeText>
               </TypeWrapper> */}
               <Spacer size="24px" />
               <Flex>
                  <Info>
                     <Cuisine color={visual.color} />
                     <InfoText>{simpleRecipe.cuisine}</InfoText>
                  </Info>
                  <Info>
                     <CookingTime color={visual.color} />
                     <InfoText>{simpleRecipe.cookingTime} mins.</InfoText>
                  </Info>
                  <Info>
                     <Chef color={visual.color} />
                     <InfoText>{simpleRecipe.author}</InfoText>
                  </Info>
                  <Info>
                     <Utensils color={visual.color} />
                     <InfoText>{simpleRecipe.utensils.join(', ')}</InfoText>
                  </Info>
               </Flex>
               <Spacer size="24px" />
               <ContentText style={{ textAlign: 'center' }}>
                  {simpleRecipe.description}
               </ContentText>
               <Spacer size="68px" />
               <SectionHeader color={visual.color} ref={ingredientsRef}>
                  {
                     simpleRecipe.simpleRecipeYields[0].ingredientSachets.filter(
                        ing => ing.isVisible
                     ).length
                  }{' '}
                  Ingredients
               </SectionHeader>
               <Spacer size="20px" />
               <Ingredients>
                  {simpleRecipe.simpleRecipeYields[0].ingredientSachets
                     .filter(ing => ing.isVisible)
                     .map((ing, i) => (
                        <IngredientWrapper>
                           <ContentText
                              key={ing.id}
                           >{`${ing.ingredientSachet.quantity} ${ing.ingredientSachet.unit} ${ing.slipName}`}</ContentText>
                           {Boolean(ing.ingredientSachet.ingredient.image) && (
                              <IngredientImage
                                 source={{
                                    uri: ing.ingredientSachet.ingredient.image,
                                 }}
                              />
                           )}
                        </IngredientWrapper>
                     ))}
               </Ingredients>
               <Spacer size="68px" />
               <SectionHeader
                  color={visual.color}
                  nativeID="cookingSteps"
                  ref={cookingStepsRef}
               >
                  Cooking Steps
               </SectionHeader>
               <Spacer size="40px" />
               {renderCookingSteps()}
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
                  </>
               )}
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
   background: #fefdfc;
`

const Flex = styled.View`
   flex-direction: row;
   align-items: start;
   justify-content: space-evenly;
   flex-wrap: wrap;
`

const Spacer = styled.View`
   height: ${props => props.size || '16px'};
`

const DetailsContainer = styled.ScrollView`
   margin-right: 24px;
   padding: 0 20px;
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
   text-align: center;
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
   text-align: center;
`

const StepsWrapper = styled.View`
   flex-direction: row;
   flex-wrap: wrap;
   margin: 0 auto;
`

const StepCard = styled.View`
   border: 1px solid #eae8e8;
   border-radius: 4px;
   padding: 16px;
   width: 400px;
   margin: 20px 10px;
   background: #fff;
   position: relative;
`

const StepIndicator = styled.View`
   width: 40px;
   height: 40px;
   border-radius: 20px;
   align-items: center;
   justify-content: center;
   background: #eae8e8;
   position: absolute;
   top: -20px;
   left: -10px;
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
   line-height: 23px;
`

const StepImage = styled.Image`
   width: 368px;
   height: 200px;
   border-radius: 4px;
   margin-top: 16px;
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

const Title = styled(ContentText)`
   font-size: 28px;
   line-height: 40px;
   font-weight: bold;
`

const TypeWrapper = styled.Text`
   border: 2px solid
      ${props => (props.type === 'Non-vegetarian' ? '#FF5A52' : '#53C22B')};
   border-radius: 32px;
   align-items: center;
   justify-content: center;
   padding: 4px 12px;
   width: fit-content;
`

const TypeText = styled.Text`
   color: ${props => (props.type === 'Non-vegetarian' ? '#FF5A52' : '#53C22B')};
   font-weight: bold;
   text-transform: uppercase;
`

const Info = styled.View`
   align-items: center;
`

const InfoText = styled(ContentText)`
   font-size: 20px;
   color: #000;
   max-width: 200px;
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

const IngredientWrapper = styled.View`
   background: #fff;
   border-radius: 7px;
   padding: 16px;
   border: 1px solid #eae8e8;
   flex-direction: row;
   align-items: center;
   width: 295px;
   justify-content: space-between;
   margin-right: 20px;
   margin-bottom: 20px;
`

const IngredientImage = styled.Image`
   width: 56px;
   height: 56px;
   border-radius: 28px;
   margin-left: 16px;
`

const Ingredients = styled.View`
   flex-direction: row;
   flex-wrap: wrap;
   justify-content: center;
`
