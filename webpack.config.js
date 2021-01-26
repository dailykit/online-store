const path = require('path')
const createExpoWebpackConfigAsync = require('@expo/webpack-config')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//    .BundleAnalyzerPlugin

module.exports = async function (env, argv) {
   const config = await createExpoWebpackConfigAsync(env, argv)
   config.resolve.alias = {
      'react-native-maps': 'react-native-web-maps',
      'react-native': 'react-native-web',
      'react-native-banner-carousel': 'react-native-web-banner-carousel',
   }
   config.output = {
      filename: '[name].[hash:6].bundle.js',
      path: path.resolve(__dirname, 'web-build/'),
      publicPath: '/store',
   }
   config.mode =
      process.env.NODE_ENV === 'development' ? 'development' : 'production'
   config.optimization = {
      usedExports: true,
   }
   // config.plugins = [
   //    new BundleAnalyzerPlugin({
   //       generateStatsFile: true,
   //    }),
   // ]
   return config
}
