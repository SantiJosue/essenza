import BackLink from "@/components/common/BackLink";
import Image from "next/image";

export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-essenza-surface px-6 py-10 md:py-24">
      <div className="mx-auto max-w-7xl">

        <BackLink href="/">
          Volver al inicio
        </BackLink>

        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
            Sobre Essenza
          </p>

          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            Una propuesta pensada para vos
          </h1>

          <p className="mt-6 max-w-2xl leading-relaxed text-essenza-text/70">
            En Essenza creemos que el cuidado personal también puede ser un
            momento para disfrutar, descubrir y elegir aquello que realmente
            te representa.
          </p>

        </div>

        <section className="mt-24 grid gap-12 md:grid-cols-2 md:items-center">

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-essenza-primary/10">
            <Image
              src="/products/portada-essenza.webp"
              alt="Productos de Essenza"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
              Nuestra historia
            </p>

            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Una atención cercana y personalizada
            </h2>

            <p className="mt-6 leading-relaxed text-essenza-text/70">
              Essenza nace con la idea de acercarte productos seleccionados y una atención pensada para acompañarte en cada elección.
            </p>

            <p className="mt-4 leading-relaxed text-essenza-text/70">
              Creemos que encontrar un producto también puede ser una experiencia simple, cercana y agradable.
            </p>
          </div>

        </section>

      </div>
    </main>
  )
}