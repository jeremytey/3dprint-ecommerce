import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi, type Product } from "@/api/products";

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">3D Print Studio</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="border rounded p-3"
          >
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-600">RM {product.basePrice.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;