import BackLink from "@/components/common/BackLink";
import { ArrowRight, Camera, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactoPage() {
  const message = `Hola, quisiera consultar por `

  const encodedMessage = encodeURIComponent(message)

  const whatsappUrl = `https://wa.me/543794220343?text=${encodedMessage}`

  return (
    <main className="min-h-screen bg-essenza-surface px-6 py-10 md:py-24">
      <div className="mx-auto max-w-7xl">

        <BackLink
          href="/"
        >
          Volver al inicio
        </BackLink>

        <section className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">
            Contacto
          </p>

          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            ¿Hablamos?
          </h1>

          <p className="mt-6 max-w-2xl leading-relaxed text-essenza-text/70">
            Si tenés alguna duda sobre nuestros productos o necesitás asesoramiento, estamos para ayudarte.
          </p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">

          <article className="rounded-2xl border border-essenza-text/10 bg-essenza-background p-8 hover:border-essenza-primary/30">
            <MessageCircle className="text-essenza-primary" size={24} />

            <h2 className="mt-6 font-display text-2xl">WhatsApp</h2>

            <p className="mt-3 leading-relaxed text-essenza-text/70">
              Escribinos para consultar sobre nuestros productos o recibir asesoramiento personalizado.
            </p>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-essenza-primary px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Escribir por WhatsApp
              <ArrowRight size={16} />
            </Link>

          </article>

          <article className="rounded-2xl border border-essenza-text/10 bg-essenza-background p-8 hover:border-essenza-primary/30">
            <Camera className="text-essenza-primary" size={24} />
            
            <h2 className="mt-8 font-display text-2xl">
              Instagram
            </h2>

            <p className="mt-3 leading-relaxed text-essenza-text/70">
              Seguinos para conocer nuestros productos, novedades y contenido.
            </p>

            <Link 
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-essenza-primary px-6 py-3 text-sm font-medium text-essenza-primary transition hover:-translate-y-0.5 hover:bg-essenza-primary hover:text-white"
            >
              Visitar Instagram
              <ArrowRight size={16} />
            </Link>

          </article>

        </section>

      </div>

    </main>
  )
}