"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import { products as localProducts } from "@/data/products";

const categories = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Wedding" },
  { key: "bridal", label: "Bridal" },
  { key: "formal", label: "Formal" },
  { key: "evening", label: "Evening" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        // Fallback to local products silently
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p: any) => p.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="page-header bg-secondary section-padding text-center">
        <p className="font-elegant text-accent text-sm tracking-[0.4em] uppercase mb-3 relative">
          Excellence in Every Stitch
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground relative">
          Our Collection
        </h1>
        <div className="gold-divider" />
        <p className="font-body text-muted-foreground max-w-2xl mx-auto relative">
          Explore our curated collection of authentic Moroccan kaftans, each piece a testament
          to centuries of artisanal mastery.
        </p>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 -mt-6">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-display text-xs md:text-sm uppercase tracking-wider px-5 py-2.5 rounded-sm border transition-all duration-300 ${activeCategory === cat.key
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-8">
        <p className="font-body text-sm text-muted-foreground">
          Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {activeCategory !== "all" && ` in ${categories.find(c => c.key === activeCategory)?.label}`}
        </p>
      </div>

      {/* Products Grid */}
      <section className="section-padding max-w-7xl mx-auto !pt-6">
        {loading ? (
           <div className="text-center py-20">
              <p className="font-display text-xl text-muted-foreground">Loading collection...</p>
           </div>
        ) : filtered.length > 0 ? (
          <ProductGrid products={filtered} columns={4} />
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-xl text-muted-foreground">
              No kaftans found in this category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
