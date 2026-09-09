import Categories from '@/components/home/Categories'
import Hero from '@/components/home/Hero'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />
      </main>
    </>
  )
}
