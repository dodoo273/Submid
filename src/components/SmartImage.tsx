"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface SmartImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

export default function SmartImage({
  src,
  fallbackSrc = "/images/no-image.png",
  ...props
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const isExternal =
    currentSrc.startsWith("http://") || currentSrc.startsWith("https://");

  const handleError = () => {
    if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
  };

  // For external images, disable optimization to avoid upstream timeouts
  return (
    <Image
      {...props}
      src={currentSrc}
      onError={handleError}
      unoptimized={isExternal}
    />
  );
}
