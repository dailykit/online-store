import React, { useState, useEffect } from 'react';
import {
   View,
   Dimensions,
   AsyncStorage,
   ActivityIndicator,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// screens
import Home from '../screens/Home';
import AddToCart from '../screens/AddToCart';
import OrderSummary from '../screens/OrderSummary';
import OrderPlaced from '../screens/OrderPlaced';
import { SafetyScreen } from '../screens/SafetyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
// drawer
import CustomDrawerContent from './Menu';

// Auth Context
import { useAuth } from '../context/auth';

// header for screens
import { Header } from '../components';
import ModalContent from '../components/ModalContent';
import { Delivery } from '../screens/Delivery';
import { EditAddress } from '../screens/EditAddress';
import { SelectPaymentMethod } from '../screens/SelectPaymentMethod';
import { OrderHistory } from '../screens/OrderHistory';
import { Text } from 'native-base';

import { height, width } from '../utils/Scalaing';
import PaymentProcessing from '../screens/PaymentProcessing';
import AddDetails from '../screens/AddDetails';
import { Spinner } from '@ui-kitten/components';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { STORE_SETTINGS } from '../graphql';
import { useAppContext } from '../context/app';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Loader = () => (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" />
   </View>
);

function LoaderStack(props) {
   return (
      <Stack.Navigator mode="card" headerMode="screen">
         <Stack.Screen
            name="Loader"
            component={Loader}
            options={{
               headerMode: false,
               header: null,
               headerShown: false,
               cardStyle: { backgroundColor: '#F8F9FE' },
            }}
         />
      </Stack.Navigator>
   );
}

function HomeStack(props) {
   return (
      <Stack.Navigator mode="card" headerMode="screen">
         <Stack.Screen
            name="Home"
            component={Home}
            options={{
               headerShown: false,
            }}
         />

         <Stack.Screen
            name="Modal"
            component={ModalContent}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="AddToCart"
            component={AddToCart}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="OrderPlaced"
            component={OrderPlaced}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="SafetyScreen"
            component={SafetyScreen}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="DeliveryScreen"
            component={Delivery}
            options={{
               headerShown: false,
            }}
         />
         {/* <Stack.Screen
            name="EditAddressScreen"
            component={EditAddress}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="SelectPaymentMethodScreen"
            component={SelectPaymentMethod}
            options={{
               headerShown: false,
            }}
         /> */}
         {/* <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
               headerShown: false,
            }}
         /> */}
         <Stack.Screen
            name="OrderHistoryScreen"
            component={OrderHistory}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="PaymentProcessing"
            component={PaymentProcessing}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="Add Details"
            component={AddDetails}
            options={{
               headerShown: false,
            }}
         />
      </Stack.Navigator>
   );
}

export default function OnboardingStack(props) {
   const { isAuthenticated, isInitialized } = useAuth();

   return (
      <>
         <Stack.Navigator mode="card" headerMode="none">
            {isInitialized ? (
               <Stack.Screen name="App" component={AppStack} />
            ) : (
               <Stack.Screen name="Loader" component={LoaderStack} />
            )}
         </Stack.Navigator>
      </>
   );
}

function AppStack(props) {
   return (
      <Drawer.Navigator
         style={{ flex: 1 }}
         drawerContent={props => <CustomDrawerContent {...props} />}
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
         initialRouteName="Home"
      >
         <Drawer.Screen name="Home" component={HomeStack} />
      </Drawer.Navigator>
   );
}
