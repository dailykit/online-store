import { AntDesign } from '@expo/vector-icons';
import React, { lazy } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCartContext } from '../../context/cart';
import { styles } from './styles';
import OrderDetails from '../../components/OrderDetails';

const OrderPlaced = ({ route, navigation }) => ({ route, navigation }) => {
  const { cart } = useCartContext();

  const { orderId } = route.params;

  const cartItems = cart?.cartInfo?.products;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.header}
      >
        <AntDesign name='closecircleo' size={24} color='black' />
      </TouchableOpacity>
      <ScrollView style={styles.conatiner}>
        <View style={styles.image_container}>
          <Image
            style={styles.image}
            source={require('../../assets/imgs/check-circle.png')}
          />
        </View>
        <Text style={styles.order_placed_title}>Order Placed!</Text>
        <Text
          style={[styles.time_text, { textAlign: 'center', marginBottom: 10 }]}
        >
          Your order has been place. Your receipt will shortly be emailed to
          you.
        </Text>
        <Text
          style={[styles.time_text, { textAlign: 'center', marginBottom: 10 }]}
        >
          Order ID: {orderId}
        </Text>
        <OrderDetails orderId={orderId} />
        {/* <View style={styles.title_container}>
         <View style={styles.title_container_left}>
           <Text style={styles.deliver_on_text}>Deliver on</Text>
           <Text style={styles.time_text}>Monday, Dec 9</Text>
         </View>
         <View style={styles.title_container_middle}>
           <Text style={[styles.time_text, { textAlign: 'center', flex: 1 }]}>
             9am - 10am
           </Text>
         </View>
         <View style={styles.title_container_right}>
           <View style={styles.edit}></View>
         </View>
       </View>
       <View style={[styles.title_container, { paddingLeft: 20 }]}>
         <Text style={styles.time_text}>
           123, some address, somewhere, california - 90922
         </Text>
       </View>
       <View style={styles.summary_title_conatiner}>
         <View style={styles.summary_title_conatiner_left}>
           <Text style={styles.summary_title_text}>Order Summary</Text>
         </View>
         <View style={styles.summary_title_conatiner_right}>
           <Text style={[styles.summary_title_text, { textAlign: 'right' }]}>
             3 products
           </Text>
         </View>
       </View>
       {cartItems.map((item, index) => {
         return <Summary useQuantity item={item} key={index} />;
       })}
       <BillingDetails />
       <View style={styles.send_details_container}>
         <TouchableOpacity style={styles.send_email_container}>
           <Text style={styles.send_email_container_text}>
             EMAIL RECIPE CARD
           </Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.download_recpie_card}>
           <Text style={styles.download_recpie_card_text}>
             DOWNLOAD RECIPE CARD
           </Text>
         </TouchableOpacity>
       </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderPlaced;
