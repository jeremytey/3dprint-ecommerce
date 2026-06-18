// server/prisma/seed.ts
// Placeholder seed — Brazil & England only.
// When real colour labels/hex values arrive, update PLACEHOLDER_OPTIONS only.
// Nothing else in this file needs to change.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// EDIT THIS BLOCK WHEN REAL COLOURS ARRIVE
// ─────────────────────────────────────────────
const PLACEHOLDER_OPTIONS = {
  body: [
    { label: "Colour A", hex: "#CCCCCC", priceModifier: 0 },
    { label: "Colour B", hex: "#999999", priceModifier: 0 },
    { label: "Colour C", hex: "#555555", priceModifier: 0 },
    { label: "Colour D", hex: "#222222", priceModifier: 0 },
  ],
  head: [
    { label: "Colour A", hex: "#CCCCCC", priceModifier: 0 },
    { label: "Colour B", hex: "#999999", priceModifier: 0 },
    { label: "Colour C", hex: "#555555", priceModifier: 0 },
    { label: "Colour D", hex: "#222222", priceModifier: 0 },
  ],
  switch: [
    { label: "Colour A", hex: "#CCCCCC", priceModifier: 0 },
    { label: "Colour B", hex: "#999999", priceModifier: 0 },
    { label: "Colour C", hex: "#555555", priceModifier: 0 },
    { label: "Colour D", hex: "#222222", priceModifier: 0 },
  ],
};

const BASE_PRICE = 25.0; // RM — update when friend confirms

// ─────────────────────────────────────────────
// PRODUCTS — add remaining 6 countries here
// ─────────────────────────────────────────────
const PRODUCTS = [
  { name: "FIFA Trophy Clicker – Brazil", slug: "fifa-clicker-brazil" },
  { name: "FIFA Trophy Clicker – England", slug: "fifa-clicker-england" },
  // { name: "FIFA Trophy Clicker – Argentina", slug: "fifa-clicker-argentina" },
  // { name: "FIFA Trophy Clicker – France",    slug: "fifa-clicker-france"    },
  // { name: "FIFA Trophy Clicker – Germany",   slug: "fifa-clicker-germany"   },
  // { name: "FIFA Trophy Clicker – Spain",     slug: "fifa-clicker-spain"     },
  // { name: "FIFA Trophy Clicker – Portugal",  slug: "fifa-clicker-portugal"  },
  // { name: "FIFA Trophy Clicker – Japan",     slug: "fifa-clicker-japan"     },
];

const OPTION_GROUPS = [
  { label: "Body Colour", key: "body" as const, order: 0 },
  { label: "Head Colour", key: "head" as const, order: 1 },
  { label: "Switch Colour", key: "switch" as const, order: 2 },
];

// ─────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database...");

  for (const productDef of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: productDef.slug },
      update: {},
      create: {
        name: productDef.name,
        slug: productDef.slug,
        description: `Customisable FIFA Trophy Keychain Clicker — ${productDef.name.split("–")[1]?.trim()} edition.`,
        basePrice: BASE_PRICE,
        imageUrl: null, // placeholder — update when photos arrive
        isActive: true,
      },
    });

    console.log(`  ✓ Product: ${product.name}`);

    for (const groupDef of OPTION_GROUPS) {
      // Check if group already exists for this product
      const existingGroup = await prisma.optionGroup.findFirst({
        where: { productId: product.id, label: groupDef.label },
      });

      const group = existingGroup
        ? existingGroup
        : await prisma.optionGroup.create({
            data: {
              productId: product.id,
              label: groupDef.label,
              order: groupDef.order,
            },
          });

      console.log(`    ✓ OptionGroup: ${group.label}`);

      const options = PLACEHOLDER_OPTIONS[groupDef.key];

      for (let i = 0; i < options.length; i++) {
        const opt = options[i];

        const existingValue = await prisma.optionValue.findFirst({
          where: { optionGroupId: group.id, label: opt.label },
        });

        if (!existingValue) {
          await prisma.optionValue.create({
            data: {
              optionGroupId: group.id,
              label: opt.label,
              hex: opt.hex,
              priceModifier: opt.priceModifier,
              order: i,
            },
          });
        }
      }

      console.log(`      ✓ ${options.length} OptionValues seeded`);
    }
  }

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

