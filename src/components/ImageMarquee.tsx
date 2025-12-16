interface ImageMarqueeProps {
  images: string[];
  height?: number; // px
  speed?: number; // seconds per loop
}

export default function ImageMarquee({
  images,
  height = 60,
  speed = 20,
}: ImageMarqueeProps) {
  return (
    <div className="relative w-full overflow-x-hidden">
      <div
        className="flex overflow-x-hidden"
        style={{
          width: "max-content",
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {/* Repeat images enough times to exceed viewport */}
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{ height }}
            className="w-[170px] flex-shrink-0 mr-20 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
