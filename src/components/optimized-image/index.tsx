import Image from "next/image";
import type { ImageProps } from "next/image";
import s from "./optimized-image.module.css";

interface OptimizedImageProps
  extends Omit<ImageProps, "className" | "alt" | "src"> {
  src: string;
  alt?: string;
  className?: string;
}

export function OptimizedImage({
  src,
  alt = "",
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <div className={`${s.imageWrapper} ${className || ""}`}>
      <Image
        src={src}
        alt={alt}
        className={s.image}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
