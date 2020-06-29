const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
   const config = await createExpoWebpackConfigAsync(
      {
         ...env,
         babel: {
            dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components'],
         },
      },
      argv
   )
   config.resolve.alias['react-native-maps'] = 'react-native-web-maps'
   config.resolve.alias['react-native'] = 'react-native-web'
   config.resolve.alias['react-native-banner-carousel'] =
      'react-native-web-banner-carousel'
   return config
}
