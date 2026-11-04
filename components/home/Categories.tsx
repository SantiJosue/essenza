import type { Category } from "@/src/generated/prisma/client";
import Link from "next/link";

type CategoriesProps = {
    categories: Category[]
}

export default function Categories({categories} : CategoriesProps) {
  return (
    <section className="bg-essenza-surface px-6 py-12 md:py-24">
        <div className="mx-auto max-w-7xl">

            <div className="max-w-xl">
                <p className="text-sm font-medium uppercase tracking-[0.3rem] text-essenza-primary">Explorá</p>

                <h2 className="mt-4 font-display text-4xl md:text-5xl">Encontrá lo que buscás</h2>

                <p className="mt-4 leading-relaxed text-essenza-text/70">Descubrí productos seleccionados para acompañarte en cada momento.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map(category => (
                    <Link
                        href={`/catalogo?categoria=${encodeURIComponent(category.name)}`}
                        key={category.id}
                        className="group rounded-2xl border  border-essenza-text/10 active:scale-90
                        bg-essenza-background p-8 text-left transition hover:-translate-y-1 hover:border-essenza-primary/30"
                    >
                        <span className="font-display text-2xl">{category.name}</span>

                        <span className="mt-4 block text-sm text-essenza-text/50 transition group-hover:text-essenza-primary cursor-pointer">Explorar →</span>
                    </Link>
                ))}
            </div>

        </div>
    </section>
  )
}
