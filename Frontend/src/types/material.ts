export type Material = {
  name: string;
  color: string;
  unitPrice: number;
  noOfUnits: number;
  marginPercentage: number;
  brand: string;
  type?: string;
};

export type CreateMaterial = {
  variant: "create";
};

export type EditMaterial = {
  variant: "edit";
  materialId: number;
};

export type GetMaterial = Material & EditMaterial;

export type MaterialTableScheme = GetMaterial & { action: string };
