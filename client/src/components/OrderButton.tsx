import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ordersApi } from "@/api/orders";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/utils/whatsapp";
import { computeUnitPrice, computeCartTotal } from "@/utils/price";

function OrderButton() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ordersApi.create({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        totalAmount: computeCartTotal(items),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: computeUnitPrice(item),
          selectedOptions: Object.fromEntries(
            item.selectedOptions.map((opt) => [opt.groupId, opt.valueId])
          ),
        })),
      });

      const message = buildWhatsAppMessage(items, name.trim(), phone.trim());
      const url = buildWhatsAppUrl(message);

      clearCart();
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2.5 text-sm border border-border rounded-[var(--radius-button)] bg-surface text-ink placeholder:text-muted outline-none focus:border-accent"
      />
      <input
        type="tel"
        placeholder="Phone number (e.g. 0123456789)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-3 py-2.5 text-sm border border-border rounded-[var(--radius-button)] bg-surface text-ink placeholder:text-muted outline-none focus:border-accent"
      />

      {error && <p className="text-xs text-accent">{error}</p>}

      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full py-3 rounded-[var(--radius-button)] bg-ink text-surface text-sm font-semibold tracking-wide disabled:opacity-50 active:opacity-70 transition-opacity"
      >
        {loading ? "Placing order..." : "Order via WhatsApp"}
      </button>
    </div>
  );
}

export default OrderButton;