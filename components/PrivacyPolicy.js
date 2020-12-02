import React from 'react'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'

const PrivacyPolicy = () => {
   const { brand } = useAppContext()

   React.useEffect(() => {
      if (document) {
         const content = document.getElementById('privacy-policy')
         content.innerHTML = brand.privacyPolicy
      }
   }, [])

   return (
      <Wrapper>
         <Heading> Privacy Policy </Heading>
         <Content nativeID="privacy-policy"></Content>
      </Wrapper>
   )
}

export default PrivacyPolicy

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
