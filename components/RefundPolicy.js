import React from 'react'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'

const RefundPolicy = () => {
   const { brand } = useAppContext()

   React.useEffect(() => {
      if (document) {
         const content = document.getElementById('refund-policy')
         content.innerHTML = brand.refundPolicy
      }
   }, [])

   return (
      <Wrapper>
         <Heading> Refund Policy </Heading>
         <Content nativeID="refund-policy"></Content>
      </Wrapper>
   )
}

export default RefundPolicy

const Wrapper = styled.View`
   padding: 1rem;
`

const Heading = styled.Text`
   font-size: 1.2rem;
   text-align: center;
   font-weight: 600;
   margin-bottom: 1.5rem;
`

const Content = styled.Text`
   font-size: 1rem;
`
