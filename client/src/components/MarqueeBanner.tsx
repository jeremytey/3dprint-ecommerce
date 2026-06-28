function MarqueeBanner() {
  const items = ["Custom 3D Prints", "nothing crazy.co", "Made to Order", "Pick Your Colours", "nothing crazy.co", "WhatsApp Checkout"];
  const repeated = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-y border-border py-2.5 bg-surface my-0">
      <div className="flex whitespace-nowrap animate-marquee">
        {repeated.map((item, i) => (
          <span key={i} className="text-[10px] font-semibold uppercase tracking-widest text-muted px-6">
            {item}<span className="ml-6" style={{ color: "var(--color-accent)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
export default MarqueeBanner;