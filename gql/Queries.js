export const GET_MENU = `
{
    getMenu(year: 2020, month: 3, day: 27) {
      name
      comboProducts 
      customizableProducts 
      inventoryProducts
      simpleRecipeProducts
    }
  }
`;

export const COMBO_PRODUCT = (id) =>
  `
  {
    comboProduct(id: ${id}) {
      name
      id
      comboProductComponents {
        id
        customizableProductId
        label
        customizableProduct {
          id
          customizableProductOptions {
            id
            simpleRecipeProduct {
              id
              name
              default
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
                utensilsRequired
              }
            }
           
          }
          name
          id
          default
        }
        inventoryProductId
        simpleRecipeProductId
        
      }
    }
  }
  `;
