import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

import { products as localProducts } from "@/data/products";

async function getProducts() {
  try {
    const res = await fetch("http://localhost:5001/api/products", {
      next: { revalidate: 10 },
    });
    
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const dbProducts = await getProducts();
  
  // Graceful fallback to UI mock data if MongoDB is disconnected
  const products = dbProducts || localProducts;
  const featured = products && products.length > 0 ? products.slice(0, 4) : [];

  return (
    <div>
      <Hero />

      {/* Featured Collection */}
      <section className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-elegant text-accent text-sm tracking-[0.4em] uppercase mb-3">
            Curated Selection
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Featured Kaftans
          </h2>
          <div className="gold-divider" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Our most sought-after pieces, handpicked for their exceptional craftsmanship and
            timeless beauty.
          </p>
        </div>
        
        {featured.length > 0 ? (
          <ProductGrid products={featured} columns={4} />
        ) : (
          <div className="text-center text-muted-foreground p-8 border border-border rounded-lg bg-secondary/20">
            <p>Products failed to load from API. Please ensure Backend and Database are running.</p>
          </div>
        )}
        
        <div className="text-center mt-14">
          <Link href="/products" className="btn-primary inline-block">
            View Full Collection
          </Link>
        </div>
      </section>

      {/* About / Heritage Section */}
      <section className="bg-secondary">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <p className="font-elegant text-accent text-sm tracking-[0.4em] uppercase mb-3">
                Our Heritage
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                The Art of Moroccan Craftsmanship
              </h2>
              <div className="gold-divider !mx-0" />
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                For generations, the El Marouki family has preserved the sacred art of kaftan
                making. Each piece is meticulously handcrafted by skilled artisans in the heart
                of Morocco, using techniques that have been passed down through centuries.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                From the selection of the finest fabrics to the intricate embroidery work known
                as "tarz", every kaftan tells a story of dedication, patience, and an
                unwavering commitment to beauty.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-t border-b border-border">
                <div className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">3+</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Generations</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">100%</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Handmade</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">8+</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Collections</p>
                </div>
              </div>

              <Link href="/contact" className="btn-gold inline-block">
                Visit Our Boutique
              </Link>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4 relative aspect-[3/4]">
                <Image
                  src="/images/kaftan-4.jpg"
                  alt="White and gold Moroccan kaftan"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="space-y-4 pt-8 relative aspect-[3/4]">
                <Image
                  src="/images/kaftan-6.jpg"
                  alt="Black and gold Moroccan kaftan"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <p className="font-elegant text-accent text-sm tracking-[0.4em] uppercase mb-3">
              Follow Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              @ElMarouki
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group relative aspect-square overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={`/images/kaftan-${item}.jpg`}
                  alt={`Instagram lifestyle image ${item}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer">
                  <svg className="w-8 h-8 text-cream mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="font-display text-sm text-cream uppercase tracking-widest">Shop Look</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <svg className="w-10 h-10 mx-auto mb-6 text-gold-light opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-elegant text-2xl md:text-3xl lg:text-4xl italic leading-relaxed mb-8 text-cream">
            Every stitch carries the whisper of our ancestors, every thread a connection to
            centuries of Moroccan artistry.
          </blockquote>
          <div className="w-12 h-px bg-gold-light mx-auto mb-4" />
          <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-light">
            The El Marouki Family
          </p>
        </div>
      </section>
    </div>
  );
}
