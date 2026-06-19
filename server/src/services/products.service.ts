// server/src/services/products.service.ts
import { productsRepository } from "../repositories/products.repository";
import { AppError } from "../utils/AppError";

export const productsService = {
  getAll: () => productsRepository.findAll(),

  getBySlug: async (slug: string) => {
    const product = await productsRepository.findBySlug(slug);
    if (!product) throw new AppError("Product not found.", 404);
    return product;
  },
};