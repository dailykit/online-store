import React from 'react'
import styled from 'styled-components/native'
import { useCartContext } from '../../../context/cart'
import { useAppContext } from '../../../context/app'
import { UPDATE_CART } from '../../../graphql'
import { useMutation } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'

const PayWithWallet = () => {
   const { wallet, cart } = useCartContext()
   const { visual } = useAppContext()

   const [isInputing, setIsInputing] = React.useState(false)
   const [value, setValue] = React.useState(cart.walletAmountUsable)
   const [error, setError] = React.useState('')

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Wallet amount added!')
      },
      onError: error => {
         console.log(error)
      },
   })

   const save = () => {
      try {
         setError('')
         const val = +value
         if (!Number.isNaN(val) && val > 0) {
            if (val <= cart.walletAmountUsable) {
               updateCart({
                  variables: {
                     id: cart.id,
                     set: {
                        walletAmountUsed: val,
                     },
                  },
               })
            } else {
               throw Error('Max limit exceeded!')
            }
         } else {
            throw Error('Invalid input!')
         }
      } catch (err) {
         setError(err.message)
         console.log(err)
      }
   }

   if (cart.walletAmountUsable === 0) {
      return null
   }

   return (
      <>
         {Boolean(wallet?.amount) && (
            <>
               {cart.walletAmountUsed ? (
                  <Field>
                     <FieldText>Wallet Amount Used:</FieldText>
                     <AmountContainer>
                        <Remove
                           onPress={() =>
                              updateCart({
                                 variables: {
                                    id: cart.id,
                                    set: {
                                       walletAmountUsed: 0,
                                    },
                                 },
                              })
                           }
                        >
                           <Feather color="#FF5A52" name="x" size={16} />
                        </Remove>
                        <FieldText>
                           {cart.walletAmountUsed.toFixed(2)}
                        </FieldText>
                     </AmountContainer>
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
                           <AmountText>
                              Max:{' '}
                              <Amount>
                                 $ {cart.walletAmountUsable.toFixed(2)}
                              </Amount>
                           </AmountText>
                        </>
                     ) : (
                        <Content>
                           <Header>Pay using Wallet?</Header>
                           <AmountText>
                              Balance: <Amount>$ {wallet.amount}</Amount>
                           </AmountText>
                        </Content>
                     )}
                     <CTA
                        color={visual.color}
                        onPress={() =>
                           isInputing ? save() : setIsInputing(true)
                        }
                     >
                        <CTAText color={visual.color}>
                           {isInputing ? 'Add' : 'Yes'}
                        </CTAText>
                     </CTA>
                  </Wrapper>
               )}
            </>
         )}
      </>
   )
}

export default PayWithWallet

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

const AmountText = styled.Text`
   font-size: 12px;
   color: #686b78;
`

const Amount = styled.Text`
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

const AmountContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const Remove = styled.TouchableOpacity`
   margin-right: 0.5rem;
`
