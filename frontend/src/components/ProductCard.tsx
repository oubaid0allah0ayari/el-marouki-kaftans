"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type CategoryKey = "wedding" | "formal" | "evening" | "bridal";

const categoryLabels: Record<CategoryKey, string> = {
  wedding: "Wedding",
  formal: "Formal",
  evening: "Evening",
  bridal: "Bridal",
};

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  
  const defaultImage = (product.images && product.images.length > 0) ? product.images[0] : (product.image || "/images/kaftan-1.jpg");
  const [activeImage, setActiveImage] = useState(defaultImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id || String(product.id),
      name: product.name,
      price: product.price,
      image: activeImage,
      quantity: 1,
    });
  };

  return (
    <div className="group card-hover bg-card rounded-lg overflow-hidden border border-border">
      {/* Image */}
      <Link href={`/products/${product._id || product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-brown/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-block px-3 py-1 text-xs font-display uppercase tracking-wider bg-background/90 backdrop-blur-sm text-foreground rounded-sm">
            {categoryLabels[product.category as CategoryKey] || product.category || "Kaftan"}
          </span>
        </div>

        {/* Quick view text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
          <span className="font-display text-sm uppercase tracking-widest text-cream bg-primary/80 backdrop-blur-sm px-6 py-2.5 rounded-sm">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link href={`/products/${product._id || product.id}`} className="block">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-4">
          <p className="font-elegant text-xl font-semibold text-accent">
            {product.price.toLocaleString()}
          </p>
          <span className="font-body text-xs text-muted-foreground uppercase">
            {product.currency?.trim() || "TND"}
          </span>
        </div>

        {/* Color Variant Circles */}
        {product.variants && product.variants.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4 items-center h-6">
            {product.variants.map((v: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => { e.preventDefault(); setActiveImage(v.image); }}
                title={v.colorName}
                style={{ backgroundColor: v.hexCode }}
                className={`w-5 h-5 rounded-full border border-border/50 ring-2 transition-all ${activeImage === v.image ? 'ring-primary' : 'ring-transparent hover:ring-border'}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
            {product.colors?.slice(0, 3).map((color: string) => (
              <span key={color} className="text-xs font-body text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm h-fit">
                {color}
              </span>
            ))}
            {product.colors?.length > 3 && (
               <span className="text-xs font-body text-muted-foreground px-1 py-0.5">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product._id || product.id}`}
            className="btn-primary text-center text-xs py-2.5 block px-2 whitespace-nowrap"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="btn-gold text-center text-xs py-2.5 block px-2 whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
