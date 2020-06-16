import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header } from '../../components';
import { CategoryBanner } from '../../components/CategoryBanner';
import Products from '../../components/Products';
import { width } from '../../utils/Scalaing';
import CategoriesButton from '../../components/CategoriesButton';
import Footer from '../../components/Footer';

const CategoryProductsPage = ({ navigation, route }) => {
  const { data, category } = route.params;

  return (
    <>
      <Header title='Home' navigation={navigation} />
      <View
        style={{
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          width: width,
          justifyContent: 'center',
          backgroundColor: '#fff',
          marginBottom: 20,
        }}
      >
        <ScrollView
          horizontal
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            marginHorizontal: width > 768 ? 'auto' : 'none',
          }}
          showsHorizontalScrollIndicator={false}
        >
          {data.map((category, key) => (
            <CategoriesButton
              title={category.name}
              key={key}
              id={key}
              length={data?.length}
              onPress={() =>
                navigation.navigate('CategoryProductsPage', {
                  category,
                })
              }
            />
          ))}
        </ScrollView>
      </View>
      <CategoryBanner category={category.title} />
      <ScrollView>
        <Products
          navigation={navigation}
          category={category}
          showLess={false}
        />
        <Footer />
      </ScrollView>
    </>
  );
};

export default CategoryProductsPage;
