import React from 'react'
import styled, { css } from 'styled-components/native'
import { useAppContext } from '../../context/app'
import { width } from '../../utils/Scaling'
import defaultProductImage from '../../assets/imgs/default-product-image.png'

const PhotoShowcase = ({ images, fullWidth }) => {
   const { visual } = useAppContext()
   const [selectedPhoto, setSelectedPhoto] = React.useState(undefined)

   React.useEffect(() => {
      if (images?.length) {
         setSelectedPhoto(images[0])
      }
   }, [images])

   return (
      <Wrapper>
         <Display
            fullWidth={fullWidth}
            style={{
               resizeMode: fullWidth && selectedPhoto ? 'cover' : 'contain',
            }}
            source={{ uri: selectedPhoto || defaultProductImage }}
         />
         {Boolean(images?.length > 1) && (
            <PhotoSlider horizontal showsHorizontalScrollIndicator={false}>
               {images.map(image => (
                  <PhotoWrapper
                     key={image}
                     onPress={() => setSelectedPhoto(image)}
                     color={visual.color}
                     selected={selectedPhoto === image}
                  >
                     <Photo
                        style={{ resizeMode: 'contain' }}
                        source={{ uri: image }}
                     />
                  </PhotoWrapper>
               ))}
            </PhotoSlider>
         )}
      </Wrapper>
   )
}

export default PhotoShowcase

const Wrapper = styled.View`
   margin: 0 auto;
`

const Display = styled.Image`
   height: 500px;
   width: ${props =>
      props.fullWidth ? width - 48 * 2 - 24 - 0.4 * width + 'px' : '400px'};
   border-radius: 4px;
   margin: 0 auto;
   margin-bottom: 16px;
   ${width <= 768 &&
   css`
      width: ${width - 24}px;
      height: 300px;
   `}
`

const PhotoSlider = styled.ScrollView``

const Photo = styled.Image`
   flex: 1;
`

const PhotoWrapper = styled.TouchableOpacity`
   border: 1px solid ${props => (props.selected ? props.color : '#fff')}
   height: 100px;
   width: 100px;
   border-radius: 4px;
   margin-right: 8px;
   ${
      width <= 768 &&
      css`
         width: 50px;
         height: 50px;
      `
   }
`
