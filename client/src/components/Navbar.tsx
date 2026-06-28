import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";

interface NavbarProps {
  onOpenCart: () => void;
}

function Navbar({ onOpenCart }: NavbarProps) {
  const itemCount = useCartStore(
    (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
      <Link to="/" className="text-ink font-semibold tracking-tight text-base">
        nothing crazy.co
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-muted">
          Shop
        </Link>

        <button
          className="relative flex items-center justify-center w-9 h-9 text-ink"
          aria-label="Open cart"
          onClick={onOpenCart}
        >
          <span className="text-sm">⊡</span>
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-surface text-xs flex items-center justify-center leading-none">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;