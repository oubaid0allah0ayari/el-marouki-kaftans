"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customer: formData,
        products: cart.map(item => ({
          productId: item.id, // Ensure this maps properly referencing ObjectId in DB
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error("Checkout failed. Make sure backend is running.");
      }

      setSuccess(true);
      clearCart();
      
      // Let success state show for 2 seconds then navigate
      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="section-padding max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-display text-2xl mb-4">Your cart is empty.</h2>
        <button onClick={() => router.push("/")} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section-padding max-w-3xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
        <svg className="w-20 h-20 text-accent mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="font-display text-4xl mb-4 text-primary">Order Confirmed!</h1>
        <p className="font-body text-muted-foreground mb-8">
          Thank you for choosing El Marouki. We will contact you soon for delivery details.
        </p>
        <p className="text-sm text-muted-foreground/60">Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="section-padding max-w-7xl mx-auto">
      <h1 className="font-display text-4xl text-foreground mb-10 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Checkout Form */}
        <div>
          <h2 className="font-display text-2xl mb-6 border-b border-border pb-2">Customer Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 text-sm rounded">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-body text-sm font-medium">Full Name *</label>
                <input 
                  required name="name" type="text"
                  value={formData.name} onChange={handleChange}
                  className="w-full bg-background border border-border rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="font-body text-sm font-medium">Phone Number *</label>
                <input 
                  required name="phone" type="tel"
                  value={formData.phone} onChange={handleChange}
                  className="w-full bg-background border border-border rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium">Email Address *</label>
              <input 
                required name="email" type="email"
                value={formData.email} onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium">Delivery Address *</label>
              <input 
                required name="address" type="text"
                value={formData.address} onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium">City *</label>
              <input 
                required name="city" type="text"
                value={formData.city} onChange={handleChange}
                className="w-full bg-background border border-border rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`btn-primary w-full text-center mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 md:p-8 rounded-lg h-fit border border-border">
          <h2 className="font-display text-2xl mb-6">Your Order</h2>
          <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-20 relative rounded overflow-hidden flex-shrink-0 bg-secondary">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-display text-sm md:text-base">{item.name}</h4>
                  <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="font-elegant text-accent font-semibold whitespace-nowrap">
                  {item.price * item.quantity} TND
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between font-display text-xl sm:text-2xl font-bold text-primary">
            <span>Total</span>
            <span>{totalPrice.toLocaleString()} TND</span>
          </div>
        </div>
      </div>
    </div>
  );
}
