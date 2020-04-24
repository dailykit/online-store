import { gql } from 'apollo-boost';

export const GET_MENU = `
  query {
    getMenu(year: 2020, month: 3, day: 27) {
      name
      comboProducts
      customizableProducts
      inventoryProducts
      simpleRecipeProducts
    }
  }
`;
