import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { useCartContext } from '../context/cart'
import { useAppContext } from '../context/app'

const CheckoutBar = ({ navigation }) => {
   const { visual } = useAppContext()
   const { cart } = useCartContext()

   return (
      <Wrapper show={cart && cart.cartInfo.products.length}>
         <Button
            color={visual.color}
            onPress={() => navigation.navigate('OrderSummary')}
         >
            <Stats>
               <StatsCount>{`${cart.cartInfo.products.length} ITEM${
                  cart.cartInfo.products.length > 1 ? 'S' : ''
               }`}</StatsCount>
               <StatsPrice>
                  <StatsPriceExact>$ {cart.cartInfo.total}</StatsPriceExact>
                  <StatsPriceTrail>plus taxes</StatsPriceTrail>
               </StatsPrice>
            </Stats>
            <Cart>
               <CartText>View Cart</CartText>
               <Feather name="chevron-right" color="#fff" size={16} />
            </Cart>
         </Button>
      </Wrapper>
   )
}

export default CheckoutBar

const Wrapper = styled.View`
   display: ${props => (props.show ? 'flex' : 'none')};
   position: fixed;
   bottom: 0;
   left: 0;
   right: 0;
   background: #fff;
   padding: 10px;
   shadow-opacity: 0.5;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: 0px -2px;
`

const Button = styled.TouchableOpacity`
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   background: ${props => props.color || '#33C931'};
   padding: 10px;
   border-radius: 5px;
`

const Stats = styled.View``

const StatsCount = styled.Text`
   color: #fff;
   font-size: 0.8rem;
`

const StatsPrice = styled.View`
   flex-direction: row;
   align-items: baseline;
`

const StatsPriceExact = styled.Text`
   color: #fff;
   margin-right: 8px;
   font-size: 1.1rem;
`
const StatsPriceTrail = styled.Text`
   color: #fff;
   font-size: 0.9rem;
`

const Cart = styled.View`
   flex-direction: row;
   align-items: baseline;
`

const CartText = styled.Text`
   color: #fff;
   font-size: 1.1rem;
`
