import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { Spinner } from 'native-base'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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

const Recipe = ({ route, navigation }) => {
   let { recipeId, refId, refType } = route.params

   const { visual, masterLoading } = useAppContext()

   const [option, setOption] = React.useState(undefined)
   const [fetching, setFetching] = React.useState(false)
   const [selected, setSelected] = React.useState(new Map())

   // For Drawer
   const [isModalVisible, setIsModalVisible] = React.useState(false)
   const [refProduct, setRefProduct] = React.useState({})

   const { data: { simpleRecipe = {} } = {}, loading, error } = useQuery(
      SIMPLE_RECIPE,
      {
         variables: {
            id: recipeId,
         },
         onCompleted: data => {
            if (data.simpleRecipe.simpleRecipeYields[0]) {
               setOption(data.simpleRecipe.simpleRecipeYields[0])
            }
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
      onCompleted: data => {
         setRefProduct(data.simpleRecipeProduct)
         setIsModalVisible(true)
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
         setIsModalVisible(true)
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
         setIsModalVisible(true)
         setFetching(false)
      },
      onError: error => {
         console.log(error)
         setFetching(false)
      },
      fetchPolicy: 'cache-and-network',
   })

   const buy = () => {
      if (fetching) return
      else {
         setFetching(true)
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
      }
   }

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
            <DetailsContainer>
               <PhotoShowcase images={[simpleRecipe.image] || []} />
               <Spacer size="50px" />
               <SectionHeader>10 Ingredients</SectionHeader>
               <Spacer size="24px" />
               <ServingOptions>
                  {simpleRecipe.simpleRecipeYields.map(op => (
                     <ServingOption active={op.id === option.id}>
                        <ServingOptionText>
                           {op.yield.serving}
                        </ServingOptionText>
                     </ServingOption>
                  ))}
               </ServingOptions>
            </DetailsContainer>
            <PricingContainer></PricingContainer>
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
`

const Spacer = styled.View`
   height: ${props => props.size || '16px'};
`

const DetailsContainer = styled.ScrollView``

const SectionHeader = styled.Text`
   color: #888d9d;
   font-size: 24px;
   font-weight: bold;
`

const ServingOptions = styled.View`
   flex-direction: row;
   align-items: center;
`

const ServingOption = styled.View`
   align-items: center;
   justify-content: space-between;
   background: ${props => (props.active ? '#fff' : '#f3f3f3')};
   padding: 8px 16px;
   border: 1px solid #e4e4e4;
   cursor: pointer;
`

const ServingOptionText = styled.Text``

const PricingContainer = styled.View`
   width: 400px;
   background: #666;
`
