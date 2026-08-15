"use client";

import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
}

export default function ProductImage({
  src,
  alt,
}: Props) {
  if (!src) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-slate-100 text-lg">
        📦
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className="h-12 w-12 rounded-xl border object-cover"
    />
  );
}