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
    <main className="w-full">
      {/* Hero */}
      <section className="px-4 pt-10 pb-8 md:px-16 md:pt-20 md:pb-16 lg:px-32 max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          nothing crazy.co
        </p>
        <h1 className="text-xl md:text-4xl lg:text-5xl font-semibold text-ink leading-snug max-w-[260px] md:max-w-2xl mb-3">
          Custom 3D printed pieces, made to order.
        </h1>
        <p className="text-sm md:text-base text-muted leading-relaxed max-w-[300px] md:max-w-lg">
          Pick your colours. Place your order. We handle the rest.
        </p>
      </section>

      {/* Divider */}
      <div className="h-px bg-border mx-4 md:mx-16 lg:mx-32" />

      {/* Product grid */}
      <section className="px-4 pt-6 pb-12 md:px-16 lg:px-32 max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Shop
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;