import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function SvgComponent({ size = 40, color = '#000' }) {
   return (
      <Svg height={size} viewBox="0 0 482 482">
         <Path
            d="M471.745 112.032l-101.79-101.79c-14.132-14.132-37.256-13.612-50.7 1.39l-96.71 107.95c-12.37 13.81-11.79 34.89 1.32 48l90.54 90.54c13.097 13.098 34.184 13.682 48 1.32l107.95-96.71c14.983-13.426 15.547-36.543 1.39-50.7zm-198.027 29.034a9 9 0 010-12.729l65.676-65.676a9.001 9.001 0 0112.728 12.729l-65.676 65.676a9 9 0 01-12.728 0zm29.02 38.184a9 9 0 010-12.729l74.84-74.84a9.001 9.001 0 0112.728 12.729l-74.84 74.84a9.002 9.002 0 01-12.728 0zm116.587-36.657l-65.676 65.676a8.973 8.973 0 01-6.364 2.636c-7.946 0-12.051-9.678-6.364-15.364l65.676-65.676c3.515-3.514 9.213-3.514 12.728 0a9 9 0 010 12.728zm-165.06 97.859l-65.31 65.31c15.062 15.063 13.215 35.655 1.1 47.77l-118.79 118.8c-12.926 12.905-33.794 12.876-46.67 0l-14.94-14.94c-12.86-12.86-12.86-33.8 0-46.67l118.8-118.79c11.904-11.904 32.387-14.284 47.77 1.1l65.31-65.31c3.51-3.51 9.21-3.51 12.73 0 3.51 3.52 3.51 9.22 0 12.73z"
            fill={color}
         />
      </Svg>
   )
}

export default SvgComponent
