import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function SvgComponent({ size = 40, color = '#000' }) {
   return (
      <Svg height={size} viewBox="0 0 128 128" fill="none">
         <Path
            d="M39.06 118.85a3.949 3.949 0 01-5.424-.99 3.843 3.843 0 011.122-5.4l20.098-12.888 5.678 4.028-21.474 15.25zm55.88-3.926a3.861 3.861 0 01-6.012 3.93l-56.078-39.8a2 2 0 00-2.336.016 13.86 13.86 0 01-15.82-.466 15.124 15.124 0 01-6.272-8.58 10.8 10.8 0 019.4-13.918 15.126 15.126 0 0110.304 2.6A13.86 13.86 0 0134.474 73.2a2 2 0 00.86 2.174l57.908 37.084a3.825 3.825 0 011.698 2.466zM113.3 78.6a13.862 13.862 0 01-15.822.462 1.999 1.999 0 00-2.336-.016L73.016 94.754l-5.304-3.4 24.948-16a2 2 0 00.86-2.17 13.93 13.93 0 016.356-14.494c6.4-4.314 14.628-3.362 18.326 2.116 3.698 5.478 1.496 13.48-4.902 17.794zM45.64 70l-.8-4h38.32l-.8 4H45.64zM38 12a13.862 13.862 0 0110.166 4.4 2 2 0 003.252-.5 13.972 13.972 0 0125.164 0 2 2 0 003.252.5A13.863 13.863 0 0190 12a14 14 0 110 28 2 2 0 00-1.96 1.6L83.96 62h-7.654l1.674-11.716-3.96-.568L72.266 62H66V40h-4v22h-6.266L53.98 49.716l-3.96.568L51.694 62H44.04l-4.08-20.4A2 2 0 0038 40a14 14 0 110-28z"
            fill={color}
         />
      </Svg>
   )
}

export default SvgComponent
