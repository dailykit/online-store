import React from 'react'
import styled, { css } from 'styled-components/native'
import { width } from '../../../utils/Scaling'

const ProductPhotos = ({ images }) => {
   if (!images || !images.length) return null
   return (
      <Wrapper>
         <Display
            style={{ resizeMode: 'contain' }}
            source={{ uri: images[0] }}
         />
      </Wrapper>
   )
}

export default ProductPhotos

const Wrapper = styled.View`
   margin: 0 auto;
`

const Display = styled.Image`
   height: 500px;
   width: 400px;
   border-radius: 4px;
   ${width <= 768 &&
   css`
      width: ${width - 24}px;
      height: 300px;
   `}
`
