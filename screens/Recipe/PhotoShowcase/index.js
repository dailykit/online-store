import React from 'react'
import styled, { css } from 'styled-components/native'
import { height, width } from '../../../utils/Scalaing'

const PhotoShowcase = ({ images }) => {
   return (
      <Wrapper>
         <Display style={{ resizeMode: 'cover' }} source={{ uri: images[0] }} />
      </Wrapper>
   )
}

export default PhotoShowcase

const Wrapper = styled.View`
   margin: 0 auto;
`

const Display = styled.Image`
   height: 500px;
   width: ${width - 48 * 2 - 24 - 0.4 * width}px;
   border-radius: 4px;
   ${width <= 768 &&
   css`
      width: ${width - 24}px;
      height: 300px;
   `}
`
