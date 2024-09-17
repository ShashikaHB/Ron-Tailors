/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
const mapProducts = (inputProducts: any, productsData: any) => {
  return inputProducts.map((input: any) => {
    const mappedProducts = input.products.map((productId: any) => {
      const product = productsData.find((p: any) => p.productId === productId);
      return {
        type: product?.itemType,
        price: product?.price,
        productId: product?.productId,
        productCategory: product?.itemCategory,
        isMeasurementAvailable: !!product?.measurement,
      };
    });

    const amount = mappedProducts.reduce((sum: number, product: any) => sum + product.price, 0);

    return {
      description: input.description,
      products: mappedProducts,
      amount,
    };
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Not Started':
      return '#f0f0f0'; // light gray
    case 'Cutting Started':
      return '#ffcc00'; // yellow
    case 'Cutting Done':
      return '#66ff66'; // light green
    case 'Tailoring Started':
      return '#ff9900'; // orange
    case 'Tailoring Done':
      return '#00cc66'; // green
    case 'Ready Made':
      return '#00ffcc'; // turquoise
    default:
      return '#ffffff'; // white (default)
  }
};

export default mapProducts;
