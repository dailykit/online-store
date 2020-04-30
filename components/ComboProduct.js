import React, { Component, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import CustomizableProductItem from './CustomizableProductItem';
import SimpleProductItem from './SimpleProductItem';

const { width, height } = Dimensions.get('window');

export default class ComboProduct extends Component {
  state = {
    selected: 0,
    modalVisible: false,
    isLoading: true,
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
          comboProduct(id: ${this.props.id}) {
            name
            comboProductComponents {
              customizableProductId
              label
              customizableProduct {
                customizableProductOptions {
                  simpleRecipeProduct {
                    name
                    default
                    simpleRecipeProductOptions {
                      price
                      simpleRecipeYieldId
                    }
                    simpleRecipe {
                      author
                      cookingTime
                      assets
                      cuisine
                      description
                      id
                      image
                      name
                      procedures
                      show
                      utensilsRequired
                    }
                  }
                 
                }
                name
                id
                default
              }
              inventoryProductId
              simpleRecipeProductId
              
            }
          }
        }
        `,
        }),
      });
      this.setState({ data: res.data.data.comboProduct });
      this.setState({ isLoading: false });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    let { data, isLoading } = this.state;
    if (isLoading || data == null || data == undefined) {
      return (
        <View style={styles.flexContainer}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.card_title}>
          <Text style={styles.card_title_text}>
            {data.name ? data.name : 'Resturant Name'}
          </Text>
          <Text style={styles.is_customizable}>Customizeable</Text>
        </View>
        <View style={styles.item_parent_container}>
          {data.comboProductComponents.map((data, _id) => {
            let last = false;
            let selected = this.state.selected;
            let isSelected = selected == _id ? true : false;
            if (_id == 2) {
              last = true;
            }
            if (data.customizableProductId) {
              return (
                <CustomizableProductItem
                  isSelected={isSelected}
                  _id={_id}
                  data={data}
                  setSelected={(index) => this.setState({ selected: index })}
                  isLast={last}
                  key={_id}
                  openModal={() => this.setState({ modalVisible: true })}
                  navigation={this.props.navigation}
                />
              );
            }
            if (data.simpleRecipeProductId) {
              return (
                <SimpleProductItem
                  isSelected={isSelected}
                  _id={_id}
                  data={data}
                  setSelected={(index) => this.setState({ selected: index })}
                  isLast={last}
                  key={_id}
                  openModal={() => this.setState({ modalVisible: true })}
                  navigation={this.props.navigation}
                  id={data.simpleRecipeProductId}
                />
              );
            }
            if (data.inventoryProductId) {
              return (
                <SimpleProductItem
                  isSelected={isSelected}
                  _id={_id}
                  data={data}
                  setSelected={(index) => this.setState({ selected: index })}
                  isLast={last}
                  key={_id}
                  openModal={() => this.setState({ modalVisible: true })}
                  navigation={this.props.navigation}
                  id={data.inventoryProductId}
                />
              );
            }
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  card_container: {
    height: height * 0.55,
    width,
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
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
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
