import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const AddDetails = ({ params }) => {
  const { path } = params;

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
    <React.Fragment>
      {/* <TouchableOpacity
            onPress={fetchDetails}
            style={{
               height: height * 0.07,
               padding: 10,
               flexDirection: 'row',
               alignItems: 'center',
               backgroundColor: '#fff',
            }}
         ></TouchableOpacity> */}
      <ScrollView style={{ height: '100%' }}>
        <iframe
          src={`https://dailykey.netlify.app/${path || ''}`}
          title='Add Details'
          height={600}
          frameBorder='0'
        ></iframe>
      </ScrollView>
    </React.Fragment>
  );
};

export default AddDetails;
