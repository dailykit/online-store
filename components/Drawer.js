import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'modal-enhanced-react-native-web';
import AddToCart from '../screens/AddToCart';
import { height, width } from '../utils/Scalaing';

export const Drawer = ({
   navigation,
   data,
   id,
   type,
   isVisible,
   setIsModalVisible,
}) => {
   if (!isVisible) return null;
   return (
      <Modal
         style={width > 1280 ? styles.modal : styles.phoneModal}
         isVisible={isVisible}
         onBackdropPress={() => {
            console.log('here');
            setIsModalVisible(false);
         }}
      >
         <View style={width > 1280 ? styles.container : styles.phoneContainer}>
            <View
               style={width > 1280 ? styles.component : styles.phoneComponent}
            >
               <AddToCart
                  setIsModalVisible={setIsModalVisible}
                  navigation={navigation}
                  id={id}
                  type={type}
                  data={data}
               />
            </View>
         </View>
      </Modal>
   );
};

const styles = StyleSheet.create({
   // modal: {
   //    height: height * 0.8,
   //    width: width > 1280 ? 1280 : width,
   //    position: 'absolute',
   //    bottom: 0,
   //    borderTopLeftRadius: 10,
   //    borderTopRightRadius: 10,
   //    overflow: 'hidden',
   //    marginHorizontal: 'auto',
   // },
   // container: {
   //    flex: 1,
   //    width: '100%',
   //    backgroundColor: '#fff',
   //    alignItems: 'center',
   // },
   // component: {
   //    width: width > 768 ? 768 : width,
   //    maxWidth: 768,
   //    height: '100%',
   //    position: 'relative',
   // },
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
      height: height * 0.9,
      width: width > 1280 ? 1280 : width,
      backgroundColor: '#fff',
      // alignItems: 'center',
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
      width: 1280,
      height: '100%',
      position: 'relative',
      marginHorizontal: 'auto',
   },
   phoneComponent: {
      width,
      height: '100%',
      position: 'relative',
   },
});
