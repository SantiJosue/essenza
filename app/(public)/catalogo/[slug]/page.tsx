import BackLink from "@/components/common/BackLink"
import { prisma } from "@/src/lib/prisma"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: {
      slug: slug
    },
    include: {
      category: true
    }
  })

  if (!product) {
    notFound()
  }

  const message = `Hola, quisiera consultar por ${product.name}`

  const encodedMessage = encodeURIComponent(message)

  const whatsappUrl = `https://wa.me/543794220343?text=${encodedMessage}`

  return (
    <main className="bg-essenza-surface px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <BackLink href="/catalogo">Volver al Catálogo</BackLink>
        <div className="mt-8 grid gap-12 md:grid-cols-2">

          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-essenza-primary/10">
            <Image
              alt={product.name}
              src={product.image}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">

            <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
              {product.category.name}
            </p>

            <h1 className="mt-4 font-display text-4xl md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 text-2xl font-medium">
              {formatCurrency(product.price)}
            </p>

            <p className="mt-6 max-w-lg leading-relaxed text-essenza-text/70">
              {product.description}
            </p>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer mt-8 inline-flex justify-center items-center gap-2 w-full md:w-fit rounded-full bg-essenza-primary px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <MessageCircle size={16} />
              Consultar producto
            </Link>

          </div>

        </div>

      </div>
    </main>
  )
}
