import { useState, useEffect } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "@/api/products";
import { useCartStore } from "@/store/useCartStore";
import { formatPriceRM } from "@/utils/price";

interface PartConfiguratorProps {
  product: ProductDetail;
}

function PartConfigurator({ product }: PartConfiguratorProps) {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const unitPrice = product.optionGroups.reduce((price, group) => {
    const selectedValue = group.optionValues.find(
      (v) => v.id === selectedOptions[group.id]
    );
    return price + (selectedValue?.priceModifier ?? 0);
  }, product.basePrice);

  const handleSelect = (groupId: string, valueId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: valueId }));
    setValidationError(null);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    const missingGroup = product.optionGroups.find(
      (group) => !selectedOptions[group.id]
    );

    if (missingGroup) {
      setValidationError(`Please select a ${missingGroup.label}`);
      return;
    }

    const cartSelectedOptions = product.optionGroups.map((group) => {
      const value = group.optionValues.find(
        (v) => v.id === selectedOptions[group.id]
      )!;
      return {
        groupId: group.id,
        groupLabel: group.label,
        valueId: value.id,
        valueLabel: value.label,
        priceModifier: value.priceModifier,
      };
    });

    addItem(
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        basePrice: product.basePrice,
        imageUrl: product.imageUrl,
        selectedOptions: cartSelectedOptions,
      },
      quantity
    );

    setAdded(true);
    setQuantity(1);
    setValidationError(null);
  };

  return (
    <main className="flex flex-col gap-0">
      {/* Back navigation */}
      <div className="flex items-center px-4 py-3 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-muted active:text-ink transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 px-4 pt-5 pb-10">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-base font-semibold text-ink leading-snug flex-1">
            {product.name}
          </h1>
          <span
            className="text-base font-semibold shrink-0"
            style={{ color: "var(--color-accent)" }}
          >
            {formatPriceRM(unitPrice)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Option groups */}
        <div className="flex flex-col gap-6">
          {product.optionGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                {group.label}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.optionValues.map((value) => {
                  const isSelected = selectedOptions[group.id] === value.id;
                  const hasHex = value.hex !== null;

                  return hasHex ? (
                    <button
                      key={value.id}
                      onClick={() => handleSelect(group.id, value.id)}
                      aria-label={value.label}
                      title={value.label}
                      className="w-8 h-8 rounded-full transition-all duration-150"
                      style={{
                        backgroundColor: value.hex ?? undefined,
                        outline: isSelected
                          ? "2px solid var(--color-accent)"
                          : "2px solid transparent",
                        outlineOffset: "2px",
                        transform: isSelected ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  ) : (
                    <button
                      key={value.id}
                      onClick={() => handleSelect(group.id, value.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-button)] border transition-all duration-150"
                      style={{
                        borderColor: isSelected
                          ? "var(--color-accent)"
                          : "var(--color-border)",
                        backgroundColor: isSelected
                          ? "var(--color-accent)"
                          : "var(--color-surface)",
                        color: isSelected
                          ? "var(--color-surface)"
                          : "var(--color-ink)",
                      }}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Quantity selector */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Quantity
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm leading-none transition-colors active:bg-canvas"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-sm font-semibold text-ink w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center border border-border rounded-[var(--radius-button)] text-ink text-sm leading-none transition-colors active:bg-canvas"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Validation error */}
        {validationError && (
          <p className="text-xs" style={{ color: "var(--color-accent)" }}>
            {validationError}
          </p>
        )}

        {/* Add to cart CTA */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 rounded-[var(--radius-button)] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: added
              ? "var(--color-accent)"
              : "var(--color-ink)",
            color: "var(--color-surface)",
          }}
        >
          <ShoppingBag size={15} strokeWidth={2} />
          {added ? "Added to cart" : "Add to Cart"}
        </button>
      </div>
    </main>
  );
}

export default PartConfigurator;