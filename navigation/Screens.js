import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Spinner } from '@ui-kitten/components';
import React, { lazy } from 'react';
import { View } from 'react-native';

// Auth Context
import { useAuth } from '../context/auth';

// screens
import Home from '../screens/Home';
const OrderHistory = lazy(() => import('../screens/OrderHistory'));
const OrderPlaced = lazy(() => import('../screens/OrderPlaced'));
const OrderSummary = lazy(() => import('../screens/OrderSummary'));
const PaymentProcessing = lazy(() => import('../screens/PaymentProcessing'));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen'));
const SafetyScreen = lazy(() => import('../screens/SafetyScreen'));
const SelectPaymentMethod = lazy(() =>
   import('../screens/SelectPaymentMethod')
);
const ModalContent = lazy(() => import('../components/ModalContent'));
const AddDetails = lazy(() => import('../screens/AddDetails'));
const AddToCart = lazy(() => import('../screens/AddToCart'));
const Delivery = lazy(() => import('../screens/Delivery'));
const EditAddress = lazy(() => import('../screens/EditAddress'));

import { width } from '../utils/Scalaing';
// drawer
import CustomDrawerContent from './Menu';

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
         <Stack.Screen
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
         />
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
               headerShown: false,
            }}
         />
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
            {true ? (
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
