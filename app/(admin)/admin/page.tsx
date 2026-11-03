import BackLink from "@/components/common/BackLink"
import { prisma } from "@/src/lib/prisma"
import ProductAdmin from "./ProductAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth-options";
import { redirect } from "next/navigation";

async function getProducts() {
    return await prisma.product.findMany({
        include: {
            category: true
        }
    })
}

async function getCategories() {
    return prisma.category.findMany()
}


export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if(!session) {
        redirect("/login")
    }

    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
    ])

    return (
        <main className="min-h-screen bg-essenza-background px-6 py-10 md:py-24">
            <div className="mx-auto max-w-7xl">
                <BackLink href="/">
                    Volver al inicio
                </BackLink>

                <h1 className="mt-12 font-display text-4xl">
                    Administración de productos
                </h1>

                <p className="mt-3 text-essenza-text/70">
                    Gestioná los productos de Essenza.
                </p>

                <ProductAdmin products={products} categories={categories} />

            </div>
        </main>
    );
}
