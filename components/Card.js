import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useAppContext } from '../context/app';
import { useAuth } from '../context/auth';
import { width } from '../utils/Scalaing';
import ComboProduct from './ComboProduct';
import CustomizableProductItem from './CustomizableProductItem';
import { Drawer } from './Drawer';
import InventoryProductItem from './InventoryProductItem';
import SimpleProductItem from './SimpleProductItem';

const Card = ({ id, type, navigation, label, product, ...restProps }) => {
  const [price, setPrice] = useState(0);
  const [cardItem, setcardItem] = useState(null); // obj to push to jaguar
  const [cardData, setcardData] = useState(null); // obj to pass to add to cart modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { visual } = useAppContext();
  const { isAuthenticated, login } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      {cardData && (
        <Drawer
          isVisible={isModalVisible}
          navigation={navigation}
          data={cardData}
          type={cardData.__typename.split('_')[1]}
          id={cardData.id}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      <View
        style={[
          styles.card_container,
          {
            shadowColor: '#666',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: isHovered ? 0.3 : 0.1,
            shadowRadius: 4.65,
            elevation: isHovered ? 24 : 4,
          },
        ]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <View style={styles.item_parent_container}>
          {product?.__typename.includes('comboProduct') && (
            <>
              <View style={styles.card_title}>
                <Text style={styles.card_title_text}>{product.name}</Text>
                <Text style={styles.is_customizable}>Combo</Text>
              </View>
              <ComboProduct
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                product={product}
                navigation={navigation}
                setPrice={setPrice}
                {...restProps}
              />
            </>
          )}
          {product?.__typename.includes('customizableProduct') && (
            <>
              {cardData && (
                <View style={styles.card_title}>
                  <Text style={styles.card_title_text}>{product.name}</Text>
                  <Text style={styles.is_customizable}>Customizable</Text>
                </View>
              )}
              <CustomizableProductItem
                label={label}
                setcardItem={setcardItem}
                navigation={navigation}
                setcardData={(item) => setcardData(item)}
                independantItem
                product={product}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
          {product?.__typename.includes('simpleRecipeProduct') && (
            <>
              {/* {cardData && (
                        <View style={styles.card_title}>
                           <Text style={styles.card_title_text}>
                              {product.name}
                           </Text>
                        </View>
                     )} */}
              <SimpleProductItem
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                navigation={navigation}
                independantItem
                product={product}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
          {product?.__typename.includes('inventoryProduct') && (
            <>
              {/* {cardData && (
                        <View style={styles.card_title}>
                           <Text style={styles.card_title_text}>
                              {product.name}
                           </Text>
                        </View>
                     )} */}
              <InventoryProductItem
                label={label}
                setcardItem={setcardItem}
                setcardData={(item) => setcardData(item)}
                navigation={navigation}
                independantItem
                product={product}
                {...restProps}
                setPrice={(price) => setPrice(price)}
              />
            </>
          )}
        </View>

        <View style={styles.bottom_container}>
          <View style={styles.price}>
            <Text style={styles.price_text}>$ {price}</Text>
          </View>
          <View style={styles.add_to_cart_container}>
            <TouchableOpacity
              onPress={() => {
                !isAuthenticated ? login() : setIsModalVisible(true);
                // navigation.navigate('AddToCart', { data: cardData, type, id });
              }}
              style={[
                styles.button,
                { display: isNaN(price) ? 'none' : 'flex' },
                { backgroundColor: visual.color || '#3fa4ff' },
              ]}
            >
              <Text style={styles.add_to_card_text}>
                ADD <Feather size={14} name='plus' />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = EStyleSheet.create({
  card_container: {
    width: width >= 1280 ? width * 0.2 : width,
    padding: 5,
    elevation: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {},
    backgroundColor: '#fff',
    marginBottom: 10,
    marginRight: width > 1280 ? 20 : 0,
    marginTop: width > 1280 ? 20 : 0,
    borderRadius: 4,
  },
  card_title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card_title_text: {
    fontSize: '$l',
    fontWeight: 'bold',
  },
  is_customizable: {
    fontSize: '$s',
    color: 'gray',
  },
  item_parent_container: {
    flex: 5,
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: '1rem',
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
    borderRadius: 4,
  },
  add_to_card_text: {
    color: 'white',
    fontSize: '$s',
  },
  price_text: {
    fontSize: '$l',
    fontWeight: 'bold',
  },
});

export default Card;
