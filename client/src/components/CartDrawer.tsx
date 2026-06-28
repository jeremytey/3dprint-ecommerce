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
          className="fixed inset-0 z-40 bg-ink/30"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-surface transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-ink">Your Cart</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-muted"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted text-center mt-8">
              Nothing in your cart yet.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col gap-2 pb-4 border-b border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink leading-tight">
                    {item.productName}
                  </p>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-xs text-muted shrink-0"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.selectedOptions.map((opt) => (
                    <span key={opt.groupId} className="text-xs text-muted">
                      {opt.groupLabel}: {opt.valueLabel}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm text-ink w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {formatPriceRM(computeLineTotal(item))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="text-base font-semibold text-ink">
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