import React from 'react'
import styled from 'styled-components/native'

const PhotoShowcase = ({ images }) => {
   return (
      <Wrapper>
         <Display source={{ uri: images[0] }} />
      </Wrapper>
   )
}

export default PhotoShowcase

const Wrapper = styled.View`
   margin: 0 auto;
`

const Display = styled.Image`
   height: 400px;
   width: 500px;
`
