import React from "react";
import Image from "next/image";

const ProductImage = ({ src, alt, className }) => {
  return (
    <div className={`relative h-[350px] lg:h-[544px] rounded-lg overflow-hidden border-[12px] border-white bg-white shadow-[0_8px_30px_rgba(0,0,0,0.16)] mb-4 ${className || ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default ProductImage;