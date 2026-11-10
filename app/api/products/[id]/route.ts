import { authOptions } from "@/src/lib/auth-options";
import { prisma } from "@/src/lib/prisma";
import { normalizeText } from "@/src/utils/normalizeText";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "El id es obligatorio" },
        { status: 400 },
      );
    }

    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId < 1) {
      return NextResponse.json(
        { error: "El id del producto no es válido" },
        { status: 400 },
      );
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
        id: productId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "El producto no existe." },
        { status: 404 },
      );
    }

    const isNameDuplicated = await prisma.product.findFirst({
      where: {
        normalizedName: normalizedName,
        id: {
          not: productId,
        },
      },
    });

    if (isNameDuplicated) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese nombre" },
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
        { status: 400 },
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
        { status: 400 },
      );
    }

    const stock = Number(body.stock);

    if (!Number.isSafeInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock no es válido." },
        { status: 400 },
      );
    }

    if (
      typeof body.isActive !== "boolean" ||
      typeof body.isFeatured !== "boolean"
    ) {
      return NextResponse.json(
        { error: "El estado del producto no es válido." },
        { status: 400 },
      );
    }

    const isActive = body.isActive;
    const isFeatured = body.isFeatured;

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

    const existingSlug = await prisma.product.findFirst({
      where: {
        slug,
        id: {
          not: productId,
        },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese slug." },
        { status: 409 },
      );
    }

    const productUpdated = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        normalizedName,
        slug,
        description,
        price,
        stock,
        isActive,
        isFeatured,
        image,
        categoryId,
      },
    });

    revalidatePath("/catalogo");
    revalidatePath(`/catalogo/${existingProduct.slug}`);
    revalidatePath(`/catalogo/${productUpdated.slug}`);

    return NextResponse.json(
      { message: "¡Producto actualizado correctamente!", data: productUpdated },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "No se pudo actualizar el producto. Intentá nuevamente." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "El id es obligatorio" },
        { status: 400 },
      );
    }

    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId < 1) {
      return NextResponse.json(
        { error: "El id del producto no es válido" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "El producto no existe" },
        { status: 404 },
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/catalogo");
    revalidatePath(`/catalogo/${existingProduct.slug}`);

    return NextResponse.json(
      { message: "¡Producto eliminado correctamente!" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "No se pudo eliminar el producto. Intentá nuevamente" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { id } = await context.params;

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "El id es obligatorio." },
        { status: 400 },
      );
    }

    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId < 1) {
      return NextResponse.json(
        { error: "El id del producto no es válido." },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos." },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "El producto no existe." },
        { status: 404 },
      );
    }

    const data: {
      name?: string;
      normalizedName?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      isActive?: boolean;
      isFeatured?: boolean;
      image?: string;
      categoryId?: number;
    } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim() === "") {
        return NextResponse.json(
          { error: "El nombre no es válido." },
          { status: 400 },
        );
      }

      const name = body.name.trim();
      data.name = name;

      const normalizedName = normalizeText(name);

      data.normalizedName = normalizedName;
      data.slug = normalizedName.trim().replace(/\s+/g, "-");

      const duplicatedName = await prisma.product.findFirst({
        where: {
          normalizedName: data.normalizedName,
          id: { not: productId },
        },
      });

      if (duplicatedName) {
        return NextResponse.json(
          { error: "Ya existe un producto con ese nombre." },
          { status: 409 },
        );
      }
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        body.description.trim() === ""
      ) {
        return NextResponse.json(
          { error: "La descripción no es válida." },
          { status: 400 },
        );
      }

      const description = body.description.trim();

      if (description.length > 500) {
        return NextResponse.json(
          { error: "La descripción no puede superar los 500 caracteres." },
          { status: 400 },
        );
      }

      data.description = description;
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!Number.isSafeInteger(price) || price < 1) {
        return NextResponse.json(
          { error: "El precio no es válido." },
          { status: 400 },
        );
      }

      data.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);

      if (!Number.isSafeInteger(stock) || stock < 0) {
        return NextResponse.json(
          { error: "El stock no es válido." },
          { status: 400 },
        );
      }

      data.stock = stock;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { error: "El valor para mostrar producto no es válido." },
          { status: 400 },
        );
      }

      data.isActive = body.isActive;
    }

    if (body.isFeatured !== undefined) {
      if (typeof body.isFeatured !== "boolean") {
        return NextResponse.json(
          { error: "El valor para mostrar producto destacado no es válido." },
          { status: 400 },
        );
      }

      data.isFeatured = body.isFeatured;
    }

    if (body.image !== undefined) {
      if (
        typeof body.image !== "string" ||
        !body.image.trim().startsWith("/products/") ||
        !body.image.trim().endsWith(".webp")
      ) {
        return NextResponse.json(
          { error: "El formato de la imagen no es válido." },
          { status: 400 },
        );
      }

      data.image = body.image;
    }

    if (body.categoryId !== undefined) {
      const categoryId = Number(body.categoryId);

      if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
        return NextResponse.json(
          { error: "La categoria ingresada no es válida." },
          { status: 400 },
        );
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "La categoria no existe." },
          { status: 404 },
        );
      }

      data.categoryId = categoryId;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron campos para actualizar." },
        { status: 400 },
      );
    }

    const productUpdated = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });

    revalidatePath("/admin");
    revalidatePath("/catalogo");
    revalidatePath(`/catalogo/${existingProduct.slug}`);
    revalidatePath(`/catalogo/${productUpdated.slug}`);

    return NextResponse.json(
      { message: "¡Producto actualizado correctamente!", data: productUpdated },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "No se pudo actualizar el producto." },
      { status: 500 },
    );
  }
}
