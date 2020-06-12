import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../../components';
import { useLazyQuery } from '@apollo/react-hooks';
import { INVENTORY_PRODUCT } from '../../graphql';
import { Spinner } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { height } from '../../utils/Scalaing';
import { Drawer } from '../../components/Drawer';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '../../context/app';

const ProductPage = ({ navigation, route }) => {
  const { id, type } = route.params;

  const { visual } = useAppContext();

  const [product, setProduct] = React.useState({});
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [fetchInventoryProduct, { loading }] = useLazyQuery(INVENTORY_PRODUCT, {
    onCompleted: (data) => {
      setProduct(data.inventoryProduct);
    },
  });

  React.useEffect(() => {
    switch (type) {
      case 'inventory': {
        return fetchInventoryProduct({
          variables: {
            id,
          },
        });
      }
      case 'simpleRecipe': {
      }
      default: {
        return console.log('Invalid type');
      }
    }
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );

  return (
    <>
      <Drawer
        isVisible={isModalVisible}
        navigation={navigation}
        data={product}
        type={product?.__typename?.split('_')[1]}
        id={product?.id}
        setIsModalVisible={setIsModalVisible}
      />
      <SafeAreaView style={styles.safeArea}>
        <Header title='Home' navigation={navigation} />
        <ScrollView style={styles.scrollView}>
          <View style={{ justifyContent: 'center' }}>
            <Image
              source={{
                uri: product?.assets?.images[0],
              }}
              style={styles.image}
            />
          </View>
          <View style={{ width: 'auto' }}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </Text>
            <Text style={styles.sectionTitle}>Options</Text>
            {product.inventoryProductOptions?.map((option) => (
              <View style={styles.option}>
                <Text style={styles.text}>{option.label}</Text>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  $ {option.price[0].value}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: visual.color }]}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={{ color: '#fff' }}>
                ADD TO CART <Feather size={14} name='plus' />
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
    minHeight: height,
    maxWidth: 1280,
    marginHorizontal: 'auto',
    flexDirection: 'row',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: '2.125rem',
    fontWeight: 'bold',
    lineHeight: '2.5rem',
    marginBottom: '1rem',
    letterSpacing: 0.85,
  },
  sectionTitle: { fontSize: '100%', color: '#666', marginBottom: 5 },
  text: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 400,
  },
  button: {
    textAlign: 'center',
    borderRadius: 4,
    maxWidth: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
