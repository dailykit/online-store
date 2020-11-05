import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

function SvgComponent({ size = 40, color = '#000' }) {
   return (
      <Svg height={size} viewBox="0 0 128 128" fill="none">
         <G clipPath="url(#prefix__clip0)" fill={color}>
            <Path d="M70.14 64.648a6.788 6.788 0 11-13.575 0 6.788 6.788 0 0113.575 0zM93.761 31.048L69.575 55.213a11.429 11.429 0 013.213 3.212l24.187-24.164 3.122-3.145c-.498-.566-1.04-1.109-1.56-1.652a26.895 26.895 0 00-1.653-1.56l-3.121 3.144zM69.574 74.083l1.788 1.764a2.265 2.265 0 003.19-3.212l-1.765-1.766a11.432 11.432 0 01-3.213 3.214z" />
            <Path d="M126.479 59.534l-.136-1.629c-.09-.747-.181-1.471-.271-2.194-.046-.34-.091-.68-.159-.996a41.53 41.53 0 00-.452-2.512 4.959 4.959 0 00-.114-.565 54.686 54.686 0 00-.633-2.76c0-.046-.023-.069-.023-.114a63.272 63.272 0 00-6.788-16.267l-3.349 3.348a11.34 11.34 0 01-3.733 2.488 56.978 56.978 0 012.647 5.408c.091.204.159.43.249.656.272.634.521 1.29.747 1.947.158.407.272.79.407 1.198.159.475.317.973.476 1.448.158.476.271.95.407 1.449.113.407.226.837.317 1.243.136.521.249 1.041.362 1.562.09.407.181.815.249 1.222.09.52.203 1.041.294 1.584.068.43.113.882.181 1.312.068.498.136.996.181 1.516.045.52.091 1.064.135 1.607.045.406.068.836.09 1.244.068.973.091 1.946.091 2.919a53.66 53.66 0 01-.836 9.39.035.035 0 01.008.022.037.037 0 01-.008.023v.045a53.84 53.84 0 01-6.404 17.535.277.277 0 01-.023.136.971.971 0 01-.135.158 54.98 54.98 0 01-11.879 14.141c-.045.046-.067.114-.113.159-.045.045-.113.045-.158.068-20.112 16.833-49.396 16.833-69.507 0-.045-.023-.113-.045-.158-.068-.045-.023-.068-.113-.113-.159a54.972 54.972 0 01-11.88-14.14 1.093 1.093 0 01-.135-.16.308.308 0 01-.023-.135 53.822 53.822 0 01-6.402-17.535v-.045a.034.034 0 01-.01-.023c0-.008.004-.016.01-.022a53.66 53.66 0 01-.838-9.39c0-.973.023-1.946.09-2.92.023-.452.069-.904.091-1.356.046-.498.068-.996.136-1.471.045-.566.136-1.132.204-1.698.045-.362.09-.724.158-1.108.09-.588.204-1.199.317-1.81.068-.294.136-.611.204-.928.113-.61.271-1.222.407-1.832.09-.317.159-.61.249-.905.158-.588.317-1.177.498-1.765.112-.34.225-.68.316-1.019.18-.543.362-1.085.543-1.605.18-.476.362-.928.543-1.381.158-.407.294-.792.475-1.2.362-.882.77-1.741 1.177-2.6v-.024a60.763 60.763 0 013.643-6.358 14.828 14.828 0 01-8.078-4.163 63.189 63.189 0 00-7.941 18.078 2.657 2.657 0 00-.113.407c-.226.838-.407 1.698-.589 2.558-.067.248-.113.497-.158.745-.158.793-.294 1.585-.43 2.354-.068.385-.113.77-.158 1.154-.09.678-.204 1.38-.272 2.081L.226 59.58l-.135 1.628A86.106 86.106 0 000 64.648C0 99.636 28.364 128 63.352 128c34.99 0 63.352-28.364 63.352-63.352 0-1.154-.044-2.308-.089-3.44l-.136-1.674z" />
            <Path d="M31.2 29.306a13.124 13.124 0 01-1.447 1.742 12.089 12.089 0 01-1.765 1.449l25.93 25.929a11.432 11.432 0 013.213-3.213L31.2 29.306zM79.213 3.309c-.023 0-.045-.023-.068-.023-.928-.226-1.856-.452-2.806-.656-.159-.022-.34-.068-.52-.09a45.533 45.533 0 00-2.534-.453c-.317-.068-.657-.09-.973-.136a74.393 74.393 0 00-2.217-.294l-1.607-.136-1.697-.136c-1.153-.045-2.285-.09-3.44-.09-1.153 0-2.307.045-3.438.09l-1.63.136-1.696.136c-.701.068-1.403.181-2.105.272-.362.045-.746.09-1.108.158-.791.136-1.584.272-2.376.43l-.746.136c-.86.203-1.72.384-2.58.61-.112.023-.248.069-.384.091a64.143 64.143 0 00-18.078 7.964 14.841 14.841 0 014.163 8.079 58.476 58.476 0 016.357-3.644h.023c.86-.43 1.72-.815 2.602-1.176.408-.18.793-.317 1.177-.475.475-.181.95-.362 1.402-.543a32.39 32.39 0 011.585-.52c.339-.114.701-.227 1.04-.34a50.56 50.56 0 011.742-.498c.317-.09.634-.159.95-.249.589-.158 1.2-.294 1.788-.407l.995-.204a48.234 48.234 0 011.765-.317c.385-.068.747-.113 1.132-.158.566-.068 1.109-.159 1.65-.204.544-.045 1.02-.09 1.517-.136.453-.022.883-.068 1.335-.09.974-.068 1.946-.09 2.919-.09.973 0 1.946.022 2.92.09.43.022.835.045 1.265.09.521.046 1.064.068 1.585.136.52.068 1.04.113 1.538.181.43.068.86.113 1.29.181.543.09 1.086.204 1.629.294.385.068.77.159 1.154.227.543.135 1.086.249 1.606.384.407.09.792.204 1.2.317.497.136.995.272 1.493.43.453.136.905.272 1.358.43.451.159.859.272 1.289.43.61.226 1.2.453 1.787.68.272.112.544.225.838.339.882.383 1.787.768 2.647 1.198h.022c.906.453 1.81.928 2.693 1.426a11.355 11.355 0 012.489-3.733l3.348-3.349a63.094 63.094 0 00-16.29-6.788zM52.153 72.657a2.26 2.26 0 00.943 3.918 2.263 2.263 0 002.247-.728l1.788-1.764a11.435 11.435 0 01-3.214-3.214l-1.764 1.788zM124.147 13.446l-15.996 15.996a2.28 2.28 0 01-3.213 0l-1.584-1.602 17.589-17.59a2.262 2.262 0 10-3.199-3.2l-17.589 17.59-1.602-1.601a2.173 2.173 0 01-.68-1.584 2.267 2.267 0 01.68-1.607L114.55 3.852a2.265 2.265 0 000-3.19 2.282 2.282 0 00-3.214 0L95.344 16.658c-.2.209-.388.427-.566.656a3.96 3.96 0 00-.474.725c-.295.48-.523.997-.679 1.537a6.363 6.363 0 00-.271 1.879 6.82 6.82 0 001.99 4.797l3.191 3.212 3.213 3.191a6.8 6.8 0 004.796 1.968 7.47 7.47 0 001.878-.249c.226-.068.452-.158.679-.249a.157.157 0 00.09-.045c.249-.113.521-.25.77-.385.203-.113.407-.249.611-.385.271-.2.529-.418.769-.655l4.073-4.05 11.923-11.947a2.28 2.28 0 000-3.212 2.261 2.261 0 00-3.19 0zM7.356 8.65c-4.415 4.41-.494 15.497 4.235 20.236 4.421 4.722 11.832 4.975 16.564.565 4.41-4.733 4.157-12.143-.566-16.564-4.737-4.73-15.824-8.65-20.233-4.236z" />
         </G>
         <Defs>
            <ClipPath id="prefix__clip0">
               <Path fill="#fff" d="M0 0h128v128H0z" />
            </ClipPath>
         </Defs>
      </Svg>
   )
}

export default SvgComponent
