import 'react-native-get-random-values';
import React from 'react';
import { Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import Block from './components/Block';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './store';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Context Providers
import { AuthProvider } from './context/auth';
import { CartContextProvider } from './context/cart';

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
enableScreens();

//auth

import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';

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
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <Block
              style={{
                marginTop:
                  Platform.OS == 'android' ? Constants.statusBarHeight : 0,
              }}
              flex
            >
              <Provider store={store}>
                {Platform.OS == 'ios' && <StatusBar barStyle='dark-content' />}
                <ApplicationProvider {...eva} theme={eva.light}>
                  <AuthProvider>
                    <CartContextProvider>
                      <Screens />
                    </CartContextProvider>
                  </AuthProvider>
                </ApplicationProvider>
              </Provider>
            </Block>
          </SafeAreaView>
        </NavigationContainer>
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
