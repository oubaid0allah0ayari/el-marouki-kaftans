"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="section-padding max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-4xl text-foreground mb-10 text-center">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-muted-foreground mb-6">Your cart is currently empty.</p>
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.cartId} className="flex gap-6 border-b border-border pb-6 overflow-hidden">
                <div className="w-24 h-32 relative bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl text-foreground mb-1">{item.name}</h3>
                    {(item.size || item.color) && (
                      <p className="font-body text-xs text-muted-foreground mb-1">
                        {item.size && `Size: ${item.size}`} {item.size && item.color && '|'} {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <p className="font-elegant text-accent text-lg">{item.price} TND</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.cartId!, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-secondary text-muted-foreground"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-body text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId!, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-secondary text-muted-foreground"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.cartId!)}
                      className="text-sm font-body text-muted-foreground underline hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="bg-card p-6 md:p-8 rounded-lg h-fit border border-border">
            <h2 className="font-display text-2xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 font-body text-sm text-foreground/80 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{totalPrice.toLocaleString()} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free (Tunisia)</span>
              </div>
            </div>
            
            <div className="flex justify-between font-display text-xl sm:text-2xl font-bold text-primary mb-8">
              <span>Total</span>
              <span>{totalPrice.toLocaleString()} TND</span>
            </div>
            
            <Link href="/checkout" className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
