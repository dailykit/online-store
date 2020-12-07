const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
   const config = await createExpoWebpackConfigAsync(env, argv)
   config.resolve.alias = {
      'react-native-maps': 'react-native-web-maps',
      'react-native': 'react-native-web',
      'react-native-banner-carousel': 'react-native-web-banner-carousel',
   }
   return config
}
