import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsApi, type ProductDetail } from "@/api/products";
import PartConfigurator from "@/components/PartConfigurator";

function Product() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    productsApi
      .getBySlug(slug)
      .then(setProduct)
      .catch(() => setError("Product not found."));
  }, [slug]);

  if (error) return (
    <div className="flex items-center justify-center h-40">
      <span className="text-sm text-muted">{error}</span>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center h-40">
      <span className="text-sm text-muted animate-pulse">Loading...</span>
    </div>
  );

  return (
  <div className="max-w-5xl mx-auto">
    <div className="md:grid md:grid-cols-2 md:min-h-screen">
      {/* Left — image */}
      <div className="w-full aspect-square md:aspect-auto md:sticky md:top-16 md:h-[calc(100vh-4rem)] bg-canvas flex flex-col items-center justify-center gap-1 relative overflow-hidden">
        <span className="text-[10px] font-mono text-muted/60 tracking-widest uppercase">nothing crazy.co</span>
        <span className="text-[9px] text-muted/40">image coming soon</span>
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20"
          style={{ background: "radial-gradient(circle at 100% 100%, var(--color-accent), transparent 70%)" }} />
      </div>

      {/* Right — configurator */}
      <div className="md:overflow-y-auto">
        <PartConfigurator product={product} />
      </div>
    </div>
  </div>
);
}

export default Product;