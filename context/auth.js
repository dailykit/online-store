import Keycloak from 'keycloak-js'
import React from 'react'
import { AsyncStorage } from 'react-native'
// No. of times this file  had to be editied(cuz this package is garbage): 8
import { CLIENTID } from 'react-native-dotenv'
import { isKeycloakSupported } from '../utils'
import jwt_decode from 'jwt-decode'

const keycloak = new Keycloak({
   realm: 'consumers',
   url: 'https://secure.dailykit.org/auth',
   clientId: CLIENTID,
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = React.useState(false)
   const [user, setUser] = React.useState({})
   const [isInitialized, setIsInitialized] = React.useState(false)
   const [loginUrl, setLoginUrl] = React.useState('')
   const [registerUrl, setRegisterUrl] = React.useState('')

   const initialize = async () => {
      const authenticated = await keycloak.init({
         onLoad: 'check-sso',
         promiseType: 'native',
      })
      setIsInitialized(true)
      if (authenticated) {
         setIsAuthenticated(authenticated)
         const profile = await keycloak.loadUserInfo()
         console.log('AuthProvider -> profile', profile)
         setUser(profile)
      }
   }

   React.useEffect(() => {
      if (isKeycloakSupported()) {
         initialize()
         setLoginUrl(
            keycloak.createLoginUrl({
               redirectUri: `${window.location.origin}/store/LoginSuccess`,
            })
         )
         setRegisterUrl(
            keycloak.createRegisterUrl({
               redirectUri: `${window.location.origin}/store/LoginSuccess`,
            })
         )
      } else {
         setIsInitialized(true)
         ;(async () => {
            const token = await AsyncStorage.getItem('token')
            if (token) {
               const decoded = jwt_decode(token)
               if (new Date().getTime() > decoded.exp * 1000) {
                  // token expired
                  console.log('Refreshing token....')
               } else {
                  // token valid
                  console.log(decoded)
                  setUser({
                     email: decoded['email'],
                     email_verified: decoded['email_verified'],
                     preferred_username: decoded['preferred_username'],
                     sub: decoded['sub'],
                     id: decoded['sub'],
                  })
                  setIsAuthenticated(true)
               }
            } else {
               setIsAuthenticated(false)
               setUser({})
            }
         })()
      }
   }, [])

   React.useEffect(() => {
      if (window && isKeycloakSupported()) {
         let eventMethod = window.addEventListener
            ? 'addEventListener'
            : 'attachEvent'
         let eventer = window[eventMethod]
         let messageEvent =
            eventMethod === 'attachEvent' ? 'onmessage' : 'message'

         eventer(messageEvent, e => {
            if (e.origin !== window.origin) return
            try {
               if (e.data.loginSuccess) {
                  initialize()
               }
            } catch (error) {}
         })
      }
   }, [])

   const login = () =>
      keycloak.login({
         redirectUri: `${window.location.origin}/store/LoginSuccess`,
      })
   const logout = async () => {
      if (isKeycloakSupported()) {
         keycloak.logout({
            redirectUri: `${window.location.origin}/store`,
         })
      } else {
         await AsyncStorage.removeItem('token')
         window.location.href = `${window.location.origin}/store`
      }
   }
   const register = () =>
      keycloak.register({
         redirectUri: `${window.location.origin}/store/LoginSuccess`,
      })

   return (
      <AuthContext.Provider
         value={{
            user,
            login,
            logout,
            register,
            isInitialized,
            isAuthenticated,
            loginUrl,
            registerUrl,
         }}
      >
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => React.useContext(AuthContext)
