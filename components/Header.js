import { Feather } from '@expo/vector-icons'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import React from 'react'
import { Text, View } from 'react-native'
import styled, { css } from 'styled-components/native'
import argonTheme from '../constants/Theme'
import { useAppContext } from '../context/app'
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'
import { isKeycloakSupported } from '../utils'
import { width } from '../utils/Scaling'
import Icon from './Icon'

import { Helmet } from 'react-helmet'

const BasketButton = ({ isWhite, size = 24 }) => {
   const { cart } = useCartContext()
   const { visual } = useAppContext()
   let numberOfProducts = cart?.cartInfo?.products?.length || 0

   return (
      <View style={{ position: 'relative' }}>
         {Boolean(numberOfProducts) && (
            <Text
               style={
                  width <= 768
                     ? {
                          position: 'absolute',
                          backgroundColor: visual.color,
                          color: '#fff',
                          top: '-10px',
                          right: '-8px',
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          fontSize: 10,
                          textAlign: 'center',
                       }
                     : {
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
                       }
               }
            >
               {numberOfProducts}
            </Text>
         )}
         <Icon
            size={size}
            name="shopping-cart"
            color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
         />
      </View>
   )
}

const Header = ({ navigation }) => {
   const { visual } = useAppContext()

   return (
      <Wrapper>
         <Helmet
            link={[
               { rel: 'icon', type: 'image/png', href: visual.favicon },
               {
                  rel: 'shortcut icon',
                  type: 'image/png',
                  href: visual.favicon,
               },
               {
                  rel: 'apple-touch-icon',
                  type: 'image/png',
                  href: visual.favicon,
               },
            ]}
         />
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

   const [query, setQuery] = React.useState('')

   const navigateToExternalLink = link => {
      if (window) {
         window.open(link, '_blank')
      }
   }

   return (
      <>
         <NavLeft>
            <BrandLogo source={{ uri: brand.logo }} />
            <NavLink onPress={() => navigation.navigate('Home')}>
               <NavLinkText>{brand.name || 'Home'}</NavLinkText>
            </NavLink>
            {Boolean(brand.navLinks?.aboutUs) && (
               <NavLink
                  onPress={() => navigateToExternalLink(brand.navLinks.aboutUs)}
               >
                  <NavLinkText>About Us</NavLinkText>
               </NavLink>
            )}
            <SearchContainer onPress={() => navigation.navigate('Search')}>
               <Feather name="search" size={18} color="#aaa" />
               <SearchText>Search</SearchText>
            </SearchContainer>
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
               <NavButton fade onPress={logout}>
                  <NavLinkText white>Logout</NavLinkText>
               </NavButton>
            ) : (
               <>
                  <NavButton
                     color={visual.color}
                     onPress={() =>
                        isKeycloakSupported()
                           ? open('Login')
                           : open('LoginSelf')
                     }
                  >
                     <NavLinkText white>Login</NavLinkText>
                  </NavButton>
                  <NavButton
                     outline
                     color={visual.color}
                     onPress={() =>
                        isKeycloakSupported()
                           ? open('Register')
                           : open('RegisterSelf')
                     }
                  >
                     <NavLinkText outline color={visual.color}>
                        Sign Up
                     </NavLinkText>
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
            <NavLink onPress={() => navigation.navigate('Search')}>
               <Feather name="search" size={16} />
            </NavLink>
            <NavLink onPress={() => navigation.navigate('OrderSummary')}>
               <BasketButton size={16} />
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
   ${props =>
      props.outline &&
      css`
         color: ${props.color};
      `}
`

const SearchContainer = styled.TouchableOpacity`
   flex-direction: row;
   margin-left: 32px;
   align-items: baseline;
`

const SearchText = styled.Text`
   font-size: 1.1rem;
   margin-left: 8px;
   color: #666;
`

const NavRight = styled.View`
   flex-direction: row;
   align-items: center;
`

const NavButton = styled(NavLink)`
   padding: 10px;
   background-color: ${props => (props.outline ? '#fff' : props.color)};
   border: 1px solid ${props => props.color};
   border-radius: 2px;
   ${props =>
      props.fade &&
      css`
         background: #ccc;
         border: 1px solid #ccc;
      `}
`
