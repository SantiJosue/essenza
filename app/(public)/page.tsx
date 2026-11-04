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

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      id: 'asc'
    }
  })
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <main>
      <Hero />
      <Categories categories={categories} />
      <FeaturdProducts products={products} />
      <WhyEssenza />
      <ContactCTA />
    </main>
  )
}
