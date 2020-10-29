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
         <View>
            <Spinner size="large" />
         </View>
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
               stickyHeaderIndices={[4]}
            >
               <PhotoShowcase images={[simpleRecipe.image] || []} />
               <Spacer size="32px" />
               <ContentText>{simpleRecipe.description}</ContentText>
               <Spacer size="40px" />
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
                        console.log(cookingStepsRef)
                        cookingStepsRef.current.scrollIntoView(
                           scrollIntoView({ behavior: 'smooth' })
                        )
                     }}
                  >
                     <TabText color={visual.color}>Cooking Steps</TabText>
                  </Tab>
               </Tabs>
               <Spacer size="28px" />
               <SectionHeader ref={ingredientsRef}>
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
               <Spacer size="28px" />
               {Boolean(simpleRecipe.simpleRecipeYields[0].nutritionalInfo) && (
                  <>
                     <SectionHeader ref={nutritionRef}>
                        Nutritional Values
                     </SectionHeader>
                     <Spacer size="20px" />
                     <Nutrition
                        values={
                           simpleRecipe.simpleRecipeYields[0].nutritionalInfo
                        }
                     />
                     <Spacer size="28px" />
                  </>
               )}
               <SectionHeader ref={cookingStepsRef}>
                  Cooking Steps
               </SectionHeader>
               <Spacer size="20px" />
               {simpleRecipe.procedures.map((procedure, k) => (
                  <>
                     <ProcedureText>
                        {k + 1}. {procedure.title}
                     </ProcedureText>
                     <Spacer size="16px" />
                     {procedure.steps
                        .filter(step => step.isVisible)
                        .map((step, i) => (
                           <>
                              <ProcedureContent>
                                 <StepText>
                                    {k + 1}.{i + 1} {step.title}
                                 </StepText>
                                 <Spacer size="8px" />
                                 {Boolean(step.assets?.images?.length) && (
                                    <>
                                       <StepImage
                                          source={{
                                             uri: step.assets.images[0].url,
                                          }}
                                          width="300px"
                                       />
                                       <Spacer size="8px" />
                                    </>
                                 )}
                                 <ContentText>{step.description}</ContentText>
                              </ProcedureContent>
                              <Spacer size="16px" />
                           </>
                        ))}
                     <Spacer size="28px" />
                  </>
               ))}
            </DetailsContainer>
            <PricingContainer>
               <Title>{simpleRecipe.name}</Title>
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
               <Spacer size="16px" />
               {Object.keys(refProduct).length ? (
                  renderPricing()
               ) : (
                  <ContentText>Loading...</ContentText>
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
   padding: 16px 32px;
   background: #fff;
`

const Flex = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   flex-wrap: wrap;
`

const Spacer = styled.View`
   height: ${props => props.size || '16px'};
`

const DetailsContainer = styled.ScrollView`
   margin-right: 24px;
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
   color: #888d9d;
   font-size: 24px;
   font-weight: 600;
`

const ContentText = styled.Text`
   line-height: 20px;
   font-size: 16px;
   color: #555b6e;
`

const ProcedureText = styled(ContentText)`
   font-size: 20px;
   font-weight: 600;
`

const ProcedureContent = styled.View`
   padding-left: 16px;
`

const StepText = styled(ContentText)`
   font-weight: 600;
`

const StepImage = styled.Image`
   width: 300px;
   height: 200px;
`

const PricingContainer = styled.View`
   min-width: 400px;
   padding: 0 16px;
`

const Title = styled(ContentText)`
   font-size: 28px;
   line-height: 40px;
   font-weight: bold;
`

const Type = styled.Text`
   background: ${props =>
      props.type === 'Non-vegetarian' ? '#FF5A52' : '#53C22B'}
   padding: 2px;
   color: #fff;
   font-size: 14px;
   width: fit-content;
`

const Info = styled.View`
   flex-direction: row;
   align-items: center;
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
