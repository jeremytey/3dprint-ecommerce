import { apiClient } from "./axios";

export interface OptionValue {
  id: string;
  label: string;
  hex: string | null;
  priceModifier: number;
  order: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  order: number;
  optionValues: OptionValue[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface ProductDetail extends Product {
  optionGroups: OptionGroup[];
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await apiClient.get("/api/products");
    return res.data.data;
  },

  getBySlug: async (slug: string): Promise<ProductDetail> => {
    const res = await apiClient.get(`/api/products/${slug}`);
    return res.data.data;
  },
};