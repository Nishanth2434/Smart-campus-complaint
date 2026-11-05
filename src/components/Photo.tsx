export default function Photo({
  src,
  alt,
  className = "",
  duotone = true,
}: {
  src: string;
  alt: string;
  className?: string;
  duotone?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${duotone ? "grayscale contrast-125" : ""}`}
      />
      {duotone && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-color"
          style={{ background: "linear-gradient(135deg, #ff5a1f 0%, #14110d 100%)", opacity: 0.85 }}
        />
      )}
    </div>
  );
}
