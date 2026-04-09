import Link from "next/link";
import Image from "next/image";

type CategoryKey = "wedding" | "formal" | "evening" | "bridal";

const categoryLabels: Record<CategoryKey, string> = {
  wedding: "Wedding",
  formal: "Formal",
  evening: "Evening",
  bridal: "Bridal",
};

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="group card-hover bg-card rounded-lg overflow-hidden border border-border">
      {/* Image */}
      <Link href={`/products/${product._id || product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <Image
          src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || "/images/kaftan-1.jpg")}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-brown/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-block px-3 py-1 text-xs font-display uppercase tracking-wider bg-background/90 backdrop-blur-sm text-foreground rounded-sm">
            {categoryLabels[product.category as CategoryKey] || product.category}
          </span>
        </div>

        {/* Quick view text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <span className="font-display text-sm uppercase tracking-widest text-cream bg-primary/80 backdrop-blur-sm px-6 py-2.5 rounded-sm">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link href={`/products/${product._id || product.id}`} className="block">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
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

        {/* Color chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.colors?.map((color: string) => (
            <span key={color} className="text-xs font-body text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
              {color}
            </span>
          ))}
        </div>

        <Link
          href={`/products/${product._id || product.id}`}
          className="btn-primary text-center text-xs py-2.5 block"
        >
          View Details & Shop
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
