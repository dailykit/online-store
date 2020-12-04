import React from 'react'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'

const TermsAndConditions = () => {
   const { brand } = useAppContext()

   React.useEffect(() => {
      if (document) {
         const content = document.getElementById('terms-and-conditions')
         content.innerHTML = brand.termsAndConditions
      }
   }, [])

   return (
      <Wrapper stickyHeaderIndices={[0]}>
         <Heading> Terms and Conditions </Heading>
         <Content nativeID="terms-and-conditions"></Content>
      </Wrapper>
   )
}

export default TermsAndConditions

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
