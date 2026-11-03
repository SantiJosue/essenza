import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductSlider from "./ProductSlider";
import { Product } from "@/src/types/product";

type FeaturedProductsProps = {
  products: Product[]
}

export default function FeaturedProducts({products}: FeaturedProductsProps) {
  return (
    <section className="bg-essenza-surface px-6 py-12 md:py-24">
      <div className="mx-auto max-w-7xl">

        <h2 className="font-display text-4xl md:text-5xl">
          Productos Destacados
        </h2>

        <p className="mt-4 text-essenza-text/70">
          Descubrí algunos de nuestros productos
        </p>

        <ProductSlider products={products} />

        <div className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="group inline-flex gap-2 items-center cursor-pointer text-sm font-medium text-essenza-primary transition hover:opacity-70"
          >
            Ver todo el catálogo 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}
