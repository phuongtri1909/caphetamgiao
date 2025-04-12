import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const ProductComboCard = ({
  image,
  title,
  originalPrice,
  currentPrice,
  discount,
  slug,
  className = "",
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
      {/* Ảnh sản phẩm với border giống ảnh chính */}
      <div className="relative h-48 md:h-40 md:w-40 rounded-lg overflow-hidden border-[8px] border-white bg-white shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-[#53382C] text-white text-xs font-medium px-1.5 py-0.5 rounded">
            -{discount}%
          </div>
        )}
      </div>

      {/* Thông tin combo */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          {/* Tên gói combo */}
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          
          {/* Giá */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] font-[400] text-[#7D7D7D] line-through">
                {originalPrice}
              </span>
              <span className="text-[#53382C] text-xs border rounded-sm px-1">
                -{discount}%
              </span>
            </div>
            <div className="text-xl font-[600] text-[#53382C]">
              {currentPrice}
            </div>
          </div>
        </div>

        {/* Nút mua */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-[14px] text-[#84AF5A]">
            Tiết kiệm: {Math.round((parseInt(originalPrice.replace(/\D/g, '')) - parseInt(currentPrice.replace(/\D/g, ''))) / 1000) * 1000}đ
          </span>
          <Link 
            href={`/projects/detail/${slug}`}
            className="inline-flex items-center gap-1.5 bg-[#53382C] text-white py-1.5 px-3 rounded-md hover:bg-[#3d291e] transition-colors text-sm font-medium"
          >
            <ShoppingCart size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductComboCard;