import { authOptions } from "@/src/lib/auth-options";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type SaleItemInput = {
  productId: number;
  quantity: number;
};

function isSaleItemInput(value: unknown): value is SaleItemInput  {
  if(
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !("productId" in value) ||
    !("quantity" in value)
  ) {
    return false
  }

  return (
    typeof value.productId === "number" &&
    Number.isSafeInteger(value.productId) &&
    value.productId > 0 &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  )
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      !("items" in body) ||
      !Array.isArray(body.items)
    ) {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos" },
        { status: 400 },
      );
    }

    const items = body.items;

    if (items.length < 1) {
      return NextResponse.json(
        { error: "La venta no tiene productos" },
        { status: 400 },
      );
    }

    if(!items.every(isSaleItemInput)) {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos" },
        { status: 400 }
      )
    }

    const itemsIds = items.map((item: SaleItemInput) => item.productId);
    const uniqueIds = new Set(itemsIds);

    if (uniqueIds.size !== itemsIds.length) {
      return NextResponse.json(
        { error: "No puede haber productos duplicados" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findMany({
      where: {
        id: {
          in: itemsIds,
        },
      },
    });

    if (
      existingProduct.length === 0 ||
      existingProduct.length !== itemsIds.length
    ) {
      return NextResponse.json(
        { error: "No se encontraron productos" },
        { status: 404 },
      );
    }

    const productActive = existingProduct.every(
      (product) => product.isActive === true,
    );

    if (!productActive) {
      return NextResponse.json(
        { error: "Los productos seleccionados no estan activos" },
        { status: 400 },
      );
    }

    const productStock = items.every((item: SaleItemInput) => {
      const product = existingProduct.find(
        (product) => product.id === item.productId,
      );

      return product !== undefined && product.stock >= item.quantity;
    });

    if (!productStock) {
      return NextResponse.json(
        { error: "No hay suficiente stock" },
        { status: 400 },
      );
    }

    const totalSales = existingProduct.reduce((acc, product) => {
      const currentProduct = items.find(
        (item: SaleItemInput) => item.productId === product.id,
      );

      if(currentProduct === undefined) {
        throw new Error("No se encontró un producto de la venta")
      }

      return acc + product.price * currentProduct.quantity;
    }, 0);

    const saleItems = items.map((item: SaleItemInput) => {
      const currentProduct = existingProduct.find(
        (product) => product.id === item.productId,
      );

      if(currentProduct === undefined) {
        throw new Error("No se encontró un producto de la venta")
      }

      return {
        ...item,
        unitPrice: currentProduct.price,
      };
    });

    const sale = await prisma.$transaction(async (tx) => {
      const currentSale = await tx.sale.create({
        data: {
          total: totalSales,
          items: {
            create: saleItems,
          },
        },
      });

      for (const item of saleItems) {
        const reduceStock = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
            isActive: true
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (reduceStock.count !== 1) {
          throw new Error("Stock insuficiente");
        }
      }

      return currentSale;
    });

    return NextResponse.json(
      {
        message: "¡Venta recibida correctamente!",
        sale,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if(error instanceof SyntaxError) {
      return NextResponse.json({ error: "El formato JSON enviado no es válido" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Stock insuficiente") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if(error instanceof Error && error.message === "No se encontró un producto de la venta") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
