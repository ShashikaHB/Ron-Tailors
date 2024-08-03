/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
const mapProducts = (inputProducts, productsData) => {
  return inputProducts.map((input) => {
    const mappedProducts = input.products.map((productId) => {
      const product = productsData.find((p) => p.productId === productId);
      return {
        type: product.type,
        price: product.price,
        productId: product.productId,
      };
    });

    const amount = mappedProducts.reduce((sum, product) => sum + product.price, 0);

    return {
      description: input.description,
      products: mappedProducts,
      amount,
    };
  });
};

export default mapProducts;
