import { useQuery } from '@apollo/react-hooks';
import { AntDesign } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import { Tab, Tabs } from 'native-base';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import cooking from '../assets/imgs/cooking.png';
import { SIMPLE_RECIPE, INVENTORY_PRODUCT } from '../graphql';
import { height, width } from '../utils/Scalaing';
import TabsNew from './Tabs';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Header } from '.';

const ModalContent = ({ route, navigation }) => {
  let { recipeId } = route.params;

  const { data: { simpleRecipe = {} } = {}, loading, error } = useQuery(
    SIMPLE_RECIPE,
    {
      variables: {
        id: recipeId,
      },
    }
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner />
      </View>
    );
  }
  // console.log(type);
  // if (type !== 'inventory') {
  //   return (
  //     <View style={styles.center}>
  //       <Text>Oops! We could not get recipe details. Check again later.</Text>
  //     </View>
  //   );
  // }

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: width > 768 ? 'row' : 'column',
          }}
        >
          <View
            style={[
              styles.image_cover_container,
              {
                flex: 1,
              },
            ]}
          >
            <Image
              source={{
                uri: simpleRecipe?.assets?.images[0]
                  ? simpleRecipe?.assets?.images[0]
                  : 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
              }}
              style={styles.image_cover}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={styles.title_container}>
              <View style={styles.details}>
                <Text style={styles.item_title}>{simpleRecipe?.name}</Text>
                <Text style={styles.item_chef}>{simpleRecipe?.author}</Text>
                <Text style={styles.item_category}>{simpleRecipe?.type}</Text>
              </View>
              {/* <View style={styles.close_container}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <AntDesign size={30} name='close' />
                </TouchableOpacity>
              </View> */}
            </View>
            <View style={styles.desc}>
              <Text style={styles.desc_content}>
                {simpleRecipe?.description}.
              </Text>
              <View style={styles.cooking_container}>
                <Image source={cooking} style={styles.cooking_img} />
                <Text style={styles.desc_time}>
                  Cooking Time: {simpleRecipe?.cookingTime} mins.
                </Text>
              </View>
              <Text style={styles.desc_equipments}>
                Equipments needed: {simpleRecipe?.utensils?.join(', ')}
              </Text>
              {/* <Text style={styles.desc_allergy}>
            Alergans: Allergan1, Allergan 2
          </Text> */}
            </View>
            <Tabs
              tabBarUnderlineStyle={{
                backgroundColor: 'white',
                borderColor: 'black',
              }}
              tabBarBackgroundColor='#fff'
            >
              <Tab tabBarBackgroundColor='#fff' heading='Ingredients'>
                {simpleRecipe?.ingredients?.map((ing, key) => (
                  <View style={styles.ing_container} key={key}>
                    <Image
                      source={{
                        uri: ing.image,
                      }}
                      style={styles.ing_img}
                    />
                    <Text style={styles.ing_text}>
                      {ing.name} - {ing.ingredientProcessing.processingName}
                    </Text>
                  </View>
                ))}
              </Tab>
              <Tab heading='Procedure'>
                {simpleRecipe?.procedures?.map((procedure, key) => (
                  <View style={styles.procedure} key={key}>
                    <Text style={styles.procedureTitle}>
                      {procedure?.title}
                    </Text>
                    {procedure?.steps?.map((step, key) => (
                      <View style={styles.step} key={key}>
                        <Text style={styles.stepTitle}>
                          {key + 1}. {step?.title}
                        </Text>
                        <Text style={styles.stepDesc}>{step?.description}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </Tab>
              {/* <Tab heading='Nuritional Values'>
            <Text style={styles.procedure}>` 1. Lorem ipsum `</Text>
            <Text style={styles.procedure}>
              ` 2. Lorem ipsum dnbfkj dfiusabdfks dfsudfb skdfsiu dfisgbdf`
            </Text>
            <Text style={styles.procedure}>` 3. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 4. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 5. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 6. Lorem ipsum `</Text>
          </Tab> */}
            </Tabs>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ModalContent;

const styles = EStyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1 },
  item_title: {
    fontSize: '$l',
  },
  item_chef: {
    color: 'gray',
    fontSize: '$m',
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 100,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: '$m',
  },
  title_container: {
    height: 100,
    flexDirection: 'row',
    padding: 20,
  },
  close_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  details: {
    flex: 1,
  },
  image_cover_container: {
    height: height * 0.7,
    width: width > 1280 ? 1280 : width,
  },
  image_cover: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
  desc: {
    padding: 20,
  },
  cooking_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cooking_img: {
    height: 20,
    resizeMode: 'contain',
  },
  desc_content: {
    marginBottom: 20,
  },
  desc_equipments: {
    marginBottom: 20,
  },
  ing_img: {
    height: 50,
    width: 80,
  },
  ing_container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  ing_text: {
    paddingLeft: 10,
  },
  procedure: {
    margin: 10,
    color: '#666',
  },
  procedureTitle: {
    fontWeight: 500,
    fontSize: '$m',
  },
  step: {
    marginHorizontal: 8,
  },
  stepTitle: {
    fontWeight: 500,
    fontSize: '$m',
  },
  stepDesc: {
    marginLeft: 14,
  },
});
