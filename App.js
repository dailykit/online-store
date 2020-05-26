import 'react-native-get-random-values';
import React, { Suspense } from 'react';
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

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

import ErrorBoundary from './components/ErrorBoundary';

// set up apollo client
import { HASURA_URL, HASURA_WS } from 'react-native-dotenv';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from '@apollo/react-hooks';

// Majburi

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
let { height, width } = Dimensions.get('window');
EStyleSheet.build({
  $rem: width > 340 ? 16 : 13,
  $xl: '1.2rem',
  $l: '1.15rem',
  $m: '1.05rem',
  $s: '0.95rem',
  $xs: '0.85rem',
  $xxs: '0.75rem',
  $xxxs: '0.65rem',
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

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Suspense fallback={FallBack}>
          <ErrorBoundary>
            <NavigationContainer>
              <SafeAreaView style={{ flex: 1 }}>
                <View
                  style={{
                    marginTop:
                      Platform.OS == 'android' ? Constants.statusBarHeight : 0,
                    flex: 1,
                  }}
                >
                  {Platform.OS == 'ios' && (
                    <StatusBar barStyle='dark-content' />
                  )}
                  <ApplicationProvider {...eva} theme={eva.light}>
                    <ApolloProvider client={client}>
                      <AuthProvider>
                        <CartContextProvider>
                          <Screens />
                        </CartContextProvider>
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
  }

  _loadResourcesAsync = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
