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
    <nav className="sticky top-0 z-50 border-b border-border"
      style={{ backgroundColor: "rgba(255,255,255,0.90)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-16 md:py-4 lg:px-32 max-w-6xl mx-auto backdrop-blur-sm">
        <Link
          to="/"
          className="text-sm md:text-base font-semibold tracking-tight text-ink"
        >
          nothing crazy.co
        </Link>

        <div className="flex items-center gap-5 md:gap-8">
          <Link
            to="/"
            className="text-xs md:text-sm font-medium text-muted tracking-wide uppercase hover:text-ink transition-colors"
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
      </div>
    </nav>
  );
}

export default Navbar;