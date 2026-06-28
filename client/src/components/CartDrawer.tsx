import { X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { computeLineTotal, computeCartTotal, formatPriceRM } from "@/utils/price";
import OrderButton from "./OrderButton";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(26,26,26,0.30)" }}
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm flex flex-col bg-surface transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <h2 className="text-sm font-semibold text-ink tracking-tight">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted rounded-[var(--radius-button)] transition-colors active:bg-canvas"
            aria-label="Close cart"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 mt-16">
              <p className="text-sm text-muted">Nothing here yet.</p>
              <button
                onClick={onClose}
                className="text-xs text-accent underline underline-offset-2"
              >
                Browse products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col gap-2 pb-4 border-b border-border last:border-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-ink leading-snug flex-1">
                    {item.productName}
                  </p>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-[10px] text-muted shrink-0 underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                  {item.selectedOptions.map((opt) => (
                    <span key={opt.groupId} className="text-[10px] text-muted">
                      {opt.groupLabel}: {opt.valueLabel}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm leading-none"
                    >
                      −
                    </button>
                    <span className="text-xs text-ink w-4 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm leading-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-ink">
                    {formatPriceRM(computeLineTotal(item))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted uppercase tracking-widest font-medium">
                Total
              </span>
              <span className="text-sm font-semibold text-ink">
                {formatPriceRM(computeCartTotal(items))}
              </span>
            </div>
            <OrderButton />
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;