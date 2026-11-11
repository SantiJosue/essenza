"use client";

import { useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import type { Product } from "@/src/types/product";
import { normalizeText } from "@/src/utils/normalizeText";
import { Trash } from "lucide-react";

type CatalogFiltersProps = {
    products: Product[];
    initialCategory?: string
};

export default function CatalogFilters({
    products, initialCategory = "Todas"
}: CatalogFiltersProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortOrder, setSortOrder] = useState('default')

    const categories = [
        "Todas",
        ...new Set(products.map((product) => product.category.name)),
    ];

    const filteredProducts = products.filter(product => {
        const matchesName = normalizeText(product.name).includes(normalizeText(search))

        const matchesCategory = product.category.name === selectedCategory || selectedCategory === "Todas"

        return matchesName && matchesCategory
    })

    const sortedProducts = sortOrder === 'asc'
        ? [...filteredProducts].sort((a, b) => a.price - b.price)
        : sortOrder === 'desc' 
            ? [...filteredProducts].sort((a, b) => b.price - a.price)
            : filteredProducts

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <input
                    type="search"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-xl text-sm border border-essenza-text/15 bg-essenza-background px-4 py-3 outline-none focus:border-essenza-primary sm:flex-1"
                />

                <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="rounded-xl text-sm border border-essenza-text/15 bg-essenza-background px-4 py-3 outline-none focus:border-essenza-primary"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    className="rounded-xl text-sm border border-essenza-text/15 bg-essenza-background px-4 py-3 outline-none focus:border-essenza-primary"
                >
                    <option value="default">Orden original</option>
                    <option value="asc">Precio: menor a mayor</option>
                    <option value="desc">Precio: mayor a menor</option>
                </select>
                <button
                    type="button"
                    aria-label="Limpiar filtros"
                    title="Limpiar filtros"
                    onClick={() => {
                        setSearch('')
                        setSelectedCategory('Todas')
                        setSortOrder('default')
                    }}
                    className="text-sm font-display font-medium text-essenza-primary cursor-pointer hover:underline"
                >
                    <Trash size={20} />
                </button>
            </div>

            <p className="mt-6 text-sm text-essenza-text/60">
                {sortedProducts.length} productos encontrados
            </p>

            {sortedProducts.length > 0 ? (
                <ul className="mt-12 grid items-stretch grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map(product => (
                        <li key={product.id}>
                            <ProductCard
                                category={product.category.name}
                                name={product.name}
                                price={product.price}
                                slug={product.slug}
                                image={product.image}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-essenza-primary/90">No se encontraron productos que coincidan con tu búsqueda.</p>
            )}
        </div>
    );
}