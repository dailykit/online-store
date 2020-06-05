import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ServingSelect from '../ServingSelect';
import { stylesExpanded as styles } from './styles';
const Item = ({
  _id,
  navigation,
  setExpanded,
  data,
  independantItem,
  numberOfOptions,
  tunnelItem,
  setproductOptionId,
}) => {
  const [typeSelected, setTypeSelected] = useState('mealKit');
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={styles.item_title}
                  >{`${simpleRecipeProduct?.name} `}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Modal', {
                        recipeId: simpleRecipeProduct?.simpleRecipe?.id,
                      })
                    }
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
                {simpleRecipeProduct?.simpleRecipeProductOptions
                  ?.filter((serving) => serving.type === typeSelected)
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
                          typeSelected === 'mealKit'
                            ? 'Meal Kit'
                            : 'Ready To Eat'
                        }
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
                  })}
              </View>
            )}
          </>
        );
      })}
    </View>
  );
};

export default Item;
