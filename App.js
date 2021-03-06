import { ApolloProvider } from '@apollo/react-hooks'
import {
   HASURA_GRAPHQL_ADMIN_SECRET,
   HASURA_URL,
   HASURA_WS,
   NODE_ENV,
} from '@env'
import { NavigationContainer } from '@react-navigation/native'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { decode, encode } from 'base-64'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Platform, SafeAreaView, StatusBar, View } from 'react-native'
import * as Sentry from 'sentry-expo'
// setup rem
import EStyleSheet from 'react-native-extended-stylesheet'
import 'react-native-get-random-values'
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens'
import { ToastProvider } from 'react-native-styled-toast'
import { ThemeProvider } from 'styled-components'
import DrawerLayout from './components/DrawerLayout'
import ErrorBoundary from './components/ErrorBoundary'
import AppSkeleton from './components/skeletons/app'
import { AppContextProvider } from './context/app'
// Context Providers
import { AuthProvider } from './context/auth'
import { CartContextProvider } from './context/cart'
import { DrawerContextProvider } from './context/drawer'
//auth
import Screens from './navigation/Screens'
// linking
import useLinking from './navigation/useLinking'
import { width } from './utils/Scaling'

Sentry.init({
   dsn:
      'https://378ec473db7e476a823dc946f1a5dd43@o460444.ingest.sentry.io/5607834',
   enableInExpoDevelopment: true,
   debug: NODE_ENV === 'development',
})

const authLink = setContext((_, { headers }) => {
   return {
      headers: {
         ...headers,
         'x-hasura-admin-secret': `${HASURA_GRAPHQL_ADMIN_SECRET}`,
      },
   }
})

const httpLink = new HttpLink({
   uri: HASURA_URL,
})

const wsLink = new WebSocketLink({
   uri: HASURA_WS,
   options: {
      reconnect: true,
      connectionParams: {
         headers: {
            'x-hasura-admin-secret': `${HASURA_GRAPHQL_ADMIN_SECRET}`,
         },
      },
   },
})

const link = split(
   ({ query }) => {
      const definition = getMainDefinition(query)
      return (
         definition.kind === 'OperationDefinition' &&
         definition.operation === 'subscription'
      )
   },
   wsLink,
   authLink.concat(httpLink)
)

const client = new ApolloClient({
   link,
   cache: new InMemoryCache(),
})

enableScreens()

if (!global.btoa) {
   global.btoa = encode
}

if (!global.atob) {
   global.atob = decode
}

const BASE_SIZE = 0.7

EStyleSheet.build({
   $rem: width > 340 ? 16 : 13,
   $xxxl: `${BASE_SIZE + 1.2}rem`,
   $xxl: `${BASE_SIZE + 1}rem`,
   $xl: `${BASE_SIZE + 0.8}rem`,
   $l: `${BASE_SIZE + 0.6}rem`,
   $m: `${BASE_SIZE + 0.4}rem`,
   $s: `${BASE_SIZE + 0.2}rem`,
   $xs: `${BASE_SIZE}rem`,
   $xxs: `${BASE_SIZE - 0.2}rem`,
   $xxxs: `${BASE_SIZE - 0.4}rem`,
})

const theme = {
   space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
   colors: {
      text: '#0A0A0A',
      background: '#FFF',
      border: '#E2E8F0',
      muted: '#F0F1F3',
      success: '#7DBE31',
      error: '#FC0021',
   },
}

const App = () => {
   const [isLoading, setIsLoading] = React.useState(true)

   const [initialNavigationState, setInitialNavigationState] = useState()
   const containerRef = useRef()
   const { getInitialState } = useLinking(containerRef)
   useEffect(() => {
      ;(async () => {
         setInitialNavigationState(await getInitialState())
         setIsLoading(false)
      })()
   }, [])

   if (isLoading) {
      return <AppSkeleton />
   } else {
      return (
         <Suspense fallback={<AppSkeleton />}>
            <ErrorBoundary>
               <ThemeProvider theme={theme}>
                  <ToastProvider position="BOTTOM">
                     <NavigationContainer
                        ref={containerRef}
                        initialState={initialNavigationState}
                     >
                        <SafeAreaView
                           style={{ flex: 1, backgroundColor: '#fff' }}
                        >
                           <View
                              style={{
                                 flex: 1,
                                 backgroundColor: '#fff',
                              }}
                           >
                              {Platform.OS == 'ios' && (
                                 <StatusBar barStyle="dark-content" />
                              )}
                              <ApolloProvider client={client}>
                                 <AuthProvider>
                                    <AppContextProvider>
                                       <DrawerContextProvider>
                                          <CartContextProvider>
                                             <Screens />
                                             <DrawerLayout />
                                          </CartContextProvider>
                                       </DrawerContextProvider>
                                    </AppContextProvider>
                                 </AuthProvider>
                              </ApolloProvider>
                           </View>
                        </SafeAreaView>
                     </NavigationContainer>
                  </ToastProvider>
               </ThemeProvider>
            </ErrorBoundary>
         </Suspense>
      )
   }
}

export default App
