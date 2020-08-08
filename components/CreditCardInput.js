import React, { Component } from 'react'
import { Image, ImageBackground, Platform, Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import defaultIcons from './Icons'

const BASE_SIZE = { width: 300, height: 190 }

const s = EStyleSheet.create({
   cardContainer: {},
   cardFace: {},
   icon: {
      position: 'absolute',
      top: 15,
      right: 15,
      width: 60,
      height: 40,
      resizeMode: 'contain',
   },
   baseText: {
      color: 'rgba(255, 255, 255, 0.8)',
      backgroundColor: 'transparent',
   },
   placeholder: {
      color: 'rgba(255, 255, 255, 0.5)',
   },
   focused: {
      fontWeight: 'bold',
      color: 'rgba(255, 255, 255, 1)',
   },
   number: {
      fontSize: '$l',
      position: 'absolute',
      top: 95,
      left: 28,
   },
   name: {
      fontSize: '$s',
      position: 'absolute',
      bottom: 20,
      left: 25,
      right: 100,
   },
   expiryLabel: {
      fontSize: 9,
      position: 'absolute',
      bottom: 40,
      left: 218,
   },
   expiry: {
      fontSize: '$m',
      position: 'absolute',
      bottom: 20,
      left: 220,
   },
   amexCVC: {
      fontSize: '$m',
      position: 'absolute',
      top: 73,
      right: 30,
   },
   cvc: {
      fontSize: '$m',
      position: 'absolute',
      top: 80,
      right: 30,
   },
})

export default class CardView extends Component {
   static defaultProps = {
      name: '',
      placeholder: {
         number: '•••• •••• •••• ••••',
         name: 'FULL NAME',
         expiry: '••/••',
         cvc: '•••',
      },

      scale: 1,
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
      imageFront: require('../assets/imgs/card-front.png'),
   }

   render() {
      const {
         brand,
         name,
         number,
         expiry,
         cvc,
         focused,
         scale,
         fontFamily,
         imageFront,
         placeholder,
      } = this.props

      const Icons = { ...defaultIcons }
      const isAmex = brand === 'american-express'

      const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale }
      const transform = {
         transform: [
            { scale },
            { translateY: (BASE_SIZE.height * (scale - 1)) / 2 },
         ],
      }

      return (
         <View style={[s.cardContainer, containerSize]}>
            <ImageBackground
               style={[BASE_SIZE, s.cardFace, transform]}
               source={imageFront}
            >
               <Image style={[s.icon]} source={Icons[brand]} />
               <Text
                  style={[
                     s.baseText,
                     { fontFamily },
                     s.number,
                     !number && s.placeholder,
                     focused === 'number' && s.focused,
                  ]}
               >
                  {!number ? placeholder.number : number}
               </Text>
               <Text
                  style={[
                     s.baseText,
                     { fontFamily },
                     s.name,
                     !name && s.placeholder,
                     focused === 'name' && s.focused,
                  ]}
                  numberOfLines={1}
               >
                  {!name ? '' : name.toUpperCase()}
               </Text>
               <Text
                  style={[
                     s.baseText,
                     { fontFamily },
                     s.expiryLabel,
                     s.placeholder,
                     focused === 'expiry' && s.focused,
                  ]}
               >
                  MONTH/YEAR
               </Text>
               <Text
                  style={[
                     s.baseText,
                     { fontFamily },
                     s.expiry,
                     !expiry && s.placeholder,
                     focused === 'expiry' && s.focused,
                  ]}
               >
                  {!expiry ? placeholder.expiry : expiry}
               </Text>
               {isAmex && (
                  <Text
                     style={[
                        s.baseText,
                        { fontFamily },
                        s.amexCVC,
                        !cvc && s.placeholder,
                        focused === 'cvc' && s.focused,
                     ]}
                  >
                     {!cvc ? placeholder.cvc : cvc}
                  </Text>
               )}
            </ImageBackground>
         </View>
      )
   }
}
