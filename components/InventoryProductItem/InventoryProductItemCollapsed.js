import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ServingSelect from '../ServingSelect';
import { styles } from './styles';

const InventoryProductCollapsed = ({
  data: inventoryProduct,
  label,
  tunnelItem,
  setProductOptionId,
  navigation,
}) => {
  const [servingIndex, setServingIndex] = useState(0);
  if (!inventoryProduct) {
    return <Text>Bad Data</Text>;
  }
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Modal', {
            data: inventoryProduct,
            author: inventoryProduct.author,
            name: inventoryProduct?.name,
          });
        }}
        style={[
          styles.item_container,
          {
            borderBottomWidth: 1,
          },
        ]}
      >
        <View style={[styles.item_container_one, { display: 'flex' }]}>
          <Text style={styles.item_image_title}>{label}</Text>
          <Image
            source={{
              uri: inventoryProduct?.assets?.images[0]
                ? inventoryProduct?.assets?.images[0]
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.item_title}>{`${inventoryProduct.name} `}</Text>

            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Modal', {
                  data: inventoryProduct,
                  author: inventoryProduct.author,
                  name: inventoryProduct?.name,
                });
              }}
            >
              <Feather size={14} name='info' />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.item_category}></Text>
          <Text style={styles.item_chef}>
            {inventoryProduct?.sachetItem?.unitSize &&
              inventoryProduct?.sachetItem?.unitSize +
                ' ' +
                inventoryProduct?.sachetItem?.unit}
            {inventoryProduct?.supplierItem?.unitSize &&
              inventoryProduct?.supplierItem?.unitSize +
                ' ' +
                inventoryProduct?.supplierItem?.unit}
          </Text>
        </View>
        <View style={styles.item_container_three}>
          <View style={styles.item_three_upper}></View>
          <View style={styles.item_three_lower}>
            <Text style={styles.item_details}>
              {inventoryProduct?.inventoryProductOptions[0]?.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {tunnelItem && (
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.something}>Avaliable Servings:</Text>
          {inventoryProduct.inventoryProductOptions.map((item_data, key) => {
            return (
              <ServingSelect
                key={key}
                index={key + 1}
                isSelected={servingIndex == key ? true : false}
                setServingIndex={(index) => setServingIndex(index)}
                size={item_data.label}
                price={item_data.price[0].value}
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

export default InventoryProductCollapsed;
