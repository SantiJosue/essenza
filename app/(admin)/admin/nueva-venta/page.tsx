import SaleForm from "@/components/admin/sales/SaleForm";
import { prisma } from "@/src/lib/prisma";

async function getProducts() {
    return prisma.product.findMany({
        where: {
            isActive: true,
            stock: {
                gt: 0
            },
        },
        orderBy: {
            name: "asc"
        },
        include: {
            category: true
        }
    })
}

export default async function page() {
  const products = await getProducts()

  return (
    <>
        <SaleForm products={products} />
    </>
  )
}
