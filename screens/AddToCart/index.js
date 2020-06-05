import { AntDesign } from '@expo/vector-icons';
import React, { useState, lazy } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Cart, { ComboProductItemProceed } from '../../components/Cart';
const ComboProduct = lazy(() => import('../../components/ComboProduct'));
const CustomizableProductItem = lazy(() =>
  import('../../components/CustomizableProductItem')
);
const InventoryProductItem = lazy(() =>
  import('../../components/InventoryProductItem')
);
const SimpleProductItem = lazy(() =>
  import('../../components/SimpleProductItem')
);
import { height } from '../../utils/Scalaing';
import { styles } from './styles';

const ModalContent = ({
  route,
  navigation,
  setIsModalVisible,
  data,
  type,
  id,
  ...restProps
}) => {
  const [cartItem, setcartItem] = useState(null); // obj to push to jaguar
  const [comboProductItems, setcomboProductItems] = useState([]);
  const [numberOfComboProductItem, setnumberOfComboProductItem] = useState(
    1000
  );
  const [currentComboProductIndex, setCurrentComboProductIndex] = useState(0);
  // let name = '';
  // if (type == 'simpleRecipeProduct') {
  //   name = dataname;
  // }
  // if (type == 'comboProducts') {
  //   name = data?.name;
  // }
  // if (type == 'inventoryProduct') {
  //   name = data.name;
  // }
  // if (type == 'customizableProduct') {
  //   name = data?.name;
  // }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* <View style={styles.title_container}>
          <View style={styles.details}>
            <Text style={styles.title}>{data.name}</Text>
          </View>
          <View style={styles.close_container}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <AntDesign size={30} name='close' />
            </TouchableOpacity>
          </View>
        </View> */}
        <View style={styles.item_parent_container}>
          {type == 'comboProduct' && (
            <ComboProduct
              setcartItem={(item) => {
                let auxArray = comboProductItems;
                console.log(item);
                if (!Array.isArray(item) && Object.keys(item).length >= 1) {
                  if (item.customizableProductOptionId) {
                    auxArray = auxArray.filter(
                      (el) =>
                        item.customizableProductOptionId !==
                        el.customizableProductOptionId
                    );
                  } else if (item.product.id) {
                    auxArray = auxArray.filter((el) => {
                      return item.product.id !== el.product.id;
                    });
                  }
                  auxArray.push(item);
                  setcomboProductItems(auxArray);
                }
              }}
              navigation={navigation}
              tunnelItem
              setIsLastComboItem={setIsLastComboItem}
              setCurrentComboProductIndex={setCurrentComboProductIndex}
              setnumberOfComboProductItem={setnumberOfComboProductItem}
              currentComboProductIndex={currentComboProductIndex}
              name={data.name}
              id={id}
              product={data}
              {...restProps}
            />
          )}
          {type == 'customizableProduct' && (
            <CustomizableProductItem
              setcartItem={setcartItem}
              navigation={navigation}
              independantItem
              tunnelItem
              isSelected
              id={id}
              product={data}
              {...restProps}
            />
          )}
          {type == 'simpleRecipeProduct' && (
            <SimpleProductItem
              setcartItem={(item) => setcartItem(item)}
              navigation={navigation}
              independantItem
              tunnelItem
              isSelected
              id={id}
              product={data}
              {...restProps}
            />
          )}
          {type == 'inventoryProduct' && (
            <InventoryProductItem
              setcartItem={(item) => {
                console.log('set cartitem called', item);
                setcartItem(item);
              }}
              navigation={navigation}
              independantItem
              tunnelItem
              isSelected
              id={id}
              product={data}
              {...restProps}
            />
          )}
        </View>
        <View style={{ height: height * 0.08 }} />
      </ScrollView>
      {type !== 'comboProduct' && (
        <Cart
          cartItem={cartItem}
          navigation={navigation}
          to={'Home'}
          {...restProps}
          text='Add to Cart'
          comboProductItems={comboProductItems}
          tunnelItem
          type={type}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      {type == 'comboProduct' &&
        numberOfComboProductItem - 1 == currentComboProductIndex && (
          <Cart
            cartItem={cartItem}
            navigation={navigation}
            {...restProps}
            text='Add to Cart'
            comboProductItems={comboProductItems}
            tunnelItem
            type={type}
            setIsModalVisible={setIsModalVisible}
          />
        )}
      {type == 'comboProduct' &&
        numberOfComboProductItem - 1 != currentComboProductIndex && (
          <ComboProductItemProceed
            setCurrentComboProductIndex={setCurrentComboProductIndex}
            currentComboProductIndex={currentComboProductIndex}
          />
        )}
      {/* )} */}
    </View>
  );
};

export default ModalContent;
