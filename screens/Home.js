import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';

const { width, height } = Dimensions.get('screen');
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import axios from 'axios';
import { Picker } from 'native-base';
import { Datepicker } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Cart from '../components/Cart';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

class Home extends React.Component {
  state = {
    loading: true,
    selectedIndex: new IndexPath(1),
  };
  async componentDidMount() {
    try {
      // let res = await axios.get(
      //   "http://restaurantmealkits.com/api/menu/5e84484b6ab57abd3498d508"
      // );
      // let res_name = res.data.data.name
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const data = ['Breakfast', 'Lunch', 'Dinner'];
    if (this.state.loading) {
      return (
        <View style={styles.flexContainer}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.home}>
        {/* <Tabs /> */}
        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.img_container}>
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
              }}
              style={styles.cover_image}
            />
          </View>
          <View style={styles.picker_container}>
            <View style={styles.picker_placeholder}>
              <Datepicker
                date={new Date()}
                onSelect={(date) => console.log(date)}
              />
            </View>
            <View style={styles.picker_placeholder}>
              <Select
                selectedIndex={this.state.selectedIndex}
                value={data[this.state.selectedIndex.row]}
                onSelect={(selectedIndex) => {
                  this.setState({ selectedIndex });
                  console.log(selectedIndex.equals());
                }}
              >
                <SelectItem title='Wallet' />
                <SelectItem title='ATM Card' />
                <SelectItem title='Debit Card' />
                <SelectItem title='Credit Card' />
                <SelectItem title='Net Banking' />
              </Select>
            </View>
          </View>
          {[1, 2, 3].map((data, _id) => {
            return <Card {...this.props} key={_id} data={data} />;
          })}
          <View style={{ height: height * 0.08 }} />
        </ScrollView>
        <Cart {...this.props} text='Checkout' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  img_container: {
    height: height * 0.2,
    width,
  },
  cover_image: {
    flex: 1,
    resizeMode: 'cover',
    height: null,
    width: null,
  },
  picker_container: {
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  picker_placeholder: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
