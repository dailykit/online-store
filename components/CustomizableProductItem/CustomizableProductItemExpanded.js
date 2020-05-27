import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

import ServingSelect from '../ServingSelect';

import { height, width } from '../../utils/Scalaing';

const Item = ({
  _id,
  isLast,
  key,
  openModal,
  navigation,
  setExpanded,
  setSelected,
  data,
  independantItem,
  numberOfOptions,
  tunnelItem,
  setproductOptionId,
}) => {
  const [typeSelected, setTypeSelected] = useState(true);
  const [servingIndex, setServingIndex] = useState(0);
  const [isSelected, setisSelected] = useState(0);

  return (
    <View key={_id} style={styles.container}>
      <Text style={styles.item_image_title}>Dal</Text>
      <View style={styles.item_three_upper}>
        <TouchableOpacity
          onPress={() => {
            if (!tunnelItem) {
              if (!independantItem) {
                setExpanded(false);
              } else {
                setExpanded(false);
              }
            }
          }}
        >
          <Text style={styles.options_text}>
            {numberOfOptions} options <Ionicons name='ios-arrow-up' />
          </Text>
        </TouchableOpacity>
      </View>

      {data.map((item, _key) => {
        let simpleRecipeProduct = item?.simpleRecipeProduct;
        return (
          <>
            <TouchableOpacity
              key={_key}
              onPress={() => {
                setisSelected(_key);
                setproductOptionId(
                  simpleRecipeProduct?.simpleRecipeProductOptions[0]?.id,
                  simpleRecipeProduct?.simpleRecipeProductOptions[0]?.price[0]
                    ?.value,
                  simpleRecipeProduct?.id,
                  simpleRecipeProduct?.name
                );
              }}
              style={[
                styles.item_container,
                {
                  flex: isSelected ? 8 : 7,
                  borderColor: isSelected == _key ? '#3fa4ff' : '#ececec',
                  borderBottomColor: isSelected == _key ? '#3fa4ff' : '#ececec',
                },
              ]}
            >
              <View style={[styles.item_container_one]}>
                <Image
                  source={{
                    uri: simpleRecipeProduct?.assets?.images[0]
                      ? simpleRecipeProduct?.assets?.images[0]
                      : 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                  }}
                  style={styles.item_image}
                />
              </View>
              <View style={[styles.item_container_two]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={styles.item_title}
                  >{`${simpleRecipeProduct?.name} `}</Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Modal')}
                  >
                    <Feather size={14} name='info' />
                  </TouchableOpacity>
                </View>
                <Text style={styles.item_chef}>
                  {simpleRecipeProduct?.simpleRecipe?.author}
                </Text>
                <Text style={styles.item_category}>vegeterian</Text>
              </View>
              <View style={styles.item_container_three}>
                <View style={styles.item_three_upper}>
                  {isSelected == _key && (
                    <View style={styles.done_container}>
                      <MaterialIcons name='done' size={16} color='#fff' />
                    </View>
                  )}
                </View>
                <View style={styles.item_three_lower}>
                  <Text style={styles.item_details}>
                    ${' '}
                    {simpleRecipeProduct?.simpleRecipeProductOptions[0]
                      ? simpleRecipeProduct?.simpleRecipeProductOptions[0]
                          ?.price[0]?.value
                      : 'bad data'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {isSelected == _key && tunnelItem && (
              <View style={{ paddingHorizontal: 20 }}>
                <View style={styles.type_container}>
                  <View style={{ flex: 1 }}></View>
                  <View style={styles.type_container_right}>
                    <TouchableOpacity
                      style={[
                        styles.type_button,
                        typeSelected ? styles.selected_type_conatiner : {},
                      ]}
                      onPress={() => setTypeSelected(!typeSelected)}
                    >
                      <Text style={styles.type_text}>Meal Kit</Text>
                      {typeSelected && (
                        <View style={styles.done_container}>
                          <MaterialIcons name='done' size={16} color='#fff' />
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setTypeSelected(!typeSelected)}
                      style={[
                        styles.type_button,
                        !typeSelected ? styles.selected_type_conatiner : {},
                      ]}
                    >
                      <Text style={styles.type_text}>Ready To Eat</Text>
                      {!typeSelected && (
                        <View style={[styles.done_container]}>
                          <MaterialIcons name='done' size={16} color='#fff' />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.item_chef}>Avaliable Servings:</Text>
                {simpleRecipeProduct?.simpleRecipeProductOptions?.map(
                  (item_data, key) => {
                    return (
                      <ServingSelect
                        key={key}
                        index={key + 1}
                        isSelected={servingIndex == key ? true : false}
                        setServingIndex={(index) => setServingIndex(index)}
                        size={item_data.simpleRecipeYield.yield.serving}
                        price={item_data.price[0].value}
                        display={typeSelected ? 'Meal Kit' : 'Ready To Eat'}
                        type={item_data?.type}
                        customizableProduct
                        name={simpleRecipeProduct?.name}
                        simpleRecipeProductId={simpleRecipeProduct?.id}
                        setproductOptionId={(
                          id,
                          price,
                          simpleRecipeProductId,
                          name
                        ) =>
                          setproductOptionId(
                            id,
                            price,
                            simpleRecipeProductId,
                            name
                          )
                        }
                        id={simpleRecipeProduct?.id}
                      />
                    );
                  }
                )}
              </View>
            )}
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  item_container: {
    flexDirection: 'row',
    paddingBottom: 5,
    borderWidth: 1,
    marginBottom: 2,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 4,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    height: width < height ? height * 0.15 : height * 0.35,
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
    paddingTop: 15,
    paddingLeft: 10,
  },
  item_container_three: {
    flex: 2,
    paddingTop: 15,
  },
  selected_type_conatiner: {
    backgroundColor: '#fff',
    borderRadius: 1,
    borderWidth: 2,
    borderColor: '#d9d9d9',
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
    paddingLeft: 10,
    paddingTop: 20,
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
    paddingBottom: 10,
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
  details: {
    justifyContent: 'center',
  },
  type_container: {
    height: height * 0.1,
    flexDirection: 'row',
  },
  type_container_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  type_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
  },
  done_container: {
    backgroundColor: '#3fa4ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    height: 20,
    width: 20,
  },
  item_three_upper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  item_three_lower: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default Item;
