import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components/native'
import { useAppContext } from '../../../context/app'
import { UPDATE_CART } from '../../../graphql'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '../../../context/auth'
import { useCartContext } from '../../../context/cart'
import { CURRENCY } from 'react-native-dotenv'
// 12

const Tip = ({ cart }) => {
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()
   const { setCart } = useCartContext()

   const [tip, setTip] = React.useState('')
   const [isCustom, setIsCustom] = React.useState(false)

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: data => {
         if (!isAuthenticated) {
            setCart(data.updateCart.returning[0])
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   const addTip = amount => {
      try {
         if (Number.isNaN(+amount)) {
            throw Error('Amount Invalid!')
         }
         updateCart({
            variables: {
               id: cart.id,
               set: {
                  tip: +amount,
               },
            },
         })
      } catch (err) {
         console.log(error)
      }
   }

   return (
      <>
         {cart.tip ? (
            <TipWrapper>
               <TipAmount>Tip</TipAmount>
               <TipAmountContainer>
                  <TipCTA onPress={() => addTip(0)}>
                     <Feather color="#FF5A52" name="x" size={16} />
                  </TipCTA>
                  <TipAmount>
                     {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: CURRENCY,
                     }).format(cart.tip.toFixed(2))}
                  </TipAmount>
               </TipAmountContainer>
            </TipWrapper>
         ) : (
            <Wrapper>
               <Header>Add a Tip</Header>
               {isCustom ? (
                  <CustomWrapper>
                     <Dollar></Dollar>
                     <CustomInput
                        onChangeText={value => setTip(value)}
                        value={tip}
                        placeholder="Enter amount"
                     />
                     <CTA color={visual.color} onPress={() => addTip(tip)}>
                        <CTAText>Add</CTAText>
                     </CTA>
                  </CustomWrapper>
               ) : (
                  <Options>
                     {[15, 20, 25].map(percent => (
                        <Option
                           color={visual.color}
                           onPress={() =>
                              addTip(
                                 (
                                    cart.cartInfo.total *
                                    (percent / 100)
                                 ).toFixed(2)
                              )
                           }
                        >
                           <OptionHeader>{percent}%</OptionHeader>
                           <OptionText>
                              {new Intl.NumberFormat('en-US', {
                                 style: 'currency',
                                 currency: CURRENCY,
                              }).format(
                                 (
                                    cart.cartInfo.total *
                                    (percent / 100)
                                 ).toFixed(2)
                              )}
                           </OptionText>
                        </Option>
                     ))}
                     <Option
                        color={visual.color}
                        onPress={() => setIsCustom(true)}
                     >
                        <OptionHeader>OR</OptionHeader>
                        <OptionText>Add Custom</OptionText>
                     </Option>
                  </Options>
               )}
            </Wrapper>
         )}
      </>
   )
}

export default Tip

const Wrapper = styled.View`
   border: 1px solid #e9e9eb;
   padding: 8px;
`

const Header = styled.Text`
   font-size: 14px;
   color: #686b78;
   margin-bottom: 1rem;
`

const Options = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const Option = styled.TouchableOpacity`
   padding: 4px;
   border-radius: 2px;
   text-align: center;
   border: 1px solid ${props => props.color};
`

const OptionHeader = styled.Text`
   font-size: 12px;
   color: #93959f;
`

const OptionText = styled.Text`
   font-size: 14px;
   font-weight: bold;
   color: #282c3f;
`

const CustomWrapper = styled.View`
   flex-direction: row;
   align-items: center;
`

const Dollar = styled.Text``

const CustomInput = styled.TextInput`
   flex: 1;
   margin-right: 1rem;
   border-bottom: 1px solid #ccc;
`

const CTA = styled.TouchableOpacity`
   padding: 0.75rem;
   background-color: ${props => props.color};
   border-radius: 2px;
`

const CTAText = styled.Text`
   color: #fff;
`

const TipWrapper = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 8px;
`

const TipAmountContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const TipCTA = styled.TouchableOpacity`
   margin-right: 0.5rem;
`

const TipAmount = styled.Text`
   font-size: 13px;
   color: #686b78;
`
