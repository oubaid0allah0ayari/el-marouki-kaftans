import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-kaftan.jpg"
          alt="Luxurious Moroccan Kaftan in a traditional riad"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown/85 via-brown/60 to-brown/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/70 via-transparent to-brown/40" />
      </div>

      {/* Decorative Frame */}
      <div className="absolute inset-8 md:inset-16 border border-gold-light/20 rounded-sm pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Decorative line */}
          <div className="w-16 h-px bg-gold-light mb-8 animate-fade-in-up stagger-1" />

          <p className="font-elegant text-gold-light text-lg md:text-xl tracking-[0.4em] uppercase mb-4 animate-fade-in-up stagger-2">
            Handcrafted Moroccan Elegance
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-bold leading-[0.9] mb-6 animate-fade-in-up stagger-3">
            El Marouki
            <br />
            <span className="text-gold-light italic font-medium text-4xl md:text-5xl lg:text-6xl">
              Kaftan Collection
            </span>
          </h1>
          <p className="font-body text-cream/80 text-base md:text-lg leading-relaxed mb-10 max-w-lg animate-fade-in-up stagger-4">
            Discover the artistry of traditional Moroccan kaftans, where centuries-old
            craftsmanship meets contemporary elegance. Each piece tells a story of heritage,
            hand-embroidered with love.
          </p>
          <div className="flex flex-wrap items-center gap-4 animate-fade-in-up stagger-5">
            <Link href="/products" className="btn-gold inline-block text-base">
               Explore Collection
            </Link>
            <Link
              href="/contact"
              className="font-display text-sm tracking-wider uppercase text-cream/80 hover:text-gold-light transition-colors duration-300 border-b border-cream/30 hover:border-gold-light pb-1"
            >
              Visit Boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gold-light animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
