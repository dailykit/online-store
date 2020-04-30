import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ComboProduct from './ComboProduct';
import CustomizableProductItem from './CustomizableProductItem';
import * as uuid from 'uuid';
import SimpleProductItem from './SimpleProductItem';
import InventoryProductItem from './InventoryProductItem';

const { width, height } = Dimensions.get('window');

export default class Card extends Component {
  state = {
    modalVisible: false,
    price: 2.5,
  };
  componentDidMount() {
    console.log(this.props.id, this.props.type);
  }
  setPrice = (price) => {
    this.setState({ price });
  };
  render() {
    return (
      <>
        <View style={styles.card_container}>
          <View style={styles.item_parent_container}>
            {this.props.type == 'comboProducts' && (
              <ComboProduct id={this.props.id} {...this.props} />
            )}
            {this.props.type == 'customizableProducts' && (
              <CustomizableProductItem
                independantItem
                id={this.props.id}
                {...this.props}
                setPrice={this.setPrice}
              />
            )}
            {this.props.type == 'simpleRecipeProducts' && (
              <SimpleProductItem
                independantItem
                id={this.props.id}
                {...this.props}
                setPrice={this.setPrice}
              />
            )}
            {this.props.type == 'inventoryProducts' && (
              <InventoryProductItem
                independantItem
                id={this.props.id}
                {...this.props}
                setPrice={this.setPrice}
              />
            )}
          </View>

          <View style={styles.bottom_container}>
            <View style={styles.price}>
              <Text style={styles.price_text}>$ {this.state.price}</Text>
            </View>
            <View style={styles.add_to_cart_container}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddToCart')}
                style={styles.button}
              >
                <Text style={styles.add_to_card_text}>
                  <Feather size={14} name='plus' /> ADD TO CART
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  card_container: {
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  card_title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_title_text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  is_customizable: {
    fontSize: 8,
    color: 'gray',
  },
  item_parent_container: {
    flex: 5,
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  item_details: {
    textAlign: 'right',
  },
  price: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  add_to_cart_container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#3fa4ff',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  add_to_card_text: {
    color: 'white',
    fontSize: 14,
  },
  price_text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
