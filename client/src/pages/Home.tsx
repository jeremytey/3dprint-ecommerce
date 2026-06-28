import { useEffect, useState } from "react";
import { productsApi, type Product } from "@/api/products";
import ProductCard from "@/components/ProductCard";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productsApi
      .getAll()
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <span className="text-sm text-muted animate-pulse">Loading...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-40">
      <span className="text-sm text-muted">{error}</span>
    </div>
  );

  return (
    <main>
      {/* Hero */}
      <section className="px-4 pt-10 pb-8 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          nothing crazy.co
        </p>
        <h1 className="text-xl font-semibold text-ink leading-snug max-w-[260px]">
          Custom 3D printed pieces, made to order.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-[300px]">
          Pick your colours. Place your order. We handle the rest.
        </p>
      </section>

      {/* Divider */}
      <div className="h-px bg-border mx-4" />

      {/* Product grid */}
      <section className="px-4 pt-6 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Shop
        </p>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;