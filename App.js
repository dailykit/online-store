import 'react-native-get-random-values';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Dimensions,
} from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Context Providers
import { AuthProvider } from './context/auth';
import { CartContextProvider } from './context/cart';
import { AppContextProvider } from './context/app';
import { DrawerContextProvider } from './context/drawer';

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

import ErrorBoundary from './components/ErrorBoundary';

// set up apollo client
import { HASURA_URL, HASURA_WS } from 'react-native-dotenv'; //1
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from '@apollo/react-hooks';

// linking
import useLinking from './navigation/useLinking';

// Majburi 1

const httpLink = new HttpLink({
  uri: HASURA_URL,
});

const wsLink = new WebSocketLink({
  uri: HASURA_WS,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

enableScreens();

//auth

import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';
import FallBack from './components/FallBack';

//enable axios auth (btoa)

import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

// setup rem
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, height } from './utils/Scalaing';
import { STORE_SETTINGS } from './graphql';

const BASE_SIZE = 0.7;

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
});

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];

// cache product images
articles.map((article) => assetImages.push(article.image));

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const App = () => {
  const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);
  const _loadResourcesAsync = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    return Promise.all([...cacheImages(assetImages)]);
  };

  const _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  const _handleFinishLoading = () => {
    setIsLoadingComplete(true);
  };
  const [initialNavigationState, setInitialNavigationState] = useState();
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);
  useEffect(() => {
    (async () => {
      console.log('App -> getInitialState', await getInitialState());
      setInitialNavigationState(await getInitialState());
    })();
  }, []);

  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else {
    return (
      <Suspense fallback={FallBack}>
        <ErrorBoundary>
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
              <View
                style={{
                  marginTop:
                    Platform.OS == 'android' ? Constants.statusBarHeight : 0,
                  flex: 1,
                  backgroundColor: '#fff',
                }}
              >
                {Platform.OS == 'ios' && <StatusBar barStyle='dark-content' />}
                <ApplicationProvider {...eva} theme={eva.light}>
                  <ApolloProvider client={client}>
                    <AuthProvider>
                      <AppContextProvider>
                        <DrawerContextProvider>
                          <CartContextProvider>
                            <Screens />
                          </CartContextProvider>
                        </DrawerContextProvider>
                      </AppContextProvider>
                    </AuthProvider>
                  </ApolloProvider>
                </ApplicationProvider>
              </View>
            </SafeAreaView>
          </NavigationContainer>
        </ErrorBoundary>
      </Suspense>
    );
  }
};

export default App;
