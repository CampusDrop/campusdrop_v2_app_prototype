import type { CSSProperties, ImgHTMLAttributes } from "react";

type PagesImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  alt: string;
  fill?: boolean;
  priority?: boolean;
  src: string | { src: string };
  unoptimized?: boolean;
};

export default function PagesImage({
  alt,
  fill,
  priority,
  src,
  style,
  unoptimized,
  ...imageProps
}: PagesImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src.src;
  const fillStyle: CSSProperties | undefined = fill
    ? {
        height: "100%",
        inset: 0,
        objectFit: "cover",
        position: "absolute",
        width: "100%",
        ...style,
      }
    : style;

  return (
    // This component is used only by the static GitHub Pages build.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imageProps}
      alt={alt}
      data-unoptimized={unoptimized || undefined}
      fetchPriority={priority ? "high" : imageProps.fetchPriority}
      loading={priority ? "eager" : imageProps.loading}
      src={resolvedSrc}
      style={fillStyle}
    />
  );
}
