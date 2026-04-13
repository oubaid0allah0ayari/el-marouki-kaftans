"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          setOrders(await res.json());
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (isLoading || (user && loadingOrders)) {
    return (
      <div className="section-padding min-h-screen flex items-center justify-center">
        <p className="font-display text-muted-foreground text-xl">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="section-padding max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">My Profile</h1>
        <p className="font-body text-muted-foreground">
          Welcome back, <span className="font-semibold text-accent">{user.name}</span>!
        </p>
      </div>

      <h2 className="font-display text-2xl mb-6">Order History & Tracking</h2>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="font-body text-muted-foreground">You haven't placed any orders yet.</p>
          <button onClick={() => router.push("/products")} className="btn-primary mt-6">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-sm text-muted-foreground">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-sm font-semibold ${
                    order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-600' :
                    order.status?.toLowerCase() === 'shipped' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
                
                <p className="font-body text-sm text-foreground/80 mb-4">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="space-y-2">
                  {order.products?.map((item: any) => (
                    <div key={item._id || item.productId} className="flex justify-between items-center text-sm font-body border-t border-border/50 pt-2">
                      <span className="text-foreground">{item.quantity}x {item.name}</span>
                      <span className="text-muted-foreground">{item.price} TND</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-64 md:border-l md:border-border/50 md:pl-6 flex flex-col justify-between border-t border-border/50 pt-6 md:pt-0">
                <div>
                  <p className="font-display text-sm tracking-wider uppercase text-muted-foreground mb-1">Total</p>
                  <p className="font-elegant text-2xl font-bold text-accent">{order.totalPrice.toLocaleString()} TND</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <p className="font-display text-xs tracking-wider uppercase text-muted-foreground mb-1">Delivering to</p>
                  <p className="font-body text-sm text-foreground/80">{order.customer?.address}, {order.customer?.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
