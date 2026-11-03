import FeaturdProducts from '@/components/home/FeaturdProducts'
import Categories from '@/components/home/Categories'
import Hero from '@/components/home/Hero'
import WhyEssenza from '@/components/home/WhyEssenza'
import ContactCTA from '@/components/home/ContactCTA'
import { prisma } from '@/src/lib/prisma'

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true
    }
  })
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main>
      <Hero />
      <Categories />
      <FeaturdProducts products={products} />
      <WhyEssenza />
      <ContactCTA />
    </main>
  )
}
