import React from 'react'
import styled from 'styled-components/native'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
import { SETTINGS } from '../graphql'
import Policy from './skeletons/policy'

const TermsAndConditions = () => {
   const { brandId } = useAppContext()
   const [html, setHtml] = React.useState('')

   const { loading, error } = useQuery(SETTINGS, {
      variables: { brandId, identifier: 'Terms and Conditions', type: 'brand' },
      onCompleted: data => {
         const setting = data.storeSettings[0]
         if (setting.brandSettings.length) {
            setHtml(setting.brandSettings[0].value?.value)
         } else {
            setHtml(setting.value?.value ?? '<p>Not found!</p>')
         }
      },
   })

   React.useEffect(() => {
      if (document && html) {
         const content = document.getElementById('terms-and-conditions')
         if (content) {
            content.innerHTML = html
         }
      }
   }, [html])

   if (loading || error) {
      return <Policy />
   }

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
