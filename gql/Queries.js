export const GET_MENU = (date, month, year) =>
  JSON.stringify({
    query: `
    {
        getMenu(year: ${year}, month: ${month}, day: ${date}) {
          name
          comboProducts 
          customizableProducts 
          inventoryProducts
          simpleRecipeProducts
        }
      }
    `,
  });

export const COMBO_PRODUCT = (id) =>
  JSON.stringify({
    query: `
  {
    comboProduct(id: ${id}) {
      name
      id
      comboProductComponents {
        id
        customizableProductId
        label
        inventoryProductId
        simpleRecipeProductId
        
      }
    }
  }
  `,
  });

export const CUSTOMIZABLE_PRODUCT = (id) =>
  JSON.stringify({
    query: `
    {
      customizableProduct(id: ${id}) {
        name
        id
        customizableProductOptions {
          id
          simpleRecipeProduct {
            name
            default
            id
            simpleRecipeProductOptions {
              price
              type
              simpleRecipeYield {
              yield
              }
              simpleRecipeYieldId
            }
            simpleRecipe {
              author
              cookingTime
              assets
              cuisine
              description
              id
              image
              name
              procedures
              show
              utensils
            }
          }
        }
      }
    }
  `,
  });

export const INVENTORY_PRODUCT = (id) =>
  JSON.stringify({
    query: `
  {
    inventoryProduct(id: ${id}) {
      assets
      default
      description
      id
      name
      tags
      inventoryProductOptions {
        id
        price
        quantity
        label
        inventoryProductId
      }
    }
  }
  `,
  });

export const SIMPLE_PRODUCT = (id) =>
  JSON.stringify({
    query: `
    {
      simpleRecipeProduct(id: ${id}) {
        name
        default
        id
        simpleRecipeProductOptions {
          id
          price
          type
          simpleRecipeYield {
            yield
          }
          simpleRecipeYieldId
        }
        simpleRecipe {
          author
          cookingTime
          assets
          cuisine
          description
          id
          image
          name
          procedures
          show
          utensils
        }
      }
    }
    `,
  });
