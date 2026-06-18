// server/src/repositories/products.repository.ts
import { prisma } from "../lib/prisma";

export const productsRepository = {
  findAll: () =>
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),

  findBySlug: (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      include: {
        optionGroups: {
          orderBy: { order: "asc" },
          include: {
            optionValues: { orderBy: { order: "asc" } },
          },
        },
      },
    }),
};