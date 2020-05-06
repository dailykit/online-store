export const GET_MENU = () =>
  JSON.stringify({
    query: `
{
    getMenu(year: 2020, month: 3, day: 27) {
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
  `,
  });

export const CUSTOMIZABLE_PRODUCT = (id) =>
  JSON.stringify({
    query: `
    {
      customizableProduct(id: ${id}) {
        name
        customizableProductOptions {
          simpleRecipeProduct {
            name
            default
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
              utensilsRequired
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
          utensilsRequired
        }
      }
    }
    `,
  });
