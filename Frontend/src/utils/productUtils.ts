// Function to map input products to the required format
export const mapProducts = (inputProducts, productsData) => {
  return inputProducts.map((input) => {
    const mappedProducts = input.products.map((productId) => {
      const product = productsData.find((p) => p.productId === productId);
      return {
        type: product.type,
        price: product.price,
        productId: product.productId,
      };
    });

    const amount = mappedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );

    return {
      description: input.description,
      products: mappedProducts,
      amount,
    };
  });
};
