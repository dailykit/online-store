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

import { GET_MENU } from '../gql/Queries';

const { width, height } = Dimensions.get('screen');
import Card from '../components/Card';
import axios from 'axios';
import { Datepicker } from '@ui-kitten/components';
import Cart from '../components/Cart';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';

class Home extends React.Component {
  state = {
    loading: true,
    selectedIndex: new IndexPath(1),
    picker: null,
    data: null,
  };
  async componentDidMount() {
    try {
      let res = await axios({
        url: 'https://dailykitdatahub.herokuapp.com/v1/graphql',
        method: 'POST',
        data: JSON.stringify({
          query: `
        {
          getMenu(year: 2020, month: 5, day: 28) {
            name
            comboProducts 
            customizableProducts 
            inventoryProducts
            simpleRecipeProducts
          }
        }
        `,
        }),
      });
      let picker = [];
      let data = {};
      res.data.data.getMenu.forEach((category, _id) => {
        picker.push(category.name);
        data[category.name] = {};
        Object.keys(category).forEach((key) => {
          if (key != 'name') {
            data[category.name][key] = category[key];
          }
        });
      });
      this.setState({ picker, data });
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
                value={this.state.picker[this.state.selectedIndex.row]}
                onSelect={(selectedIndex) => {
                  this.setState({ selectedIndex });
                  console.log(selectedIndex.equals());
                }}
              >
                {this.state.picker.map((title, key) => (
                  <SelectItem key={key} title={title} />
                ))}
              </Select>
            </View>
          </View>
          {Object.keys(this.state.data[this.state.picker[0]]).map(
            (type, _id) => {
              // this data var is like comboprod : [1,2,3], inventory prod, etc..
              // now loop on this data

              return this.state.data[this.state.picker[0]][type].map((id) => (
                <Card {...this.props} type={type} key={id} id={id} />
              ));
            }
          )}
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
