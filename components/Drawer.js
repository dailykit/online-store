import Modal from 'modal-enhanced-react-native-web';
import React from 'react';
import { StyleSheet } from 'react-native';
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
         style={styles.container}
         isVisible={isVisible}
         onBackdropPress={() => {
            console.log('here');
            setIsModalVisible(false);
         }}
      >
         <AddToCart
            setIsModalVisible={setIsModalVisible}
            navigation={navigation}
            id={id}
            type={type}
            data={data}
         />
      </Modal>
   );
};

const styles = StyleSheet.create({
   container: {
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
