"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [activeColor, setActiveColor] = useState("all");
  const [activeSize, setActiveSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(10000); // 10k max limit loosely
  
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
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

  // Compute available colors and sizes
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => p.colors?.forEach((c: string) => colors.add(c)));
    return ["all", ...Array.from(colors).sort()];
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes?.forEach((s: string) => sizes.add(s)));
    return ["all", ...Array.from(sizes).sort()];
  }, [products]);

  const maxProductPrice = useMemo(() => {
    const prices = products.map(p => p.price);
    return prices.length ? Math.max(...prices) : 10000;
  }, [products]);

  useEffect(() => {
    if (maxPrice < maxProductPrice && maxPrice === 10000) {
      setMaxPrice(maxProductPrice);
    }
  }, [maxProductPrice, maxPrice]);

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      const matchColor = activeColor === "all" || p.colors?.includes(activeColor);
      const matchSize = activeSize === "all" || p.sizes?.includes(activeSize);
      const matchPrice = p.price <= maxPrice;
      
      return matchCategory && matchColor && matchSize && matchPrice;
    });
  }, [products, activeCategory, activeColor, activeSize, maxPrice]);

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

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
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

        {/* Detailed Filters (Color, Size, Price) */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col md:flex-row gap-6 md:items-end mb-8">
          
          {/* Color Filter */}
          <div className="flex-1 space-y-2">
            <label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Color</label>
            <select 
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {availableColors.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Colors' : c}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex-1 space-y-2">
            <label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Size</label>
            <select 
              value={activeSize}
              onChange={(e) => setActiveSize(e.target.value)}
              className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {availableSizes.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Sizes' : s}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex-[2] space-y-2">
            <label className="font-display text-xs uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Max Price</span>
              <span className="text-accent font-semibold">{maxPrice} TND</span>
            </label>
            <input 
              type="range"
              min="0"
              max={maxProductPrice}
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex-none">
            <button 
              onClick={() => {
                setActiveColor("all");
                setActiveSize("all");
                setMaxPrice(maxProductPrice);
                setActiveCategory("all");
              }}
              className="font-body text-xs text-muted-foreground underline hover:text-primary transition-colors h-10 px-2"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="font-body text-sm text-muted-foreground">
          Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </section>

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
              No kaftans match your current filters.
            </p>
            <button onClick={() => { setActiveColor("all"); setActiveSize("all"); setMaxPrice(maxProductPrice); setActiveCategory("all"); }} className="btn-primary mt-4">
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
