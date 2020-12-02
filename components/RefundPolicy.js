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
      <Wrapper stickyHeaderIndices={[0]}>
         <Heading> Refund Policy </Heading>
         <Content nativeID="refund-policy"></Content>
      </Wrapper>
   )
}

export default RefundPolicy

const Wrapper = styled.ScrollView`
   padding: 1rem;
   padding-top: 0;
`

const Heading = styled.Text`
   font-size: 1.2rem;
   text-align: center;
   font-weight: 600;
   padding: 1rem;
   background: #fff;
`

const Content = styled.Text`
   font-size: 1rem;
`
