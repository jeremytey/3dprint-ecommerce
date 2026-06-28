import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface NavbarProps {
  onOpenCart: () => void;
}

function Navbar({ onOpenCart }: NavbarProps) {
  const itemCount = useCartStore(
    (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-sm border-b border-border">
      <Link
        to="/"
        className="text-sm font-semibold tracking-tight text-ink"
      >
        nothing crazy.co
      </Link>

      <div className="flex items-center gap-5">
        <Link
          to="/"
          className="text-xs font-medium text-muted tracking-wide uppercase"
        >
          Shop
        </Link>

        <button
          className="relative flex items-center justify-center w-9 h-9 text-ink"
          aria-label="Open cart"
          onClick={onOpenCart}
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-surface text-[10px] flex items-center justify-center leading-none font-semibold">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;