"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "users" | "products">("orders");

  // Product Modal State
  const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, stock: 0, category: "",
    images: "", isArchived: false
  });
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [variants, setVariants] = useState<{ colorName: string, hexCode: string, image: string }[]>([]);
  const [stockItems, setStockItems] = useState<{ size: string, color: string, stock: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role !== "admin") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>, isVariant = false, variantIndex = -1) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    setUploading(true);
    try {
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      if (res.ok) {
        const data = await res.json();
        const imageUrl = `http://localhost:5001${data.url}`;

        if (isVariant && variantIndex !== -1) {
          const newV = [...variants];
          newV[variantIndex].image = imageUrl;
          setVariants(newV);
        } else {
          setFormData(prev => ({
            ...prev,
            images: prev.images ? `${prev.images}, ${imageUrl}` : imageUrl
          }));
        }
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch("http://localhost:5001/api/orders"),
        fetch("http://localhost:5001/api/auth/users"),
        fetch("http://localhost:5001/api/products") // public endpoint, gets all
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchData();
  }, [user]);

  const handleOpenModal = (mode: "add" | "edit", product?: any) => {
    setModalMode(mode);
    setCurrentProduct(product);
    if (mode === "edit" && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category || "",
        images: product.images.join(", "),
        isArchived: product.isArchived || false
      });
      setActiveSizes(product.sizes || []);
      setVariants(product.variants || []);
      setStockItems(product.stockItems || []);
    } else {
      setFormData({
        name: "", description: "", price: 0, stock: 0, category: "",
        images: "", isArchived: false
      });
      setActiveSizes([]);
      setVariants([]);
      setStockItems([]);
    }
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalStock = stockItems.length > 0 ? stockItems.reduce((acc, curr) => acc + curr.stock, 0) : formData.stock;
    const payload = {
      ...formData,
      stock: totalStock,
      images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
      sizes: activeSizes,
      colors: variants.map(v => v.colorName),
      variants: variants,
      stockItems: stockItems,
    };

    const url = modalMode === "add"
      ? "http://localhost:5001/api/products"
      : `http://localhost:5001/api/products/${currentProduct._id}`;

    const method = modalMode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Operation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveDelete = async (id: string, action: "archive" | "delete", currentArchiveState?: boolean) => {
    if (action === "delete" && !confirm("Are you sure you want to permanently delete this product?")) return;

    try {
      if (action === "delete") {
        await fetch(`http://localhost:5001/api/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      } else {
        await fetch(`http://localhost:5001/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`
          },
          body: JSON.stringify({ isArchived: !currentArchiveState })
        });
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="section-padding min-h-screen flex items-center justify-center">
        <p className="font-display text-muted-foreground text-xl">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  return (
    <div className="section-padding max-w-7xl mx-auto min-h-screen relative">
      <h1 className="font-display text-4xl text-foreground mb-8">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b border-border">
        {["orders", "users", "products"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-4 font-display uppercase tracking-wider text-sm transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-primary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <div>
          <h2 className="font-display text-2xl mb-6">Recent Orders</h2>
          {/* Order table omitted for brevity, keeping same logic as before */}
          {orders.length === 0 ? (
            <p className="font-body text-muted-foreground">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="p-4 pl-0">ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 pl-0 font-mono text-xs">{order._id.substring(order._id.length - 8)}</td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">{order.customer?.name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer?.email}</div>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold text-accent whitespace-nowrap">
                        {order.totalPrice.toLocaleString()} TND
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-sm ${order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'
                          }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h2 className="font-display text-2xl mb-6">Registered Users</h2>
          {users.length === 0 ? (
            <p className="font-body text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="p-4 pl-0">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 pl-0 font-mono text-xs">{u._id.substring(u._id.length - 8)}</td>
                      <td className="p-4 font-medium text-foreground">{u.name}</td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-sm ${u.role === 'admin' ? 'bg-red-500/10 text-red-600 font-bold' : 'bg-secondary text-foreground'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl">Products Inventory</h2>
            <button onClick={() => handleOpenModal("add")} className="btn-primary py-2 px-4 text-sm scale-90 origin-right">
              + Add Product
            </button>
          </div>
          {products.length === 0 ? (
            <p className="font-body text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="p-4 pl-0">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">State</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${p.isArchived ? 'opacity-50' : ''}`}>
                      <td className="p-4 pl-0 font-medium text-foreground flex items-center gap-3">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-10 object-cover rounded" />}
                        {p.name}
                      </td>
                      <td className="p-4 text-accent font-semibold">{p.price} TND</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4 capitalize">{p.category || 'N/A'}</td>
                      <td className="p-4">
                        {p.isArchived ? (
                          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm">Archived</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded-sm">Active</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => handleOpenModal("edit", p)} className="text-blue-500 hover:text-blue-600 transition">Edit</button>
                        <button onClick={() => handleArchiveDelete(p._id, "archive", p.isArchived)} className="text-orange-500 hover:text-orange-600 transition">
                          {p.isArchived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button onClick={() => handleArchiveDelete(p._id, "delete")} className="text-red-500 hover:text-red-600 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border shadow-2xl p-6">
            <h2 className="font-display text-2xl mb-6 border-b border-border pb-4">
              {modalMode === "add" ? "Add New Product" : "Edit Product"}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-border rounded px-3 py-2" />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-background border border-border rounded px-3 py-2" placeholder="e.g. bridal" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-body text-sm font-medium">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-background border border-border rounded px-3 py-2 h-20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">Price (TND)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-3 py-2" />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium flex justify-between">
                    <span>Total Stock</span>
                    {stockItems.length > 0 && <span className="text-xs text-accent">Auto-calculated</span>}
                  </label>
                  <input required type="number"
                    value={stockItems.length > 0 ? stockItems.reduce((acc, curr) => acc + curr.stock, 0) : formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    disabled={stockItems.length > 0}
                    className={`w-full bg-background border border-border rounded px-3 py-2 ${stockItems.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>



              <div className="space-y-4">
                <label className="font-body text-sm font-medium">Sizes</label>
                <div className="flex flex-wrap gap-4">
                  {PREDEFINED_SIZES.map(size => (
                    <label key={size} className="flex items-center gap-2 font-body text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) setActiveSizes([...activeSizes, size]);
                          else setActiveSizes(activeSizes.filter(s => s !== size));
                        }}
                        className="accent-primary w-4 h-4"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-body text-sm font-medium">Color Variants</label>
                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { colorName: "", hexCode: "#ffffff", image: "" }])}
                    className="text-xs bg-secondary text-foreground px-3 py-1 rounded hover:bg-border transition-colors"
                  >
                    + Add Variant
                  </button>
                </div>

                {variants.map((variant, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-secondary/30 rounded border border-border/50 items-start sm:items-center">
                    <input
                      required
                      type="text"
                      placeholder="Color Name (e.g. Royal Blue)"
                      value={variant.colorName}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[index].colorName = e.target.value;
                        setVariants(newV);
                      }}
                      className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        required
                        type="color"
                        value={variant.hexCode}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[index].hexCode = e.target.value;
                          setVariants(newV);
                        }}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <span className="text-xs font-mono text-muted-foreground w-16">{variant.hexCode}</span>
                    </div>

                    <div className="flex-[2] flex gap-2 w-full">
                      <input
                        required
                        type="text"
                        placeholder="Unique Image URL for this color"
                        value={variant.image}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[index].image = e.target.value;
                          setVariants(newV);
                        }}
                        className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm min-w-0"
                      />
                      <label className="cursor-pointer bg-secondary px-2 py-2 rounded text-xs hover:bg-border transition-colors flex items-center whitespace-nowrap">
                        Upload
                        <input type="file" className="hidden" onChange={(e) => uploadFileHandler(e, true, index)} accept="image/*" />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No specific color variants added. (Standard images will be used).</p>
                )}
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-display text-lg">Detailed Inventory Tracking</h3>
                <p className="text-sm text-muted-foreground">Manage precise stock levels for each Size and Color combination. This locks the total stock to be perfectly calculated.</p>

                {activeSizes.length > 0 && variants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSizes.map(size => (
                      <div key={size} className="space-y-2 col-span-1 border border-border/50 rounded-md p-3 bg-card shadow-sm">
                        <h4 className="font-display text-sm font-semibold border-b border-border/50 pb-2 mb-2">Size {size}</h4>
                        {variants.map(variant => {
                          const existing = stockItems.find(s => s.size === size && s.color === variant.colorName);
                          return (
                            <div key={`${size}-${variant.colorName}`} className="flex items-center justify-between bg-secondary/20 p-2 rounded text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: variant.hexCode }}></span>
                                <span className="font-medium">{variant.colorName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-muted-foreground">Qty:</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="w-16 bg-background border border-primary/20 focus:border-primary rounded px-2 py-1 text-sm text-right font-mono"
                                  value={existing?.stock || 0}
                                  onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    const newItems = [...stockItems];
                                    const idx = newItems.findIndex(s => s.size === size && s.color === variant.colorName);
                                    if (idx >= 0) newItems[idx].stock = val;
                                    else newItems.push({ size, color: variant.colorName, stock: val });
                                    setStockItems(newItems);
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-secondary/30 p-3 rounded border border-border/50 text-center">Add at least one Size and Color Variant above to unlock granular inventory tracking.</p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-6">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
