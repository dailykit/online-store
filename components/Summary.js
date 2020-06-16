import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useAppContext } from '../context/app';
import { useCartContext } from '../context/cart';
import { UPDATE_CART } from '../graphql/mutations';
import { height } from '../utils/Scalaing';
import { Feather } from '@expo/vector-icons';
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../graphql';

const Summary = ({ useQuantity, item }) => {
  const [quantity, setquantity] = useState(1);
  const { cart } = useCartContext();
  const { visual } = useAppContext();

  const [image, setImage] = React.useState('');

  console.log('Summary -> image', image);

  const [fetchInventoryProduct] = useLazyQuery(INVENTORY_PRODUCT, {
    variables: {
      id: item.product.id,
    },
    onCompleted: (data) => {
      setImage(data.inventoryProduct?.assets?.images[0]);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
    variables: {
      id: item.product.id,
    },
    onCompleted: (data) => {
      setImage(data.simpleRecipeProduct?.assets?.images[0]);
    },
    fetchPolicy: 'cache-and-network',
  });

  React.useEffect(() => {
    switch (item.type) {
      case 'inventoryProduct': {
        return fetchInventoryProduct();
      }
      case 'simpleRecipeProduct': {
        return fetchSimpleRecipeProduct();
      }
      default: {
        return console.log('NO IMAGE!');
      }
    }
  }, []);

  const [isHovered, setIsHovered] = React.useState(false);

  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Cart updated!');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateQuantity = (quantity) => {
    try {
      if (quantity) {
        let products = cart?.cartInfo?.products;
        let total = parseFloat(cart?.cartInfo?.total);
        const index = products.findIndex(
          (product) => product.cartItemId === item.cartItemId
        );
        console.log('PRODUCT: ', products[index]);
        products[index].product.quantity = quantity;
        total = total - products[index].product.price;
        products[index].product.price =
          products[index].product.basePrice * quantity;
        const newTotal = parseFloat(
          total + products[index].product.basePrice * quantity
        ).toFixed(2);
        const cartInfo = {
          products,
          total: parseFloat(newTotal),
        };
        console.log('SEDING:', cartInfo);
        updateCart({
          variables: {
            id: cart.id,
            set: {
              cartInfo: cartInfo,
            },
          },
        });
      } else {
        removeFromCart(item);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromCart = (product) => {
    let products = cart?.cartInfo?.products;
    let total = parseFloat(cart?.cartInfo?.total);
    if (product.type === 'comboProducts') {
      product.products.forEach(
        (item) => (total = total - parseFloat(item.product.price))
      );
    } else {
      total = total - parseFloat(product.product.price);
    }
    let newCartItems = products?.filter(
      (item) => item.cartItemId !== product.cartItemId
    );
    total = isNaN(total) ? 0 : total < 0 ? 0 : total;
    const cartInfo = {
      products: newCartItems,
      total,
    };
    updateCart({
      variables: {
        id: cart.id,
        set: {
          cartInfo: cartInfo,
        },
      },
    });
  };

  if (quantity < 0) {
    setquantity(0);
  }
  if (item.type == 'comboProducts') {
    return (
      <View style={styles.summary_container}>
        <Image
          style={{ width: 300, height: 300 }}
          source={{
            uri:
              image ||
              'https://lh3.googleusercontent.com/proxy/J-eQ8tm1E23exErvEdkMBz9ekZxzzII-RmG_6FZVwW5RTUiMHrv9KY7A_iOVchP0Em1GDVK2oA48pXnPKcdaUkCHl6a814xwJ0cXJkexVWL5yNBIoDylDTcCR_8',
          }}
        />
        <View style={styles.picker_container}>
          <Text style={styles.summary_title_text}>{item.products[0].name}</Text>
        </View>
        {item.products.map((el) => (
          <View style={styles.picker_container}>
            <Text
              style={{
                paddingLeft: 10,
              }}
            >
              {el.product.name}
            </Text>
          </View>
        ))}
        <View style={styles.summary_bottom_conatiner}>
          <View style={styles.summary_bottom_conatiner_left}>
            <Text style={styles.price_text}>$ {item.price}</Text>
          </View>
          <View style={styles.summary_bottom_conatiner_right}>
            {/* {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )} */}
            {!useQuantity && (
              <View style={styles.button_container}>
                <TouchableOpacity
                  onPress={() => {
                    removeFromCart(item);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={[
                    styles.button_container_left,
                    { backgroundColor: isHovered ? '#ff5a52' : '#fff' },
                  ]}
                >
                  <Text style={{ color: 'white' }}>Remove Item</Text>
                </TouchableOpacity>
              </View>
            )}
            {useQuantity && (
              <Text style={{ fontSize: 18 }}>
                Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.summary_container}>
      <Image
        style={{ width: 100, height: 100, resizeMode: 'contain' }}
        source={{
          uri:
            image ||
            'https://lh3.googleusercontent.com/proxy/J-eQ8tm1E23exErvEdkMBz9ekZxzzII-RmG_6FZVwW5RTUiMHrv9KY7A_iOVchP0Em1GDVK2oA48pXnPKcdaUkCHl6a814xwJ0cXJkexVWL5yNBIoDylDTcCR_8',
        }}
      />
      <View style={styles.picker_container}>
        <Text style={styles.summary_title_text}>{item.product.name}</Text>
        {item.product.quantity && (
          <View style={styles.quantity}>
            <Feather
              name='minus'
              color='#aaa'
              size={24}
              onPress={() => updateQuantity(item.product.quantity - 1)}
            />
            <Text
              style={{
                color: '#333',
                fontWeight: 'bold',
                fontSize: 20,
                marginHorizontal: 8,
              }}
            >
              {item.product.quantity}
            </Text>
            <Feather
              name='plus'
              color='#aaa'
              size={24}
              onPress={() => updateQuantity(item.product.quantity + 1)}
            />
          </View>
        )}
        {!useQuantity && (
          <View
            style={[
              styles.button_container,
              { borderColor: visual.color || '#3fa4ff' },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                removeFromCart(item);
              }}
              style={[
                styles.button_container_left,
                { backgroundColor: isHovered ? '#ff5a52' : '#fff' },
              ]}
            >
              <Feather color='#ff5a52' name='trash-2' size={14} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.summary_bottom_conatiner}>
        {/* <View style={styles.summary_bottom_conatiner_right}>
           {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )}

          {useQuantity && (
            <Text style={{ fontSize: 18 }}>
              Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
            </Text>
          )}
        </View> */}
        <View style={styles.summary_bottom_conatiner_left}>
          <Text style={styles.price_text}>$ {item.product.price}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summary_container: {
    height: height * 0.22,
    marginBottom: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // // elevation: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderTopColor: '#fff',
    backgroundColor: '#fff',
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
  },
  summary_title_conatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  picker_container: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  summary_bottom_conatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  summary_title_conatiner_left: {
    flex: 1,
    justifyContent: 'center',
  },
  summary_title_conatiner_right: {
    flex: 1,
    justifyContent: 'center',
  },
  summary_title_text: {
    fontSize: 16,
  },
  summary_bottom_conatiner_left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 30,
  },
  summary_bottom_conatiner_right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: '#3fa4ff',
  },
  price_text: {
    fontSize: 16,
  },
  button_container_left: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 10,
  },
  button_container_middle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#278ce8',
    height: height * 0.04,
  },
  button_container_right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3fa4ff',
    height: height * 0.04,
  },
  quantity_text: {
    color: 'white',
    fontSize: 16,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
});

export default Summary;
