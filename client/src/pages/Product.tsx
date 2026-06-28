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
    <div className="max-w-lg mx-auto md:max-w-4xl md:px-16 lg:px-32">
      <div className="md:grid md:grid-cols-2 md:gap-12 md:pt-10">
        <PartConfigurator product={product} />
      </div>
    </div>
  );
}

export default Product;