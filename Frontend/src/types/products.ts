import { MaterialNeededforProduct } from "./material";

export type Product = {
  type: string;
  materials: MaterialNeededforProduct[];
  selectedProduct: number;
};
