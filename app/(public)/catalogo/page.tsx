import CatalogFilters from "@/components/catalogo/CatalogFilters";
import BackLink from "@/components/common/BackLink";
import { prisma } from "@/src/lib/prisma";

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true
    }
  })
}

type CatalogPageProps = {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogPage({searchParams}: CatalogPageProps) {
  const products = await getProducts()
  const { categoria } = await searchParams
  
  return (
    <main className="bg-essenza-surface px-6 py-10 md:py-24">
      <div className="mx-auto max-w-7xl">

        <div className="max-w-2xl">
          <BackLink href="/">Volver al Inicio</BackLink>
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
            Nuestro catálogo
          </p>

          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            Descubrí nuestros productos
          </h1>

          <p className="mt-4 leading-relaxed text-essenza-text/70">
            Encontrá productos seleccionados para acompañar tus momentos de
            cuidado y bienestar.
          </p>
        </div>

        <section className="mt-12">
          <CatalogFilters products={products} initialCategory={categoria} />
        </section>

      </div>
    </main>
  );
}