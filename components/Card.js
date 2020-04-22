import React, { Component, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ServingSelect } from '../screens/AddToCart';
import CustomizableProduct from './CustomizableProduct';

const { width, height } = Dimensions.get('window');

export const Item = ({
  isLast,
  isSelected,
  setSelected,
  _id,
  openModal,
  navigation,
}) => {
  const [expanded, setExpanded] = useState(false);

  const [isSelectedInside, setisSelectedInside] = useState(0);
  if (!expanded) {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(_id);
          setSelected(_id);
        }}
        style={[
          styles.item_container,
          {
            borderBottomWidth: isLast ? 0 : 1,
            flex: isSelected ? 8 : 7,
            height: 'auto',
          },
        ]}
      >
        <View
          style={[
            styles.item_container_one,
            { display: isSelected ? 'flex' : 'none' },
          ]}
        >
          <Text style={styles.item_image_title}>Dal</Text>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.item_image}
          />
        </View>
        <View
          style={[
            styles.item_container_two,
            {
              paddingTop: isSelected ? 15 : 0,
              paddingLeft: isSelected ? 10 : 0,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.item_title}>Dal Makhani </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
              <Feather size={14} name='info' />
            </TouchableOpacity>
          </View>
          <Text style={styles.item_chef}>Gordon Ramsay</Text>
          <Text style={styles.item_category}>vegeterian</Text>
        </View>
        <View style={styles.item_container_three}>
          <View style={styles.item_three_upper}>
            <TouchableOpacity
              onPress={() => {
                setSelected(_id);
                setExpanded(true);
              }}
            >
              <Text style={styles.options_text}>3 options</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item_three_lower}>
            <Text style={styles.item_details}>
              Mealkit | <Feather name='user' />{' '}
              <Text style={{ fontWeight: 'bold' }}>1</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  if (expanded && isSelected) {
    return (
      <View>
        <Text style={styles.item_image_title}>Dal</Text>
        <View style={styles.item_three_upper}>
          <TouchableOpacity
            onPress={() => {
              setSelected(_id);
              setExpanded(true);
            }}
          >
            <Text style={styles.options_text}>3 options</Text>
          </TouchableOpacity>
        </View>
        <CustomizableProduct />
      </View>
    );
  }
};

export default class Card extends Component {
  state = {
    selected: 0,
    modalVisible: false,
  };
  render() {
    return (
      <>
        <View style={styles.card_container}>
          <View style={styles.card_title}>
            <Text style={styles.card_title_text}>
              Dal Makhani with Brown Rice
            </Text>
            <Text style={styles.is_customizable}>Customizeable</Text>
          </View>
          <View style={styles.item_parent_container}>
            {[1, 2, 3].map((data, _id) => {
              let last = false;
              let selected = this.state.selected;
              let isSelected = selected == _id ? true : false;
              if (_id == 2) {
                last = true;
              }
              return (
                <Item
                  isSelected={isSelected}
                  _id={_id}
                  setSelected={(index) => this.setState({ selected: index })}
                  isLast={last}
                  key={_id}
                  openModal={() => this.setState({ modalVisible: true })}
                  navigation={this.props.navigation}
                />
              );
            })}
          </View>

          <View style={styles.bottom_container}>
            <View style={styles.price}>
              <Text style={styles.price_text}>$ 2.50</Text>
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
  item_container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 5,
  },
  item_container_one: {
    flex: 2,
    position: 'relative',
    paddingTop: 20,
  },
  item_container_two: {
    flex: 4,
    paddingTop: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  item_container_three: {
    flex: 2,
    justifyContent: 'space-between',
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  item_image_title: {
    position: 'absolute',
    zIndex: 8,
    color: 'gray',
    fontWeight: 'bold',
  },
  item_image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
  },
  item_title: {
    fontSize: 14,
  },
  item_chef: {
    color: 'gray',
    fontSize: 10,
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 70,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 10,
  },
  options_text: {
    color: '#3fa4fd',
    textAlign: 'right',
    fontSize: 12,
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
