const benefits = [
    {
        number: "01",
        title: "Productos seleccionados",
        description:
            "Elegimos productos pensados para acompañar tus momentos de cuidado y bienestar.",
    },
    {
        number: "02",
        title: "Atención personalizada",
        description:
            "Te ayudamos a encontrar opciones que se adapten a tus gustos y necesidades.",
    },
    {
        number: "03",
        title: "Cercanía y confianza",
        description:
            "Disfrutá de una atención cercana, simple y pensada para vos.",
    },
];

export default function WhyEssenza() {
    return (
        <section className="bg-essenza-background px-6 py-12 md:py-24">
            <div className="mx-auto max-w-7xl">

                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-essenza-primary">Nuestra esencia</p>

                    <h2 className="mt-4 font-display text-4xl md:text-5xl">Más que productos, una experiencia</h2>

                    <p className="mt-4 leading-relaxed text-essenza-text/70">
                        En Essenza creemos que cada elección puede convertirse en un momento
                        especial de cuidado personal.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {benefits.map(benefit => (
                        <article
                            key={benefit.number}
                            className="rounded-2xl border border-essenza-text/10 bg-essenza-surface p-8 transition hover:-translate-y-1 hover:shadow-sm"
                        >
                            <span className="font-display text-3xl text-essenza-primary/70">{benefit.number}</span>
                            <h3 className="mt-6 font-display text-2xl">{benefit.title}</h3>
                            <p className="mt-4 leading-relaxed text-essenza-text/70">{benefit.description}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}
