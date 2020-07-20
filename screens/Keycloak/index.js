import React from 'react'
import { View } from 'react-native'
import { useAuth } from '../../context/auth'

const Keycloak = ({ type }) => {
   const { loginUrl, registerUrl } = useAuth()

   return (
      <View style={{ height: '100%' }}>
         <iframe
            src={type === 'login' ? loginUrl : registerUrl}
            title="Add Details"
            height={600}
            frameBorder="0"
         ></iframe>
      </View>
   )
}

export default Keycloak
