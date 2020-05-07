import React, { useState, useEffect } from 'react';
import {
  Easing,
  Animated,
  View,
  Dimensions,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// screens
import Home from '../screens/Home';
import Placeholder from '../screens/Placeholder';
import Profile from '../screens/Profile';
import AddToCart from '../screens/AddToCart';
import OrderSummary from '../screens/OrderSummary';
import OrderPlaced from '../screens/OrderPlaced';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
// drawer
import CustomDrawerContent from './Menu';

// Auth Context
import { useAuth } from '../context/auth';

// header for screens
import { Icon, Header } from '../components';
import { argonTheme, tabs } from '../constants';
import ModalContent from '../components/ModalContent';

const { width } = Dimensions.get('screen');

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName='Profile' mode='card' headerMode='screen'>
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title='Profile'
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#FFFFFF' },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name='Placeholder'
        component={Placeholder}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=''
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack(props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Welcome'
        component={WelcomeScreen}
        options={{
          headerMode: false,
          header: null,
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        setLoggedin={props.setLoggedin}
        options={{
          headerMode: false,
          header: null,
          headerShown: false,
          stackPresentation: 'modal',
        }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title='Home'
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name='Placeholder'
        component={Placeholder}
        options={{
          headerMode: false,
          header: null,
          headerShown: false,
          stackPresentation: 'modal',
        }}
      />
      <Stack.Screen
        name='Modal'
        component={ModalContent}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='AddToCart'
        component={AddToCart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='OrderSummary'
        component={OrderSummary}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='OrderPlaced'
        component={OrderPlaced}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      if (user && user.token && user.token !== undefined) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return (
    <>
      <Stack.Navigator mode='card' headerMode='none'>
        {isAuthenticated ? (
          <Stack.Screen name='App' component={AppStack} />
        ) : (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}
      </Stack.Navigator>
    </>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.75,
          backgroundColor: 'transparent',
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: 'normal',
        },
      }}
      initialRouteName='Home'
    >
      <Drawer.Screen name='Home' component={HomeStack} />
      {/* <Drawer.Screen name="Profile" component={ProfileStack} /> */}
      {/* <Drawer.Screen name="Account" component={Register} /> */}
      {/* <Drawer.Screen name="Articles" component={ArticlesStack} /> */}
    </Drawer.Navigator>
  );
}
