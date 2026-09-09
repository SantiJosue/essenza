import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-81px)] items-center">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
            Belleza en cada elección
          </p>

          <h1 className="mt-6 max-w-xl font-display text-5xl leading-tight md:text-6xl">
            Productos que elegís,
            <br />
            belleza que disfrutás.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-essenza-text/70">
            Descubrí productos de belleza, cuidado personal y bienestar
            seleccionados especialmente para vos.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="rounded-full bg-essenza-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Ver catálogo →
            </Link>

            <Link
              href="/contacto"
              className="rounded-full border border-essenza-primary/20 px-6 py-3 text-sm font-medium text-essenza-text transition hover:bg-essenza-primary/5"
            >
              Contactarme
            </Link>
          </div>

          <div className="mt-12 flex gap-8 border-t border-black/5 pt-8">
            <div>
              <p className="font-display text-xl">Calidad</p>
              <p className="mt-1 text-sm text-essenza-text/60">
                Productos seleccionados
              </p>
            </div>

            <div>
              <p className="font-display text-xl">Cercanía</p>
              <p className="mt-1 text-sm text-essenza-text/60">
                Atención personalizada
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-112.5 items-center justify-center overflow-hidden rounded-3xl bg-essenza-accent/30">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-essenza-primary/10" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/40" />

          <div className="relative text-center">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-essenza-surface shadow-sm">
              <span className="font-display text-6xl text-essenza-primary">
                E
              </span>
            </div>

            <p className="mt-6 font-display text-2xl tracking-widest">
              ESSENZA
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-essenza-text/60">
              Catálogo & gestión
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}