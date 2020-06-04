import React from 'react';
import Modal from 'modal-enhanced-react-native-web';
import { StyleSheet, Text, View } from 'react-native';
import { useDrawerContext } from '../context/drawer';
import { height, width } from '../utils/Scalaing';

// Screens
import ProfileScreen from '../screens/ProfileScreen';
import EditAddress from '../screens/EditAddress';
import SelectPaymentMethod from '../screens/SelectPaymentMethod';

const DrawerLayout = () => {
   const { drawerView, isDrawerOpen, setIsDrawerOpen } = useDrawerContext();

   const renderScreen = () => {
      console.log(drawerView);
      switch (drawerView) {
         case 'Profile':
            return <ProfileScreen />;
         case 'EditAddress':
            return <EditAddress />;
         case 'SelectPaymentMethod':
            return <SelectPaymentMethod />;
         default:
            return <Text>Oops!</Text>;
      }
   };

   return (
      <Modal
         style={styles.modal}
         isVisible={isDrawerOpen}
         onBackdropPress={() => {
            setIsDrawerOpen(false);
         }}
      >
         <View style={styles.container}>
            <View style={styles.component}>{renderScreen()}</View>
         </View>
      </Modal>
   );
};

export default DrawerLayout;

const styles = StyleSheet.create({
   modal: {
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
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
   },
   component: {
      maxWidth: 768,
      height: '100%',
      position: 'relative',
   },
});
