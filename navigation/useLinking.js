import { useLinking } from '@react-navigation/native';
import { Linking } from 'expo';

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl('/')],
    config: {
      App: {
        path: '/store',
        screens: {
          Home: {
            path: '/',
            screens: {
              Home: {
                path: 'home/',
              },
              ProductPage: {
                path: 'product',
                parse: {
                  id: Number,
                  type: String,
                },
                stringify: {
                  data: (data) => '',
                },
              },
              CategoryProductsPage: {
                path: 'CategoryProductsPage',
                parse: {
                  data: (data) => JSON.parse(decodeURIComponent(data)),
                  category: (category) =>
                    JSON.parse(decodeURIComponent(category)),
                },
                stringify: {
                  data: (data) => encodeURIComponent(JSON.stringify(data)),
                  category: (category) =>
                    encodeURIComponent(JSON.stringify(category)),
                },
              },
            },
          },
        },
      },
    },
  });
}
