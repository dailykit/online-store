import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = '#000' }) => (
   <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <Path d="M7 11V7a5 5 0 0110 0v4" />
   </Svg>
)

export default SvgComponent
