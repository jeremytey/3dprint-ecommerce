import { Link } from "react-router-dom";
import type { Product } from "@/api/products";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.slug}`} className="flex flex-col border border-border rounded-[var(--radius-card)] overflow-hidden bg-surface">
      {/* Image placeholder — replace when assets arrive */}
      <div className="aspect-square w-full bg-canvas flex items-center justify-center">
        <span className="text-xs text-muted">nothing crazy.co</span>
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-sm font-medium text-ink leading-tight">{product.name}</p>
        <p className="text-sm text-muted">RM {product.basePrice.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default ProductCard;