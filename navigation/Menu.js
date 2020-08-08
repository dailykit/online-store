import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'
import { useAuth } from '../context/auth'
import { useDrawerContext } from '../context/drawer'

function CustomDrawerContent({
   drawerPosition,
   navigation,
   profile,
   focused,
   state,
   ...rest
}) {
   const { brand, visual } = useAppContext()
   const { isAuthenticated, logout } = useAuth()
   const { open } = useDrawerContext()

   return (
      <View styles={{ flex: 1, padding: 10, position: 'relative' }}>
         <TouchableOpacity
            onPress={navigation.closeDrawer}
            style={{ position: 'absolute', top: 10, left: 10 }}
         >
            <Feather name="x" color="#999" size={24} />
         </TouchableOpacity>
         <View style={{ marginVertical: 20, marginHorizontal: 'auto' }}>
            <Image
               style={{ width: 80, height: 80, borderRadius: 40 }}
               source={{ uri: brand.logo }}
            />
         </View>
         <View
            style={{
               paddingLeft: 8,
               paddingRight: 14,
               flex: 1,
            }}
         >
            <ScrollView
               style={{ flex: 1 }}
               showsVerticalScrollIndicator={false}
            >
               <NavItem onPress={() => navigation.navigate('Home')}>
                  <Feather name="home" size={16} color={visual.color} />
                  <NavItemText>Home</NavItemText>
               </NavItem>
               <NavItem onPress={() => navigation.navigate('OrderSummary')}>
                  <Feather
                     name="shopping-cart"
                     size={16}
                     color={visual.color}
                  />
                  <NavItemText>Cart</NavItemText>
               </NavItem>
               {isAuthenticated ? (
                  <>
                     <NavItem
                        onPress={() => navigation.navigate('ProfileScreen')}
                     >
                        <Feather name="user" size={16} color={visual.color} />
                        <NavItemText>Profile</NavItemText>
                     </NavItem>
                     <NavItem
                        onPress={() => navigation.navigate('OrderHistory')}
                     >
                        <Feather
                           name="package"
                           size={16}
                           color={visual.color}
                        />
                        <NavItemText>Orders</NavItemText>
                     </NavItem>
                     <NavItem onPress={logout}>
                        <Feather
                           name="log-out"
                           size={16}
                           color={visual.color}
                        />
                        <NavItemText>Logout</NavItemText>
                     </NavItem>
                  </>
               ) : (
                  <>
                     <NavItem onPress={() => open('Login')}>
                        <Feather name="log-in" size={16} color={visual.color} />
                        <NavItemText>Login</NavItemText>
                     </NavItem>
                     <NavItem onPress={() => open('Register')}>
                        <Feather
                           name="user-plus"
                           size={16}
                           color={visual.color}
                        />
                        <NavItemText>Sign Up</NavItemText>
                     </NavItem>
                  </>
               )}
            </ScrollView>
         </View>
      </View>
   )
}

export default CustomDrawerContent

const NavItem = styled.TouchableOpacity`
   padding: 10px;
   flex-direction: row;
   align-items: baseline;
   margin-bottom: 10px;
`

const NavItemText = styled.Text`
   color: #333;
   margin-left: 16px;
   font-size: 1.1rem;
`
