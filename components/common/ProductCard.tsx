import { formatCurrency } from "@/src/utils/formatCurrency"
import Image from "next/image"
import Link from "next/link"

type ProductCardProps = {
  slug: string
  category: string
  name: string
  price: number
  image: string
}

export default function ProductCard({category, name, price, slug, image} : ProductCardProps) {
  return (
    <article className="group rounded-2xl border border-essenza-text/10 bg-essenza-background p-6 hover:border-essenza-primary/30">

      <figure className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-essenza-primary/10">
        <Image
          alt={name}
          src={image} 
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      </figure>

      <div className="mt-5">
        <p className="text-sm text-essenza-text/50">
          {category}
        </p>

        <h3 className="mt-1 font-display text-2xl">
          {name}
        </h3>

        <p className="mt-2 font-medium">
          {formatCurrency(price)}
        </p>

        <Link
          href={`/catalogo/${slug}`}
          className="mt-5 block w-full cursor-pointer rounded-full bg-essenza-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Ver detalle
        </Link>
      </div>

    </article>
  )
}
