import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import cooking from '../assets/imgs/cooking.png';
import EStyleSheet from 'react-native-extended-stylesheet';

import TabsNew from './Tabs';

import { Tabs, Tab } from 'native-base';

import { height, width } from '../utils/Scalaing';

export default class ModalContent extends Component {
  render() {
    let { data, name, author } = this.props.route.params;
    console.log(data);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.title_container}>
          <View style={styles.details}>
            <Text style={styles.item_title}>{name}</Text>
            <Text style={styles.item_chef}>{author}</Text>
            <Text style={styles.item_category}>vegeterian</Text>
          </View>
          <View style={styles.close_container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <AntDesign size={30} name='close' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.image_cover_container}>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.image_cover}
          />
        </View>
        <TabsNew data={data?.tags} />
        <View style={styles.desc}>
          <Text style={styles.desc_content}>{data.description}.</Text>
          <View style={styles.cooking_container}>
            <Image source={cooking} style={styles.cooking_img} />
            <Text style={styles.desc_time}> {data.cookingTime}</Text>
          </View>
          <Text style={styles.desc_equipments}>
            Equipments needed: Pan, more pans
          </Text>
          <Text style={styles.desc_allergy}>
            Alergans: Allergan1, Allergan 2
          </Text>
        </View>
        <Tabs
          tabBarUnderlineStyle={{
            backgroundColor: 'white',
            borderColor: 'black',
          }}
          tabBarBackgroundColor='#fff'
        >
          <Tab tabBarBackgroundColor='#fff' heading='Ingredients'>
            {[1, 2, 3].map((item, key) => (
              <View style={styles.ing_container} key={key}>
                <Image
                  source={{
                    uri:
                      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                  }}
                  style={styles.ing_img}
                />
                <Text style={styles.ing_text}>Boiled and mashed Potato</Text>
              </View>
            ))}
          </Tab>
          <Tab heading='Procedure'>
            <Text style={styles.procedure}>` 1. Lorem ipsum `</Text>
            <Text style={styles.procedure}>
              ` 2. Lorem ipsum dnbfkj dfiusabdfks dfsudfb skdfsiu dfisgbdf`
            </Text>
            <Text style={styles.procedure}>` 3. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 4. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 5. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 6. Lorem ipsum `</Text>
          </Tab>
          <Tab heading='Nuritional Values'>
            <Text style={styles.procedure}>` 1. Lorem ipsum `</Text>
            <Text style={styles.procedure}>
              ` 2. Lorem ipsum dnbfkj dfiusabdfks dfsudfb skdfsiu dfisgbdf`
            </Text>
            <Text style={styles.procedure}>` 3. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 4. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 5. Lorem ipsum `</Text>
            <Text style={styles.procedure}>` 6. Lorem ipsum `</Text>
          </Tab>
        </Tabs>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item_title: {
    fontSize: 16,
  },
  item_chef: {
    color: 'gray',
    fontSize: 12,
  },
  item_category: {
    backgroundColor: '#56b783',
    color: 'white',
    width: 70,
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 12,
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
    width,
  },
  image_cover: {
    flex: 1,
    height: null,
    width: null,
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
  },
});
