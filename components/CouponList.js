import React from 'react'
import styled from 'styled-components/native'
import { useSubscription } from '@apollo/react-hooks'
import { COUPONS } from '../graphql'
import { useCartContext } from '../context/cart'
import { Spinner, Text } from 'native-base'

const CouponList = () => {
   const { cart, customer } = useCartContext()

   const { data, loading, error } = useSubscription(COUPONS, {
      variables: {
         // cartId: cart.id,
         // keycloakId: customer.keycloakId,
      },
   })

   if (error) console.log(error)

   if (loading) return <Spinner />

   return (
      <Wrapper>
         {data.coupons.map(coupon => (
            <Coupon coupon={coupon} />
         ))}
      </Wrapper>
   )
}

export default CouponList

const Coupon = ({ coupon }) => {
   return <Text>{coupon.code}</Text>
}

const Wrapper = styled.ScrollView``
