import React from 'react'
import styled from 'styled-components/native'
import { useCartContext } from '../../../context/cart'
import { useAppContext } from '../../../context/app'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CART } from '../../../graphql'
import { Feather } from '@expo/vector-icons'

const PayWithLoyaltyPoints = () => {
   const { loyaltyPoints, cart } = useCartContext()
   const { visual } = useAppContext()
   const [value, setValue] = React.useState(cart.loyaltyPointsUsable)
   const [error, setError] = React.useState('')
   const [isInputing, setIsInputing] = React.useState(false)

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Loyalty points added!')
      },
      onError: error => {
         console.log(error)
      },
   })

   const save = () => {
      try {
         setError('')
         const val = +value
         if (!Number.isNaN(val) && Number.isInteger(val) && val > 0) {
            if (val <= cart.loyaltyPointsUsable) {
               if (val <= loyaltyPoints.points) {
                  updateCart({
                     variables: {
                        id: cart.id,
                        set: {
                           loyaltyPointsUsed: val,
                        },
                     },
                  })
               } else {
                  throw Error('Not enough points!')
               }
            } else {
               throw Error('Max value exceeded!')
            }
         } else {
            throw Error('Invalid input!')
         }
      } catch (err) {
         setError(err.message)
      }
   }

   return (
      <>
         {Boolean(loyaltyPoints?.points) && (
            <>
               {cart.loyaltyPointsUsed ? (
                  <Field>
                     <FieldText>Loyalty Points Used:</FieldText>
                     <PointsContainer>
                        <Remove
                           onPress={() =>
                              updateCart({
                                 variables: {
                                    id: cart.id,
                                    set: {
                                       loyaltyPointsUsed: 0,
                                    },
                                 },
                              })
                           }
                        >
                           <Feather color="#FF5A52" name="x" size={16} />
                        </Remove>
                        <FieldText>{cart.loyaltyPointsUsed}</FieldText>
                     </PointsContainer>
                  </Field>
               ) : (
                  <Wrapper>
                     {isInputing ? (
                        <>
                           <InputGroup>
                              {Boolean(error) && <ErrorText>{error}</ErrorText>}
                              <Input
                                 value={value}
                                 onChangeText={val => setValue(val)}
                              />
                           </InputGroup>
                           <PointsText>
                              Max: <Points>{cart.loyaltyPointsUsable}</Points>
                           </PointsText>
                        </>
                     ) : (
                        <Content>
                           <Header>Use Loyalty Points?</Header>
                           <PointsText>
                              Available: <Points>{loyaltyPoints.points}</Points>
                           </PointsText>
                        </Content>
                     )}
                     <CTA
                        color={visual.color}
                        onPress={() =>
                           isInputing ? save() : setIsInputing(true)
                        }
                     >
                        <CTAText color={visual.color}>
                           {isInputing ? 'Use' : 'Yes'}
                        </CTAText>
                     </CTA>
                  </Wrapper>
               )}
            </>
         )}
      </>
   )
}

export default PayWithLoyaltyPoints

const Wrapper = styled.View`
   border: 1px solid #e9e9eb;
   padding: 8px;
   margin-top: 8px;
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

const PointsText = styled.Text`
   font-size: 12px;
   color: #686b78;
`

const Points = styled.Text`
   font-size: 12px;
   color: #686b78;
   font-weight: bold;
`

const InputGroup = styled.View``

const ErrorText = styled.Text`
   color: #ff5a52;
   font-size: 12px;
`

const Input = styled.TextInput`
   border-bottom-width: 1px;
   border-bottom-color: #686b78;
   color: #686b78;
`

const Field = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin-top: 8px;
`

const FieldText = styled.Text`
   font-size: 13px;
   color: #686b78;
`

const PointsContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const Remove = styled.TouchableOpacity`
   margin-right: 0.5rem;
`
