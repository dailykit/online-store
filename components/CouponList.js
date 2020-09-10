import React from 'react'
import styled from 'styled-components/native'
import { useSubscription } from '@apollo/react-hooks'

const CouponList = () => {
   const { data, loading, error } = useSubscription()

   return <Wrapper></Wrapper>
}

export default CouponList

const Wrapper = styled.ScrollView``
