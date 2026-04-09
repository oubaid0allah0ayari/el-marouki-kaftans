"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { products as localProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Helper color map string -> hex
  const getColorHex = (colorName: string) => {
    const map: Record<string, string> = {
      "White/Gold": "#fdfbf7",
      "Black/Gold": "#1a1a1a",
      "Emerald/Silver": "#2e8b57",
      "Blue/Gold": "#003366",
      "Red": "#8b0000",
      "Gold": "#d4af37",
      "Beige": "#f5f5dc",
      "White": "#ffffff",
      "Pink": "#ffc0cb",
      "Black": "#000000",
      "Emerald": "#50c878",
      "Green": "#008000",
      "Blue": "#0000ff"
    };
    if (map[colorName]) return map[colorName];
    return colorName.split(/[\s/]/)[0].toLowerCase();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.images?.length > 0) setMainImage(data.images[0]);
          else if (data.image) setMainImage(data.image);
          
          // Fetch related
          const relatedRes = await fetch("http://localhost:5000/api/products");
          if (relatedRes.ok) {
            const all = await relatedRes.json();
            setRelated(all.filter((p: any) => p._id !== id).slice(0, 4));
          }
        } else {
          throw new Error("Not found on API");
        }
      } catch (err) {
        // Fallback to local products
        const localProd = localProducts.find((p) => p.id === Number(id));
        setProduct(localProd || null);
        if (localProd) {
          if (localProd.images?.length > 0) setMainImage(localProd.images[0]);
          else if (localProd.image) setMainImage(localProd.image);
        }
        setRelated(localProducts.filter((p) => p.id !== Number(id)).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
       fetchProduct();
    }
  }, [id]);

  if (loading) {
     return <div className="pt-20 min-h-screen flex justify-center items-center font-display text-muted-foreground">Loading details...</div>;
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-4xl text-foreground mb-2">Product Not Found</h1>
          <p className="font-body text-muted-foreground mb-6">
            The kaftan you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    addToCart({
       id: product._id || String(product.id),
       name: product.name,
       price: product.price,
       image: mainImage || (product.images && product.images.length > 0 ? product.images[0] : (product.image || "/images/kaftan-1.jpg")),
       quantity,
    });
    setAddedToCart(true);

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentDisplayImg = mainImage || (product.images && product.images.length > 0 ? product.images[0] : (product.image || "/images/kaftan-1.jpg"));

  return (
    <div className="pt-20">
      <section className="section-padding max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="rounded-lg overflow-hidden bg-card border border-border relative aspect-[3/4]">
            <Image
              src={currentDisplayImg}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <span className="font-display text-xs uppercase tracking-[0.3em] text-accent mb-3">
              {product.category || "Couture"}
            </span>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="font-elegant text-2xl md:text-3xl font-semibold text-accent mb-6">
              {product.price.toLocaleString()} {product.currency?.trim() || "TND"}
            </p>

            <div className="gold-divider !mx-0 !my-4" />

            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                  Size
                </h3>
                {selectedSize && (
                  <span className="font-body text-xs text-accent">Selected: {selectedSize}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-sm border text-sm font-body font-medium transition-all duration-300 ${selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "border-border text-foreground hover:border-primary hover:shadow-sm"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                  Color
                </h3>
                {selectedColor && (
                  <span className="font-body text-xs text-accent">Selected: {selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {product.colors?.map((color: string, index: number) => (
                  <button
                    key={color}
                    onClick={() => {
                        setSelectedColor(color);
                        if (product.images && product.images[index]) {
                          setMainImage(product.images[index]);
                        } else if (product.images && product.images[0]) {
                          setMainImage(product.images[0]); // fallback if fewer images than colors
                        }
                    }}
                    title={color}
                    className={`relative w-8 h-8 rounded-full shadow-sm transition-all duration-300 ${
                      selectedColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105 border border-border"
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  >
                     {/* Inner indicator if white color so circle isnt invisible */}
                    {(getColorHex(color) === '#ffffff' || getColorHex(color) === '#fdfbf7') && (
                       <span className="absolute inset-0 rounded-full border border-black/10 pointer-events-none"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-sm border border-border hover:border-primary transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="font-display text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-sm border border-border hover:border-primary transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`btn-primary py-4 rounded-sm font-display text-base tracking-wider uppercase transition-all duration-300 mb-4 ${addedToCart ? "opacity-75" : ""
                }`}
            >
              {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
            </button>

            {/* View Cart Link */}
            {addedToCart && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/cart")}
                  className="btn-gold py-3 flex-1 text-center rounded-sm text-base"
                >
                  View Cart
                </button>
              </div>
            )}

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
              <div className="text-center">
                <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">Handcrafted</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">Premium Fabric</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">Free Alterations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-padding max-w-7xl mx-auto border-t border-border">
        <div className="text-center mb-12">
          <p className="font-elegant text-accent text-sm tracking-[0.4em] uppercase mb-2">
            More to Explore
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            You May Also Like
          </h2>
          <div className="gold-divider" />
        </div>
        <ProductGrid products={related} columns={4} />
      </section>
    </div>
  );
}
