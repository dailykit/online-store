import { Ionicons } from '@expo/vector-icons';
import React, { lazy } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BillingDetails from '../../components/BillingDetails';
import { CartSummary } from '../../components/Cart';
import {
  DefaultAddressFloater,
  DefaultPaymentFloater,
} from '../../components/DefaultFloater';
import HeaderBack from '../../components/HeaderBack';

const Summary = lazy(() => import('../../components/Summary'));
import { useCartContext } from '../../context/cart';
import { height } from '../../utils/Scalaing';
import { styles } from './styles';

const OrderSummary = ({ navigation, ...restProps }) => {
  const { cart } = useCartContext();

  let cartItems = cart?.cartInfo?.products;
  console.log('OrderSummary -> cartItems', cartItems);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBack title='Go Back' navigation={navigation} />
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.title_container}>
            <View style={styles.title_container_left}>
              <Text style={styles.deliver_on_text}>Deliver on</Text>
              <Text style={styles.time_text}>Monday, Dec 9</Text>
            </View>
            <View style={styles.title_container_middle}>
              <Text
                style={[styles.time_text, { textAlign: 'center', flex: 1 }]}
              >
                9am - 10am
              </Text>
            </View>
            <View style={styles.title_container_right}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditAddressScreen')}
                style={styles.edit}
              >
                <Text style={styles.edit_text}>edit{'  '}</Text>
                <Ionicons
                  style={{ paddingTop: 2 }}
                  size={16}
                  name='ios-arrow-forward'
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.summary_title_conatiner}>
            <View style={styles.summary_title_conatiner_left}>
              <Text style={styles.summary_title_text}>Order Summary</Text>
            </View>
            <View style={styles.summary_title_conatiner_right}>
              <Text style={[styles.summary_title_text, { textAlign: 'right' }]}>
                {cartItems?.length} products
              </Text>
            </View>
          </View>
          {cartItems?.map((item, index) => {
            return <Summary item={item} key={index} />;
          })}
          <BillingDetails />
          <DefaultPaymentFloater navigation={navigation} />
          <DefaultAddressFloater navigation={navigation} />
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      <CartSummary
        {...restProps}
        navigation={navigation}
        text='CONFIRM AND PAY'
        to='PaymentProcessing'
        pay
      />
    </SafeAreaView>
  );
};

export default OrderSummary;
