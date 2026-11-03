import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="px-6 py-12 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-3xl bg-essenza-primary px-8 py-16 text-center text-white md:px-16">

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

                    <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

                    <div className="relative mx-auto max-w-2xl">
                        <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">¿Necesitás ayuda?</p>

                        <h2 className="mt-4 font-display text-4xl md:text-5xl">Encontrá lo que estás buscando</h2>

                        <p className="mt-5 leading-relaxed text-white/75">Si tenés alguna duda sobre nuestros productos o necesitás asesoramiento, estamos para ayudarte.</p>

                        <Link
                            href="/contacto"
                            className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-medium text-essenza-primary transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Contactarme
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
