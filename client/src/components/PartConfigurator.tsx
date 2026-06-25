import { useState } from "react";
import type { ProductDetail } from "@/api/products";
import { useCartStore } from "@/store/useCartStore";
import { formatPriceRM } from "@/utils/price";

interface PartConfiguratorProps {
  product: ProductDetail;
}

function PartConfigurator({ product }: PartConfiguratorProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  // Derived — never stored in state
  const unitPrice = product.optionGroups.reduce((price, group) => {
    const selectedValueId = selectedOptions[group.id];
    const selectedValue = group.optionValues.find((v) => v.id === selectedValueId);
    return price + (selectedValue?.priceModifier ?? 0);
  }, product.basePrice);

  const handleSelect = (groupId: string, valueId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: valueId }));
    setValidationError(null);
  };

  const handleAddToCart = () => {
    // Validate all groups have a selection
    const missingGroup = product.optionGroups.find(
      (group) => !selectedOptions[group.id]
    );

    if (missingGroup) {
      setValidationError(`Please select a ${missingGroup.label}`);
      return;
    }

    // Build selectedOptions array for cart store
    const cartSelectedOptions = product.optionGroups.map((group) => {
      const valueId = selectedOptions[group.id];
      const value = group.optionValues.find((v) => v.id === valueId)!;
      return {
        groupId: group.id,
        groupLabel: group.label,
        valueId: value.id,
        valueLabel: value.label,
        priceModifier: value.priceModifier,
      };
    });

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      basePrice: product.basePrice,
      imageUrl: product.imageUrl,
      selectedOptions: cartSelectedOptions,
    });

    setValidationError(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Product image placeholder */}
      <div className="w-full aspect-square rounded-[var(--radius-card)] bg-canvas flex items-center justify-center">
        <span className="text-xs text-muted">nothing crazy.co</span>
      </div>

      {/* Name + price */}
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-lg font-semibold text-ink leading-tight">
          {product.name}
        </h1>
        <span className="text-lg font-semibold text-accent shrink-0">
          {formatPriceRM(unitPrice)}
        </span>
      </div>

      {/* Option groups — fully dynamic */}
      <div className="flex flex-col gap-5">
        {product.optionGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {group.label}
            </p>

            <div className="flex flex-wrap gap-2">
              {group.optionValues.map((value) => {
                const isSelected = selectedOptions[group.id] === value.id;
                const hasHex = value.hex !== null;

                return hasHex ? (
                  // Colour swatch
                  <button
                    key={value.id}
                    onClick={() => handleSelect(group.id, value.id)}
                    aria-label={value.label}
                    title={value.label}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: value.hex ?? undefined,
                      borderColor: isSelected
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ) : (
                  // Text chip
                  <button
                    key={value.id}
                    onClick={() => handleSelect(group.id, value.id)}
                    className="px-3 py-1.5 text-sm rounded-[var(--radius-button)] border transition-all"
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

      {/* Validation error */}
      {validationError && (
        <p className="text-sm text-accent">{validationError}</p>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        className="w-full py-3 rounded-[var(--radius-button)] bg-ink text-surface text-sm font-semibold tracking-wide transition-opacity active:opacity-70"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default PartConfigurator;