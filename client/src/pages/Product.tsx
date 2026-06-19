import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsApi, type ProductDetail } from "@/api/products";

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

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mb-4">RM {product.basePrice.toFixed(2)}</p>

      {/* Raw dump for wiring verification only — PartConfigurator.tsx replaces this */}
      <pre className="text-xs bg-gray-100 p-2">
        {JSON.stringify(product.optionGroups, null, 2)}
      </pre>
    </div>
  );
}

export default Product;