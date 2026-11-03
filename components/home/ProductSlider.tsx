"use client"

import { useState } from "react"
import ProductCard from "../common/ProductCard"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Product } from "@/src/types/product"

type ProductSliderProps = {
    products: Product[]
}

export default function ProductSlider({products} : ProductSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const handlePrev = () => {
        setIsAnimating(true)
        setCurrentIndex((prev) => 
            products.length > 0 
                ? (prev - 1 + products.length) % products.length 
                : prev 
        )
        setTimeout(() => (
            setIsAnimating(false)
        ), 300)
    }

    const handleNext = () => {
        setIsAnimating(true)
        setCurrentIndex((prev) => 
            products.length > 0 
                ? (prev + 1) % products.length 
                : prev
        )
        setTimeout(() => (
            setIsAnimating(false)
        ), 300)
    }

    const visibleProducts = [
        products[currentIndex],
        products[(currentIndex + 1) % products.length],
        products[(currentIndex + 2) % products.length],
    ];

    return (
        <>
            <section className="hidden md:flex mt-12 items-center justify-between gap-6">
                <button
                    type="button"
                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-essenza-primary/20 text-essenza-primary transition hover:bg-essenza-primary hover:text-white"
                    onClick={handlePrev}
                    aria-label="Producto anterior"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className={`grid grid-cols-1 md:grid-cols-3 md:gap-5 w-full transition-opacity duration-300
                    ${isAnimating ? "opacity-0" : "opacity-100"}
                `}>
                    {visibleProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            category={product.category.name}
                            name={product.name}
                            price={product.price}
                            slug={product.slug}
                            image={product.image}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-essenza-primary/20 text-essenza-primary transition hover:bg-essenza-primary hover:text-white"
                    onClick={handleNext}
                    aria-label="Producto siguiente"
                >
                    <ArrowRight size={18} />
                </button>
            </section>

            <section className="md:hidden mt-12 flex gap-2 items-center">
                <button
                    type="button"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-essenza-primary/20 text-essenza-primary transition hover:bg-essenza-primary hover:text-white"
                    onClick={handlePrev}
                    aria-label="Producto anterior"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className={`w-full ${isAnimating ? "opacity-0" : "opacity-100"}`}>
                    <ProductCard
                        key={products[currentIndex].id}
                        category={products[currentIndex].category.name}
                        name={products[currentIndex].name}
                        price={products[currentIndex].price}
                        slug={products[currentIndex].slug}
                        image={products[currentIndex].image}
                    />
                </div>
                <button
                    type="button"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-essenza-primary/20 text-essenza-primary transition hover:bg-essenza-primary hover:text-white"
                    onClick={handleNext}
                    aria-label="Producto siguiente"
                >
                    <ArrowRight size={18} />
                </button>
            </section>
        </>
    )
}
