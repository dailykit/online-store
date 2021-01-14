import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Helmet } from 'react-helmet'
import { View } from 'react-native'
import styled, { css } from 'styled-components/native'
import Chef from '../../assets/svgs/Chef'
import CookingTime from '../../assets/svgs/CookingTime'
import Cuisine from '../../assets/svgs/Cuisine'
import Utensils from '../../assets/svgs/Utensils'
import { Drawer } from '../../components/Drawer'
import Header from '../../components/Header'
import Nutrition from '../../components/Nutrition'
import PhotoShowcase from '../../components/PhotoShowcase'
import Recommendations from '../../components/Recommendations'
import AppSkeleton from '../../components/skeletons/app'
import RecipeSkeleton from '../../components/skeletons/recipe'
import SocialMediaShareButtons from '../../components/SocialMediaShareButtons'
import { useAppContext } from '../../context/app'
import { GET_STORE_PRODUCT, SIMPLE_RECIPE } from '../../graphql'
import { width } from '../../utils/Scaling'
import AddToCart from '../AddToCart'

const Recipe = ({ navigation, route }) => {
   const { recipeId, refId, refType } = route.params

   const { visual, masterLoading } = useAppContext()

   const [simpleRecipe, setSimpleRecipe] = React.useState(undefined)
   const [scrollHeight, setScrollHeight] = React.useState(0)
   const [activeTab, setActiveTab] = React.useState('description')
   const nutritionPosition = React.useRef(undefined)
   const ingredientsPosition = React.useRef(undefined)
   const cookingStepsPosition = React.useRef(undefined)
   const containerRef = React.useRef()

   React.useEffect(() => {
      if (scrollHeight >= nutritionPosition.current) {
         return setActiveTab('nutrition')
      }
      if (
         scrollHeight < ingredientsPosition.current ||
         ingredientsPosition.current === undefined
      ) {
         return setActiveTab('description')
      }
      if (
         scrollHeight >= ingredientsPosition.current &&
         (scrollHeight < cookingStepsPosition.current ||
            cookingStepsPosition.current === undefined)
      ) {
         return setActiveTab('ingredients')
      }
      if (
         scrollHeight >= cookingStepsPosition.current &&
         (nutritionPosition.current === undefined ||
            scrollHeight < nutritionPosition.current)
      ) {
         return setActiveTab('cookingSteps')
      }

      return setActiveTab('description')
   }, [scrollHeight])

   // For Drawer
   const [isModalVisible, setIsModalVisible] = React.useState(false)
   const [refProduct, setRefProduct] = React.useState({})

   const { loading, error } = useQuery(SIMPLE_RECIPE, {
      variables: {
         id: recipeId,
      },
      onCompleted: data => {
         if (data.simpleRecipe) {
            setSimpleRecipe(data.simpleRecipe)
         }
      },
      fetchPolicy: 'cache-and-network',
   })

   const { loading: productLoading } = useQuery(GET_STORE_PRODUCT, {
      variables: {
         id: refId,
         type: refType,
      },
      onCompleted: data => {
         const [
            { id, data: fetchedProduct },
         ] = data.onDemand_getOnlineStoreProduct
         setRefProduct(fetchedProduct)
      },
      onError: error => {
         console.log(error)
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

   const renderCookingSteps = () => {
      return (
         <>
            {simpleRecipe.procedures.map((procedure, k) => (
               <>
                  <ProcedureText>{procedure.title}</ProcedureText>
                  <Spacer size={width <= 768 ? '16px' : '20px'} />
                  <StepsWrapper>
                     {procedure.steps
                        .filter(step => step.isVisible)
                        .map((step, i) => (
                           <StepCard key={i}>
                              <StepIndicator>
                                 <StepIndicatorText>{i + 1}</StepIndicatorText>
                              </StepIndicator>
                              <ContentText>
                                 <StepText>
                                    {step.title ? step.title + ': ' : ''}
                                 </StepText>
                                 {step.description}
                              </ContentText>
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

   if (loading && !simpleRecipe) {
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <RecipeSkeleton />
         </>
      )
   }

   if (!loading && (!simpleRecipe || error)) {
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <ErrorScreen>
               <ContentText>Failed to fetch Recipe!</ContentText>
            </ErrorScreen>
         </>
      )
   }

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
         <Helmet>
            <title>{`${refProduct.name} | ${visual.appTitle}`}</title>
            <meta name="description" content={simpleRecipe.description || ''} />
            <meta
               name="keywords"
               content={
                  simpleRecipe.tags?.length ? simpleRecipe.tags.join(',') : ''
               }
            />
            <script type="application/ld+json">
               {JSON.stringify(simpleRecipe.richResult)}
            </script>
         </Helmet>
         <Header title="Home" navigation={navigation} />
         {/* <Banner source={{ uri: simpleRecipe.image }}></Banner> */}
         <Wrapper>
            <DetailsContainer
               showsVerticalScrollIndicator={false}
               stickyHeaderIndices={[0]}
               ref={containerRef}
               onScroll={e => setScrollHeight(e.nativeEvent.contentOffset.y)}
            >
               <Tabs
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ marginHorizontal: 'auto' }}
               >
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
                  {simpleRecipe.showIngredients && (
                     <Tab
                        active={activeTab === 'ingredients'}
                        color={visual.color}
                        onPress={() =>
                           containerRef.current.scrollTo({
                              y: ingredientsPosition.current,
                           })
                        }
                     >
                        <TabText
                           active={activeTab === 'ingredients'}
                           color={visual.color}
                        >
                           Ingredients
                        </TabText>
                     </Tab>
                  )}
                  {simpleRecipe.showProcedures &&
                     Boolean(simpleRecipe.procedures.length) && (
                        <Tab
                           active={activeTab === 'cookingSteps'}
                           color={visual.color}
                           onPress={() =>
                              containerRef.current.scrollTo({
                                 y: cookingStepsPosition.current,
                              })
                           }
                        >
                           <TabText
                              active={activeTab === 'cookingSteps'}
                              color={visual.color}
                           >
                              Cooking Steps
                           </TabText>
                        </Tab>
                     )}
                  {Boolean(
                     simpleRecipe.simpleRecipeYields[0].nutritionalInfo ||
                        simpleRecipe.simpleRecipeYields[0].allergens?.length
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
               <Spacer size="20px" />
               {Boolean(width <= 768) && (
                  <>
                     <Title>{refProduct?.name}</Title>
                     <Spacer size="8px" />
                     <View
                        style={{
                           flexDirection: 'row',
                           alignItems: 'center',
                           justifyContent: 'space-between',
                        }}
                     >
                        <TypeWrapper type={simpleRecipe.type}>
                           <TypeText type={simpleRecipe.type}>
                              {simpleRecipe.type}
                           </TypeText>
                        </TypeWrapper>
                        {Boolean(width <= 768) && (
                           <BuyBtn color={visual.color} onPress={buy} small>
                              <BuyBtnText>Buy Now</BuyBtnText>
                           </BuyBtn>
                        )}
                     </View>
                     <Spacer size="8px" />
                     <SocialMediaShareButtons />
                     <Spacer size="16px" />
                  </>
               )}
               <PhotoShowcase
                  images={[simpleRecipe.image] || []}
                  fullWidth={true}
               />
               <Spacer size="40px" />
               <InfoContainer>
                  {Boolean(simpleRecipe.cuisine) && (
                     <Info>
                        <Cuisine
                           size={width <= 768 ? 24 : 40}
                           color={visual.color}
                        />
                        <InfoText>{simpleRecipe.cuisine}</InfoText>
                     </Info>
                  )}
                  {Boolean(simpleRecipe.cookingTime) && (
                     <Info>
                        <CookingTime
                           size={width <= 768 ? 24 : 40}
                           color={visual.color}
                        />
                        <InfoText>{simpleRecipe.cookingTime} mins.</InfoText>
                     </Info>
                  )}
                  {Boolean(simpleRecipe.author) && (
                     <Info>
                        <Chef
                           size={width <= 768 ? 24 : 40}
                           color={visual.color}
                        />
                        <InfoText>{simpleRecipe.author}</InfoText>
                     </Info>
                  )}
                  {Boolean(simpleRecipe.utensils?.length) && (
                     <Info>
                        <Utensils
                           size={width <= 768 ? 24 : 40}
                           color={visual.color}
                        />
                        <InfoText>{simpleRecipe.utensils.join(', ')}</InfoText>
                     </Info>
                  )}
               </InfoContainer>
               <Spacer size="24px" />
               <ContentText style={{ textAlign: 'center' }}>
                  {simpleRecipe.description}
               </ContentText>
               <Spacer size="68px" />
               {simpleRecipe.showIngredients && (
                  <>
                     <SectionHeader
                        color={visual.color}
                        onLayout={e => {
                           ingredientsPosition.current =
                              e.nativeEvent.layout.y - 60
                        }}
                     >
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
                                 <ContentText key={ing.id}>{`${
                                    simpleRecipe.showIngredientsQuantity
                                       ? ing.ingredientSachet.quantity +
                                         ' ' +
                                         ing.ingredientSachet.unit
                                       : ''
                                 } ${ing.slipName}`}</ContentText>
                                 {Boolean(
                                    ing.ingredientSachet.ingredient.image
                                 ) && (
                                    <IngredientImage
                                       source={{
                                          uri:
                                             ing.ingredientSachet.ingredient
                                                .image,
                                       }}
                                    />
                                 )}
                              </IngredientWrapper>
                           ))}
                     </Ingredients>
                     {Boolean(simpleRecipe.notIncluded?.length) && (
                        <>
                           <Spacer size="32px" />
                           <NotIncludedText>
                              What's not included:{' '}
                              {simpleRecipe.notIncluded.join(', ')}
                           </NotIncludedText>
                        </>
                     )}
                     <Spacer size="68px" />
                  </>
               )}
               {simpleRecipe.showProcedures &&
                  Boolean(simpleRecipe.procedures.length) && (
                     <>
                        <SectionHeader
                           color={visual.color}
                           nativeID="cookingSteps"
                           onLayout={e => {
                              cookingStepsPosition.current =
                                 e.nativeEvent.layout.y - 60
                           }}
                        >
                           Cooking Steps
                        </SectionHeader>
                        <Spacer size="40px" />
                        {renderCookingSteps()}
                        <Spacer size="28px" />
                     </>
                  )}
               {Boolean(
                  simpleRecipe.simpleRecipeYields[0].nutritionalInfo ||
                     simpleRecipe.simpleRecipeYields[0].allergens?.length
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
                     {Boolean(
                        simpleRecipe.simpleRecipeYields[0].nutritionalInfo
                     ) && (
                        <>
                           <Spacer size="20px" />
                           <NutritionWrapper>
                              <Nutrition
                                 values={
                                    simpleRecipe.simpleRecipeYields[0]
                                       .nutritionalInfo
                                 }
                              />
                           </NutritionWrapper>
                           <Spacer size="20px" />
                        </>
                     )}
                     {Boolean(
                        simpleRecipe.simpleRecipeYields[0].allergens?.length
                     ) && (
                        <>
                           <Spacer size="20px" />
                           <AllergensText style={{ textAlign: 'center' }}>
                              Allergens:{' '}
                              {simpleRecipe.simpleRecipeYields[0].allergens
                                 .map(allergen => allergen.title)
                                 .join(', ')}
                           </AllergensText>
                        </>
                     )}
                     <Spacer size="20px" />
                  </>
               )}
               {Boolean(refProduct?.recommendations) && (
                  <>
                     <Spacer size="80px" />
                     <Recommendations
                        navigation={navigation}
                        recommendations={refProduct?.recommendations}
                     />
                     <Spacer size="68px" />
                  </>
               )}
            </DetailsContainer>
            {Boolean(width > 768) && (
               <PricingContainer>
                  {productLoading ? (
                     <ContentText>Loading...</ContentText>
                  ) : (
                     <>
                        <Title>{refProduct.name}</Title>
                        {Boolean(refProduct.additionalText) && (
                           <AdditionalText>
                              {refProduct.additionalText}
                           </AdditionalText>
                        )}
                        <Spacer size="8px" />
                        <SubSectionWrapper>
                           <TypeWrapper type={simpleRecipe.type}>
                              <TypeText type={simpleRecipe.type}>
                                 {simpleRecipe.type}
                              </TypeText>
                           </TypeWrapper>
                           <SocialMediaShareButtons />
                        </SubSectionWrapper>
                        <Spacer size="16px" />
                        {renderPricing()}
                     </>
                  )}
               </PricingContainer>
            )}
         </Wrapper>
         {Boolean(width <= 768) && (
            <BuyBtn color={visual.color} onPress={buy}>
               <BuyBtnText>Buy Now</BuyBtnText>
            </BuyBtn>
         )}
      </>
   )
}

export default Recipe

const Banner = styled.ImageBackground`
   width: ${width}px;
   height: 250px;
`

const ErrorScreen = styled.View`
   flex: 1;
   align-items: center;
   justify-content: center;
`

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

const InfoContainer = styled.View`
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
   ${width <= 768 &&
   css`
      margin-right: 0;
      padding: 0;
   `}
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
   color: #000;
   ${width <= 768 &&
   css`
      line-height: 21px;
      font-size: 16px;
   `}
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
   width: 360px;
   margin: 20px 10px;
   background: #fff;
   position: relative;
   ${width <= 768 &&
   css`
      width: ${width - 24}px;
      margin: 20px 0px;
   `}
`

const StepIndicator = styled.View`
   width: 40px;
   height: 40px;
   border-radius: 20px;
   align-items: center;
   justify-content: center;
   border: 1px solid #eae8e8;
   background: #fff;
   position: absolute;
   top: -20px;
   left: -10px;
   ${width <= 768 &&
   css`
      left: 0;
      top: -24px;
   `}
`

const StepIndicatorText = styled.Text`
   color: #636363;
   font-size: 18px;
   font-weight: bold;
`

const StepText = styled(ContentText)`
   font-weight: bold;
   color: #000;
`

const StepImage = styled.Image`
   width: 328px;
   height: 200px;
   border-radius: 4px;
   margin-top: 16px;
   ${width <= 768 &&
   css`
      width: ${width - 24 - 32}px;
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

const Title = styled(ContentText)`
   font-size: 28px;
   line-height: 40px;
   font-weight: bold;
`

const AdditionalText = styled(ContentText)`
   color: #686b78;
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
   margin-top: 8px;
   text-align: center;
   ${width <= 768 &&
   css`
      font-size: 18px;
      margin-bottom: 8px;
   `}
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

   ${props =>
      props.small &&
      css`
         padding: 8px;
      `}
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

const NotIncludedText = styled(ContentText)`
   font-style: italic;
   text-align: center;
`

const NutritionWrapper = styled.View`
   flex-direction: row;
   justify-content: center;
`

const SubSectionWrapper = styled.View`
   flex-direction: row;
   flex-wrap: wrap;
   align-items: center;
   justify-content: space-between;
`

const AllergensText = styled(ContentText)`
   font-size: 20px;
   font-weight: 600;
`
