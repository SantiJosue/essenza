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
  console.log("Probando conexión con Neon...");
  await prisma.$connect();

  const skincare = await prisma.category.upsert({
    where: { name: "Cuidado facial" },
    update: {},
    create: { name: "Cuidado facial" },
  });

  const bodyCare = await prisma.category.upsert({
    where: { name: "Cuidado corporal" },
    update: {},
    create: { name: "Cuidado corporal" },
  });

  const products = [
  {
    slug: "crema-hidratante",
    name: "Crema hidratante",
    normalizedName: normalizeText("Crema hidratante"),
    description: "Hidratación diaria para una piel suave.",
    price: 15000,
    image: "/products/crema-hidratante.webp",
    categoryId: skincare.id,
  },
  {
    slug: "serum-facial",
    name: "Sérum facial",
    normalizedName: normalizeText("Sérum facial"),
    description: "Un sérum para complementar tu rutina facial.",
    price: 18500,
    image: "/products/serum-facial.webp",
    categoryId: skincare.id,
  },
  {
    slug: "locion-corporal",
    name: "Loción corporal",
    normalizedName: normalizeText("Loción corporal"),
    description: "Loción para el cuidado diario de la piel.",
    price: 12000,
    image: "/products/locion-corporal.webp",
    categoryId: bodyCare.id,
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
