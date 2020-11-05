import { Dimensions, Platform } from 'react-native'

let { height, width } = Dimensions.get('window')

// width = Platform.OS == 'web' ? (width < 1200 ? width : 1200) : width;

export { width, height }
