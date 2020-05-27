import React from 'react';
import { WebView } from 'react-native-webview';
import { height, width } from '../utils/Scalaing';
import { View } from 'native-base';

const AddDetails = ({ route }) => {
  const { path } = route.params;

  return (
    // <WebView
    //   source={{ uri: `https://dailykey.netlify.app` }}
    //   javaScriptEnabled={true}
    //   scalesPageToFit={true}
    //   style={{
    //     marginTop: 20,
    //     borderStyle: 'solid',
    //     borderWidth: 2,
    //     borderColor: '#ff0000',
    //   }}
    // />
    <View>
      <iframe
        src={`https://dailykey.netlify.app/${path || ''}`}
        title='iframe Example 1'
        width={width}
        height={height}
      ></iframe>
    </View>
  );
};

export default AddDetails;
