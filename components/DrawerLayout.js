import React from 'react';
import Modal from 'modal-enhanced-react-native-web';
import { StyleSheet, Text, View } from 'react-native';
import { useDrawerContext } from '../context/drawer';
import { height, width } from '../utils/Scalaing';

// Screens
import ProfileScreen from '../screens/ProfileScreen';
import EditAddress from '../screens/EditAddress';
import SelectPaymentMethod from '../screens/SelectPaymentMethod';
import OrderHistory from '../screens/OrderHistory';
import AddDetails from '../screens/AddDetails';
import SafetyScreen from '../screens/SafetyScreen';
import { useCartContext } from '../context/cart';
import { useLazyQuery } from '@apollo/react-hooks';
import { CUSTOMER_DETAILS } from '../graphql';
import { useAuth } from '../context/auth';
import Fulfillment from './Fulfillment';

const DrawerLayout = () => {
  const {
    drawerView,
    isDrawerOpen,
    setIsDrawerOpen,
    params,
  } = useDrawerContext();
  const { setCustomerDetails } = useCartContext();
  const { user } = useAuth();

  // Query
  const [fetchDetails] = useLazyQuery(CUSTOMER_DETAILS, {
    variables: {
      keycloakId: user.sub || user.userid,
    },
    onCompleted: (data) => {
      console.log('platform -> data', data);
      if (data.platform_customerByClients?.length) {
        setCustomerDetails(data.platform_customerByClients[0].customer);
      } else {
        console.log('No customer data found!');
      }
    },
    onError: (error) => {
      console.log(error);
    },
    fetchPolicy: 'cache-and-network',
  });

  //Effects
  React.useEffect(() => {
    if (!isDrawerOpen && drawerView === 'AddDetails') {
      fetchDetails();
    }
  }, [isDrawerOpen]);

  // Handlers
  const renderScreen = () => {
    switch (drawerView) {
      case 'EditAddress':
        return <EditAddress />;
      case 'SelectPaymentMethod':
        return <SelectPaymentMethod />;
      case 'AddDetails':
        return <AddDetails params={params} />;
      case 'Safety':
        return <SafetyScreen />;
      case 'Fulfillment':
        return <Fulfillment />;
      default:
        return <Text>Oops! No such component.</Text>;
    }
  };

  return (
    <Modal
      style={width > 1280 ? styles.modal : styles.phoneModal}
      isVisible={isDrawerOpen}
      onBackdropPress={() => {
        setIsDrawerOpen(false);
      }}
    >
      <View style={width > 1280 ? styles.container : styles.phoneContainer}>
        <View style={width > 1280 ? styles.component : styles.phoneComponent}>
          {renderScreen()}
        </View>
      </View>
    </Modal>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  phoneModal: {
    height: height * 0.8,
    width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  container: {
    height: height * 0.8,
    width: width > 1280 ? 640 : width,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 'auto',
  },
  phoneContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  component: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  phoneComponent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});