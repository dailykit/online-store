import React from 'react'
import styled from 'styled-components/native'
import { useCartContext } from '../../../context/cart'
import { useAppContext } from '../../../context/app'

const PayWithWallet = () => {
   const { wallet } = useCartContext()
   const { visual } = useAppContext()

   return (
      <>
         {Boolean(wallet.amount) && (
            <Wrapper>
               <Content>
                  <Header>Pay using Wallet</Header>
                  <AvailableText>
                     Balance: $<Points>{wallet.amount}</Points>
                  </AvailableText>
               </Content>
               <CTA color={visual.color}>
                  <CTAText color={visual.color}>Pay</CTAText>
               </CTA>
            </Wrapper>
         )}
      </>
   )
}

export default PayWithWallet

const Wrapper = styled.View`
   border: 1px solid #e9e9eb;
   padding: 8px;
   margin-bottom: 8px;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const Content = styled.View``

const CTA = styled.TouchableOpacity`
   padding: 4px;
   border-radius: 2px;
   border: 1px solid ${props => props.color};
`

const CTAText = styled.Text`
   color: ${props => props.color};
`

const Header = styled.Text`
   font-size: 14px;
   color: #686b78;
   margin-bottom: 0.5rem;
`

const AvailableText = styled.Text`
   font-size: 12px;
   color: #686b78;
`

const Points = styled.Text`
   font-size: 12px;
   color: #686b78;
   font-weight: bold;
`
