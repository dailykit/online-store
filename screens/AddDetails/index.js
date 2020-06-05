import { useLazyQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../../context/auth';
import { useCartContext } from '../../context/cart';
import { CUSTOMER_DETAILS } from '../../graphql';
import { height, width } from '../../utils/Scalaing';

const AddDetails = ({ route, navigation }) => {
   const { path } = route.params;

   const { setCustomerDetails } = useCartContext();
   const { user } = useAuth();

   // Query
   const [fetchDetails, { loading }] = useLazyQuery(CUSTOMER_DETAILS, {
      variables: {
         keycloakId: user.sub || user.userid,
         // clientId: CLIENTID,
      },
      onCompleted: data => {
         console.log('platform -> data', data);
         if (data.platform_customerByClients?.length) {
            setCustomerDetails(data.platform_customerByClients[0].customer);
            navigation.goBack();
         } else {
            console.log('No customer data found!');
            navigation.goBack();
         }
      },
      onError: error => {
         console.log(error);
         navigation.goBack();
      },
      fetchPolicy: 'cache-and-network',
   });

   if (loading)
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Spinner />
         </View>
      );

   return (
      <React.Fragment>
         <TouchableOpacity
            onPress={fetchDetails}
            style={{
               height: height * 0.07,
               padding: 10,
               flexDirection: 'row',
               alignItems: 'center',
               backgroundColor: '#fff',
            }}
         >
            <Ionicons name="ios-arrow-back" size={24} />
            <Text style={{ fontSize: 16, marginLeft: 12 }}>Go Back</Text>
         </TouchableOpacity>
         <View>
            <iframe
               src={`https://dailykey.netlify.app/${path || ''}`}
               title="Add Details"
               width={width}
               height={height}
            ></iframe>
         </View>
      </React.Fragment>
   );
};

export default AddDetails;
