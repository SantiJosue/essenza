
import BackLink from "@/components/common/BackLink"
import { prisma } from "@/src/lib/prisma"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

async function getSales() {
    return await prisma.sale.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })
}

export default async function VentasPage() {
    const sales = await getSales()

    return (
        <section className="mx-auto min-h-screen max-w-7xl px-4 py-24">
            <BackLink href="/admin">Volver atrás</BackLink>
            <h2 className="mt-8 text-2xl font-semibold">
                Historial de ventas
            </h2>
            <Link
                href={"/nueva-venta"}
                className="my-8 inline-flex gap-2 items-center rounded-xl text-essenza-text border border-essenza-primary bg-white/50 px-5 py-3 font-medium cursor-pointer transition-opacity hover:opacity-90"
            >
                Registrar nueva venta
                <PlusCircle size={16} />
            </Link>

            {sales.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {sales.map(sale => (
                        <article
                            key={sale.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >

                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                                <h3 className="font-semibold">
                                    Venta #{sale.id}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {sale.createdAt.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                {sale.items.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Cantidad: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-medium">
                                            {formatCurrency(item.unitPrice * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex justify-between border-t border-gray-200 pt-4">
                                <p className="font-semibold">
                                    Total de la venta
                                </p>
                                <p className="font-semibold">
                                    {formatCurrency(sale.total)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">
                    Todavía no hay ventas registradas.
                </p>
            )}
        </section>
    )
}
