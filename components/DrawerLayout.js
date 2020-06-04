import React from 'react';
import Modal from 'modal-enhanced-react-native-web';
import { StyleSheet, Text, View } from 'react-native';
import { useDrawerContext } from '../context/drawer';
import { height, width } from '../utils/Scalaing';

const DrawerLayout = ({ children }) => {
   const { drawerView, isDrawerOpen, setIsDrawerOpen } = useDrawerContext();

   const renderScreen = () => {
      switch (drawerView) {
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
         <View>{renderScreen()}</View>
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
});
