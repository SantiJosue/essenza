import { formatCurrency } from "@/src/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  slug: string;
  category: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({
  category,
  name,
  price,
  slug,
  image,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-essenza-text/10 bg-essenza-background p-6 transition hover:border-essenza-primary/30">

      <figure className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-essenza-primary/10">
        <Image
          alt={name}
          src={image}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      </figure>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-sm text-essenza-text/50">
          {category}
        </p>

        <h3 className="mt-1 min-h-16 font-display text-2xl">
          {name}
        </h3>

        <div className="mt-auto pt-4">
          <p className="font-medium text-xl">
            {formatCurrency(price)}
          </p>

          <Link
            href={`/catalogo/${slug}`}
            className="mt-3 block w-full rounded-full bg-essenza-primary px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
          >
            Ver detalle
          </Link>
        </div>
      </div>

    </article>
  );
}