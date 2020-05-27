import React from 'react';
import { WebView } from 'react-native-webview';
import { height, width } from '../utils/Scalaing';
import { View, Text } from 'native-base';
import { useCartContext } from '../context/cart';
import { useLazyQuery } from '@apollo/react-hooks';
import { CUSTOMER_DETAILS } from '../graphql';
import { useAuth } from '../context/auth';
import { Spinner } from '@ui-kitten/components';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const AddDetails = ({ route }) => {
  const { path } = route.params;

  const { setCustomerDetails } = useCartContext();
  const { user } = useAuth();

  // Query
  const [fetchDetails, { loading }] = useLazyQuery(CUSTOMER_DETAILS, {
    variables: {
      keycloakId: user.sub || user.userid,
      // clientId: CLIENTID,
    },
    onCompleted: (data) => {
      console.log('platform -> data', data);
      if (data.platform_customerByClients?.length) {
        setCustomerDetails(data.platform_customerByClients[0].customer);
        navigation.goBack();
      } else {
        console.log('No customer data found!');
        navigation.goBack();
      }
    },
    onError: (error) => {
      console.log(error);
      navigation.goBack();
    },
  });

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );

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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          height: height * 0.07,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Ionicons name='ios-arrow-back' size={24} />
        <Text style={{ fontSize: 16, marginLeft: 12 }}>Go Back</Text>
      </TouchableOpacity>
      <ScrollView>
        <iframe
          src={`https://dailykey.netlify.app/${path || ''}`}
          title='Add Details'
          width={width}
          height={height}
        ></iframe>
      </ScrollView>
    </React.Fragment>
  );
};

export default AddDetails;
