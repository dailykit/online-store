import { withNavigation } from '@react-navigation/compat'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import argonTheme from '../constants/Theme'
import { useCartContext } from '../context/cart'
import { width } from '../utils/Scalaing'
import Icon from './Icon'
import { useAppContext } from '../context/app'

import styled from 'styled-components/native'
import { useDrawerContext } from '../context/drawer'
import { useAuth } from '../context/auth'
import { Feather } from '@expo/vector-icons'
import { useIsDrawerOpen } from '@react-navigation/drawer'

const BasketButton = ({ isWhite }) => {
   const { cart } = useCartContext()
   const { visual } = useAppContext()
   let numberOfProducts = cart?.cartInfo?.products?.length || 0

   return (
      <View style={{ position: 'relative' }}>
         {Boolean(numberOfProducts) && (
            <Text
               style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  backgroundColor: visual.color,
                  color: '#fff',
                  borderRadius: 20,
                  height: 25,
                  width: 25,
                  padding: 2,
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: 'bold',
               }}
            >
               {numberOfProducts}
            </Text>
         )}
         <Icon
            size={24}
            name="shopping-cart"
            color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
         />
      </View>
   )
}

const Header = ({ navigation }) => {
   return (
      <Wrapper>
         {width > 768 ? (
            <WebNav navigation={navigation} />
         ) : (
            <MobileNav navigation={navigation} />
         )}
      </Wrapper>
   )
}

export default Header

const WebNav = ({ navigation }) => {
   const { brand, visual } = useAppContext()
   const { open } = useDrawerContext()
   const { isAuthenticated, logout } = useAuth()

   return (
      <>
         <NavLeft>
            <BrandLogo source={{ uri: brand.logo }} />
            <NavLink onPress={() => navigation.navigate('Home')}>
               <NavLinkText>{brand.name || 'Home'}</NavLinkText>
            </NavLink>
            <NavLink>
               <NavLinkText>About Us</NavLinkText>
            </NavLink>
         </NavLeft>
         <NavRight>
            {isAuthenticated && (
               <>
                  <NavLink onPress={() => navigation.navigate('OrderHistory')}>
                     <NavLinkText>Orders</NavLinkText>
                  </NavLink>
                  <NavLink onPress={() => navigation.navigate('ProfileScreen')}>
                     <NavLinkText>Profile</NavLinkText>
                  </NavLink>
               </>
            )}
            <NavLink onPress={() => navigation.navigate('OrderSummary')}>
               <BasketButton />
            </NavLink>
            {isAuthenticated ? (
               <NavButton blend onPress={logout}>
                  <NavLinkText white>Logout</NavLinkText>
               </NavButton>
            ) : (
               <>
                  <NavButton color={visual.color} onPress={() => open('Login')}>
                     <NavLinkText white>Login</NavLinkText>
                  </NavButton>
                  <NavButton
                     color={visual.color}
                     onPress={() => open('Register')}
                  >
                     <NavLinkText white>Sign Up</NavLinkText>
                  </NavButton>
               </>
            )}
         </NavRight>
      </>
   )
}

const MobileNav = ({ navigation }) => {
   const { brand } = useAppContext()
   const { open } = useDrawerContext()
   const { isAuthenticated, logout } = useAuth()

   const isDrawerOpen = useIsDrawerOpen()

   return (
      <>
         <NavLeft>
            <NavLink onPress={() => navigation.toggleDrawer()}>
               <Feather name={isDrawerOpen ? 'x' : 'menu'} size={16} />
            </NavLink>
            <BrandLogo source={{ uri: brand.logo }} />
            <NavLink onPress={() => navigation.navigate('Home')}>
               <NavLinkText>{brand.name || 'Home'}</NavLinkText>
            </NavLink>
         </NavLeft>
         <NavRight>
            <NavLink onPress={() => navigation.navigate('Home')}>
               <Feather name="search" size={16} />
            </NavLink>
         </NavRight>
      </>
   )
}

const Wrapper = styled.View`
   height: 66px;
   background: #fff;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   padding: ${width > 786 ? '0px 20px' : '0px'};
   shadow-opacity: 0.5;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: 0px 2px;
`

const NavLeft = styled.View`
   flex-direction: row;
   align-items: center;
`

const BrandLogo = styled.Image`
   width: 50px;
   height: 50px;
   border-radius: 25px;
`

const NavLink = styled.TouchableOpacity`
   margin: 0 10px;
`

const NavLinkText = styled.Text`
   font-size: 1.1rem;
   color: ${props => (props.white ? '#fff' : '#111')};
`

const NavRight = styled.View`
   flex-direction: row;
   align-items: center;
`

const NavButton = styled(NavLink)`
   padding: 10px;
   background-color: ${props =>
      props.blend ? '#ccc' : props.color || '#33C931'};
   border-radius: 2px;
`
