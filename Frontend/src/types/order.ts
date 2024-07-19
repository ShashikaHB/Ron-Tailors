type OrderItem = {
  description: string;
  products: number[];
};

type OrderItems = { orderProducts: OrderItem[]; createdProducts: number[] };
