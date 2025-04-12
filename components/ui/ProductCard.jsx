import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({
  image,
  title,
  currentPrice,
  slug,
  category,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Ảnh sản phẩm - chỉnh thành hình vuông */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border-[8px] border-white bg-white shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col flex-grow p-4">
        {/* Tên sản phẩm */}
        <h3 className="text-base font-medium text-[#53382C] mb-1 line-clamp-2 h-12">
          {title}
        </h3>

        {/* Giá */}
        <div className="mt-auto">
          {category && (
            <div className="text-[14px] font-[400] text-[#7D7D7D]">
              {category}
            </div>
          )}
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-[600] text-[#53382C]">
              {currentPrice}
            </span>
            <Link
              href={`/projects/detail/${slug}`}
              className="inline-flex items-center gap-1 bg-[#53382C] text-white py-1.5 px-2 rounded-md hover:bg-[#3d291e] transition-colors text-xs font-medium"
            >
              <ShoppingCart size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;