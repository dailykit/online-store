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
      <Wrapper>
         <Heading> Terms and Conditions </Heading>
         <Content nativeID="terms-and-conditions"></Content>
      </Wrapper>
   )
}

export default TermsAndConditions

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
