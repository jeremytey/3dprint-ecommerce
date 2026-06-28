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

  if (error) return <div className="p-4 text-accent">{error}</div>;
  if (!product) return <div className="p-4 text-muted">Loading...</div>;

  return <PartConfigurator product={product} />;
}

export default Product;