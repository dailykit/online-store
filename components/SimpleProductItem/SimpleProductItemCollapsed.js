import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import ServingSelect from '../ServingSelect';
import { useAppContext } from '../../context/app';

const SimpleProductItemCollapsed = ({
  navigation,
  data: simpleRecipeProduct,
  label,
  tunnelItem,
  setProductOptionId,
  isSelected,
  showInfo,
}) => {
  const [typeSelected, setTypeSelected] = useState('mealKit');
  const [servingIndex, setServingIndex] = useState(0);

  const { visual } = useAppContext();

  return (
    <>
      {showInfo && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductPage', {
              id: simpleRecipeProduct.id,
              type: 'simpleRecipeProduct',
            });
          }}
          style={[
            styles.item_container,
            {
              borderBottomWidth: 1,
              flex: 8,
              height: 'auto',
            },
          ]}
        >
          <View style={styles.item_container}>
            <View style={styles.item_container_one}>
              <Image
                source={{
                  uri: simpleRecipeProduct?.assets?.images[0]
                    ? simpleRecipeProduct?.assets?.images[0]
                    : 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                }}
                style={styles.item_image}
              />
            </View>
            <View
              style={[
                styles.item_container_two,
                {
                  paddingTop: 15,
                  paddingLeft: 10,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  minHeight: 68,
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={[styles.item_title, { color: visual.color }]}
                >{`${simpleRecipeProduct.name} `}</Text>
              </View>
              <View style={styles.item_three_lower}>
                <Text
                  style={[
                    styles.item_details,
                    { fontWeight: 'normal', fontSize: 18 },
                  ]}
                >
                  Mealkit
                </Text>
                <Text style={styles.item_chef}>
                  {simpleRecipeProduct?.simpleRecipe?.author}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {tunnelItem && isSelected && (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.type_container}>
            <View style={{ flex: 1 }}></View>
            <View style={styles.type_container_right}>
              <TouchableOpacity
                style={[
                  styles.type_button,
                  typeSelected === 'mealKit'
                    ? styles.selected_type_conatiner
                    : {},
                ]}
                onPress={() => setTypeSelected('mealKit')}
              >
                <Text style={styles.type_text}>Meal Kit</Text>
                {typeSelected === 'mealKit' && (
                  <View style={styles.done_container}>
                    <MaterialIcons name='done' size={16} color='#fff' />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTypeSelected('readyToEat')}
                style={[
                  styles.type_button,
                  typeSelected === 'readyToEat'
                    ? styles.selected_type_conatiner
                    : {},
                ]}
              >
                <Text style={styles.type_text}>Ready To Eat</Text>
                {typeSelected === 'readyToEat' && (
                  <View style={[styles.done_container]}>
                    <MaterialIcons name='done' size={16} color='#fff' />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.item_chef}>Avaliable Servings:</Text>
          {simpleRecipeProduct.simpleRecipeProductOptions
            .filter((serving) => serving.type === typeSelected)
            .map((item_data, key) => {
              return (
                <ServingSelect
                  key={key}
                  index={key + 1}
                  isSelected={servingIndex == key ? true : false}
                  setServingIndex={(index) => setServingIndex(index)}
                  size={item_data.simpleRecipeYield.yield.serving}
                  price={item_data.price[0].value}
                  display={
                    typeSelected === 'mealKit' ? 'Meal Kit' : 'Ready To Eat'
                  }
                  type={item_data.type}
                  setproductOptionId={setProductOptionId}
                  id={item_data.id}
                />
              );
            })}
        </View>
      )}
    </>
  );
};

export default SimpleProductItemCollapsed;
