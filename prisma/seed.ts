import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeText } from "@/src/utils/normalizeText";

console.log("Host configurado:", new URL(process.env.DATABASE_URL!).hostname);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    "Perfumes",
    "Jabones",
    "Cuidado facial",
    "Cuidado corporal",
    "Cuidado del cabello",
    "Desodorantes",
    "Cuidado masculino",
  ]

  await prisma.$connect();

  const createdCategories = []

  for(const categoryName of categories) {
    const createdCategory = await prisma.category.upsert({
      where: {
        name: categoryName 
      },
      update: {},
      create: { name: categoryName }
    })
    createdCategories.push(createdCategory)
  }

  const skincareCategory = createdCategories.find(category => category.name === "Cuidado facial")

  if (!skincareCategory) {
   throw new Error("No se encontró la categoría Cuidado facial")
  }

  const bodycareCategory = createdCategories.find(category => category.name === "Cuidado corporal")

  if (!bodycareCategory) {
    throw new Error("No se encontró la categoría Cuidado corporal")
  }

  const products = [
  {
    slug: "crema-hidratante",
    name: "Crema hidratante",
    normalizedName: normalizeText("Crema hidratante"),
    description: "Hidratación diaria para una piel suave.",
    price: 15000,
    image: "/products/crema-hidratante.webp",
    categoryId: skincareCategory.id,
  },
  {
    slug: "serum-facial",
    name: "Sérum facial",
    normalizedName: normalizeText("Sérum facial"),
    description: "Un sérum para complementar tu rutina facial.",
    price: 18500,
    image: "/products/serum-facial.webp",
    categoryId: skincareCategory.id,
  },
  {
    slug: "locion-corporal",
    name: "Loción corporal",
    normalizedName: normalizeText("Loción corporal"),
    description: "Loción para el cuidado diario de la piel.",
    price: 12000,
    image: "/products/locion-corporal.webp",
    categoryId: bodycareCategory.id,
  },
];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }

  console.log("¡Categorías y productos cargados correctamente!");
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seeder:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
