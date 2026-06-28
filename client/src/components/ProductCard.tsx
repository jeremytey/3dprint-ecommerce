import { Link } from "react-router-dom";
import type { Product } from "@/api/products";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col border border-border rounded-[var(--radius-card)] overflow-hidden bg-surface active:scale-[0.98] transition-transform duration-150"
    >
      {/* Image placeholder */}
      <div className="aspect-square w-full bg-canvas flex flex-col items-center justify-center gap-1 relative overflow-hidden">
        <span className="text-[10px] font-mono text-muted/60 tracking-widest uppercase">
          nothing crazy.co
        </span>
        <span className="text-[9px] text-muted/40 tracking-wide">
          image coming soon
        </span>
        {/* Subtle corner accent */}
        <div
          className="absolute bottom-0 right-0 w-8 h-8 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, var(--color-accent), transparent 70%)",
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 border-t border-border">
        <p className="text-xs font-semibold text-ink leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-xs text-accent font-medium">
          RM {product.basePrice.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;