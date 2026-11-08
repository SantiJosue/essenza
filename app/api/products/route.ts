import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth-options";
import { prisma } from "@/src/lib/prisma";
import { normalizeText } from "@/src/utils/normalizeText";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "No se pudieron obtener los productos." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if(!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      )
    }

    const body = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos" },
        { status: 400 },
      );
    }

    const categoryId = Number(body.categoryId);

    if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
      return NextResponse.json(
        { error: "La categoría no es válida." },
        { status: 400 },
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "La categoria no existe." },
        { status: 404 },
      );
    }

    if (typeof body.name !== "string") {
      return NextResponse.json(
        { error: "El nombre debe ser un texto." },
        { status: 400 },
      );
    }

    const name = body.name.trim();

    if (name === "") {
      return NextResponse.json(
        { error: "El nombre no puede estar vacío." },
        { status: 400 },
      );
    }

    const normalizedName = normalizeText(name);

    const existingProduct = await prisma.product.findUnique({
      where: {
        normalizedName: normalizedName,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese nombre." },
        { status: 409 },
      );
    }

    if (
      typeof body.description !== "string" ||
      body.description.trim() === ""
    ) {
      return NextResponse.json(
        { error: "El campo descripción no puede estar vacío." },
        { status: 400 },
      );
    }

    const description = body.description.trim();

    if (description.length > 500) {
      return NextResponse.json(
        { error: "La descripción no puede tener más de 500 caracteres." },
        { status: 400 },
      );
    }

    if (body.price === undefined || body.price === null || body.price === "") {
        return NextResponse.json(
            { error: "El precio es obligatorio." },
            { status: 400 }
        );
    }

    const price = Number(body.price);

    if (!Number.isSafeInteger(price) || price < 1) {
      return NextResponse.json(
        { error: "El precio no es válido." },
        { status: 400 },
      );
    }

    if (body.stock === undefined || body.stock === null || body.stock === "") {
      return NextResponse.json(
            { error: "El stock es obligatorio." },
            { status: 400 }
        );
    }

    const stock = Number(body.stock);

    if (!Number.isSafeInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock no es válido." },
        { status: 400 },
      );
    }

    const image = body.image;

    if (typeof image !== "string" || image.trim() === "") {
      return NextResponse.json(
        { error: "El campo imagen no puede estar vacío." },
        { status: 400 },
      );
    }

    if (!image.startsWith("/products/") || !image.endsWith(".webp")) {
      return NextResponse.json(
        { error: "El formato de la imagen no es válido." },
        { status: 400 },
      );
    }

    const slug = normalizeText(name).trim().replace(/\s+/g, "-");

    const existingSlug = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese slug." },
        { status: 409 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        normalizedName,
        slug,
        description,
        price,
        stock,
        image,
        categoryId,
      },
    });

    revalidatePath('/catalogo')
    revalidatePath(`/catalogo/${product.slug}`)

    return NextResponse.json(
      {
        message: "¡Producto agregado correctamente!",
        data: product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "No se pudo agregar el producto. Intentá nuevamente." },
      { status: 500 },
    );
  }
}