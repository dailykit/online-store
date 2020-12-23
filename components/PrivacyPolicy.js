import React from 'react'
import styled from 'styled-components/native'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
import { SETTINGS } from '../graphql'
import Policy from './skeletons/policy'

const PrivacyPolicy = () => {
   const { brandId } = useAppContext()
   const [html, setHtml] = React.useState('')

   const { loading, error } = useQuery(SETTINGS, {
      variables: { brandId, identifier: 'Privacy Policy', type: 'brand' },
      onCompleted: data => {
         const setting = data.storeSettings[0]
         console.log(setting)
         if (setting.brandSettings.length) {
            setHtml(setting.brandSettings[0].value?.value)
         } else {
            setHtml(setting.value?.value ?? '<p>No policy found!</p>')
         }
      },
   })

   React.useEffect(() => {
      if (document && html) {
         const content = document.getElementById('privacy-policy')
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
         <Heading> Privacy Policy </Heading>
         <Content nativeID="privacy-policy"></Content>
      </Wrapper>
   )
}

export default PrivacyPolicy

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
