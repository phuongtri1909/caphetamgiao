"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProductGallery from "@/components/ui/ProductGallery";
import StarRating from "@/components/ui/star-rating";
import OptionButton from "@/components/ui/option-button";
import ProductComboCard from "@/components/ui/ProductComboCard";
import ProductDetails from "@/components/ui/product-details";
import ProductReviews from "@/components/ui/product-reviews";
import ProductCard from "@/components/ui/ProductCard";
import OrderModal from "@/components/ui/OrderModal";

import { useProductDetail as useProductDetailHook } from "@/hooks/useAPI";
import {
  getProductReviews,
  getFeaturedProducts,
} from "@/services/productService";

// Hàm tính trung bình đánh giá
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce(
    (total, review) => total + Number(review.rating),
    0
  );
  return sum / reviews.length;
};

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const ProductDetail = ({ params }) => {
  const { slug } = params;
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedWeightData, setSelectedWeightData] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Sử dụng hook để lấy thông tin sản phẩm
  const {
    data: product,
    loading: productLoading,
    error: productError,
  } = useProductDetailHook(slug);

  // State cho các dữ liệu bổ sung
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set weight mặc định khi product load xong
  useEffect(() => {
    if (product && product.weights && product.weights.length > 0) {
      // Tìm weight mặc định
      const defaultWeight =
        product.weights.find((w) => w.is_default === 1) || product.weights[0];
      setSelectedWeight(defaultWeight.id);
      setSelectedWeightData(defaultWeight);
    }
  }, [product]);

  // Cập nhật selectedWeightData khi selectedWeight thay đổi
  useEffect(() => {
    if (product && product.weights && selectedWeight) {
      const weightData = product.weights.find((w) => w.id === selectedWeight);
      if (weightData) {
        setSelectedWeightData(weightData);
      }
    }
  }, [selectedWeight, product]);

  // Lấy thêm dữ liệu sau khi có thông tin sản phẩm
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!product) return;

      try {
        setLoading(true);

        // Lấy đánh giá sản phẩm (nếu không có sẵn trong API response)
        if (!product.reviews) {
          const reviewsData = await getProductReviews(slug);
          setReviews(reviewsData?.reviews || []);
        } else {
          setReviews(product.reviews || []);
        }

        // Lấy sản phẩm nổi bật làm sản phẩm liên quan
        const featuredData = await getFeaturedProducts();
        setRelatedProducts(
          featuredData?.filter((item) => item.slug !== slug) || []
        );

        // Giữ nguyên dữ liệu combo đang có (hoặc có thể thêm API mới nếu cần)
        // setComboProducts([
        //   {
        //     id: 101,
        //     image: "/work/3.png",
        //     title: "Combo 3 gói Robusta Đặc Sản Tâm Giao",
        //     originalPrice: "360.000đ",
        //     currentPrice: "290.000đ",
        //     discount: 20,
        //     slug: "robusta-dac-san-tam-giao-combo-3",
        //   },
        //   {
        //     id: 102,
        //     image: "/work/4.png",
        //     title: "Combo 2 gói Robusta + 1 gói Culi",
        //     originalPrice: "420.000đ",
        //     currentPrice: "350.000đ",
        //     discount: 17,
        //     slug: "robusta-culi-combo-mix",
        //   },
        //   {
        //     id: 103,
        //     image: "/work/1.png",
        //     title: "Combo Cà Phê Quà Tặng - Hộp Premium",
        //     originalPrice: "550.000đ",
        //     currentPrice: "450.000đ",
        //     discount: 18,
        //     slug: "ca-phe-qua-tang-premium",
        //   },
        // ]);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu bổ sung:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu bổ sung");
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [product, slug]);

  // Debug - kiểm tra cấu trúc product
  useEffect(() => {
    if (product) {
      // console.log("Product data:", product);
    }
  }, [product]);

  // Hiển thị loading khi đang tải dữ liệu sản phẩm chính
  if (productLoading || (loading && !product)) {
    return (
      <div className="container mx-auto min-h-screen pt-12 flex flex-col items-center justify-center">
        <p className="text-xl">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  // Hiển thị lỗi
  if (productError || !product) {
    return (
      <div className="container mx-auto min-h-screen pt-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">
          {productError || "Không tìm thấy sản phẩm"}
        </h2>
        <Link href="/projects" className="flex items-center gap-2 text-primary">
          <ArrowLeft size={20} />
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Tạo danh sách ảnh cho gallery
  const galleryImages = product.images?.length
  ? [product.image, ...product.images.map((img) => img.image_path)]
  : [product.image];

  const breadcrumbsItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/projects" },
    { label: product.name },
  ];

  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        {/* Đường dẫn quay lại */}
        <Breadcrumbs items={breadcrumbsItems} />

        {/* Chi tiết sản phẩm */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Hình ảnh sản phẩm */}
          <ProductGallery
            images={galleryImages}
            autoplay={true}
            autoplayDelay={5000}
          />

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col h-full">
            {/* Phần thông tin sản phẩm */}
            <div className="flex-grow">
              <span className="text-[14px] font-[300] text-[rgba(125,125,125,1)] mb-3">
                {product.category?.name || "Chưa phân loại"}
              </span>
              <h2 className="text-xl lg:text-2xl text-[600] mb-4">
                {product.name}
              </h2>
              {/* Đánh giá sao + Tổng số đánh giá */}
              <div className="flex items-center gap-2 mb-4">
                <StarRating
                  rating={product.average_rating || 0}
                  color="amber"
                  size="default"
                  showScore={false}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {product.average_rating
                    ? Number(product.average_rating).toFixed(1)
                    : "0"}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.review_count || 0} đánh giá)
                </span>
              </div>

              {product.highlight &&
                Array.isArray(product.highlight) &&
                product.highlight.length > 0 && (
                  <div className="text-lg mb-4">
                    <span className="font-bold">Điểm nổi bật:</span>
                    <p>
                      {product.highlight.map((item, index) => (
                        <span key={index} className="block">
                          + {item}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

              {selectedWeightData && (
                <div className="mb-4">
                  <span className="font-[400] text-[14px] leading-[120%] tracking-[0.03em]">
                    (Tiết kiệm:{" "}
                    <span className="text-[#84AF5A]">
                      {formatPrice(
                        selectedWeightData.original_price -
                          selectedWeightData.discounted_price
                      )}{" "}
                      đ
                    </span>
                    )
                  </span>
                  <div>
                    <span className="text-[25px] md:text-[32px] font-[600] leading-[120%] tracking-[0.03em] text-[#53382C]">
                      {formatPrice(selectedWeightData.discounted_price)} đ
                    </span>
                    <span className="text-[14px] font-[400] leading-[120%] tracking-[0.03em] text-[#7D7D7D] ml-2 line-through">
                      {formatPrice(selectedWeightData.original_price)} đ
                    </span>
                    <span className="text-[#53382C] border rounded-sm text-[16px] ms-2">
                      -{selectedWeightData.discount_percent}%
                    </span>
                  </div>
                </div>
              )}

              {product.weights &&
                Array.isArray(product.weights) &&
                product.weights.length > 0 && (
                  <div className="mb-4">
                    <span className="font-bold">Trọng lượng:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.weights.map((weight) => (
                        <OptionButton
                          key={weight.id}
                          label={weight.weight}
                          isSelected={selectedWeight === weight.id}
                          onClick={() => setSelectedWeight(weight.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Phần nút tác vụ ở dưới cùng */}
            <div className="mt-auto">
              {/* Số lượng và nút đặt hàng */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Bộ điều chỉnh số lượng */}
                <div className="flex items-center border border-gray-300 rounded-md h-12 w-fit">
                  <button
                    className="px-3 py-2 text-[#53382C] hover:bg-gray-100 transition-colors h-full"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-medium text-[#53382C]">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 text-[#53382C] hover:bg-gray-100 transition-colors h-full"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Nút đặt hàng và liên hệ */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                  <button
                    className="w-full sm:w-auto px-5 md:px-2 py-2 border-2 border-[#53382C] text-[#53382C] rounded-md inline-flex items-center justify-center gap-2 hover:bg-[#53382C]/5 transition-colors"
                    aria-label="Đặt hàng ngay"
                    onClick={() => setOrderModalOpen(true)}
                  >
                    <span className="font-medium">Đặt hàng tại đây</span>
                  </button>

                  <OrderModal
                    isOpen={orderModalOpen}
                    onClose={() => setOrderModalOpen(false)}
                    product={product}
                    selectedWeightData={selectedWeightData}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    formatPrice={formatPrice}
                  />

                  <button
                    className="w-full sm:w-auto px-5 py-2 bg-[#53382C] text-white rounded-md inline-flex items-center justify-center gap-2 hover:bg-[#3d291e] transition-colors"
                    aria-label="Liên hệ"
                  >
                    <span className="font-medium">Liên hệ</span>
                  </button>
                </div>
              </div>
              <div>
                <span className="border border-[#53382C] rounded-md text-[16px] px-3 py-1.5 mt-4 flex flex-col">
                  <p>
                    Tham gia chương trình khách hàng thường xuyên để nhận nhiều
                    chương trình ưu đãi.
                  </p>

                  <Link href="#" className="text-[#53382C] font-medium">
                    Tham gia ngay
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mua tiết kiệm hơn */}
        {/* <div className="mt-10 mb-16">
          <h3 className="text-xl font-semibold mb-6 text-center">
            MUA TIẾT KIỆM HƠN
          </h3>

          <div className="flex flex-row gap-4 overflow-x-auto pb-4">
            {comboProducts.map((combo) => (
              <ProductComboCard
                key={combo.id}
                image={combo.image}
                title={combo.title}
                originalPrice={combo.originalPrice}
                currentPrice={combo.currentPrice}
                discount={combo.discount}
                slug={combo.slug}
              />
            ))}
          </div>
        </div> */}

        {/* Thông tin chi tiết */}
        <div className="mt-10 mb-16">
          <ProductDetails product={product} />
        </div>

        {/* XẾP HẠNG VÀ ĐÁNH GIÁ */}
        <ProductReviews
          reviews={reviews}
          averageRating={
            Number(product.average_rating) || calculateAverageRating(reviews)
          }
          className="mb-10"
        />

        {/* SKU, CATEGORY, TAGS */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] border-y border-gray-200 bg-gray-50">
          <div className="container mx-auto py-6">
            <div className="flex flex-wrap items-center gap-6 px-4 md:px-0">
              {selectedWeightData?.sku && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#53382C]">
                    SKU:
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedWeightData.sku}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#53382C]">
                  Danh mục:
                </span>
                <Link
                  href={`/projects/category/${product.category?.slug || ""}`}
                  className="text-sm text-gray-600 hover:text-[#53382C] hover:underline"
                >
                  {product.category?.name || "Chưa phân loại"}
                </Link>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#53382C]">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/projects/tag/${
                          typeof tag === "string"
                            ? tag.toLowerCase().replace(/\s+/g, "-")
                            : tag.slug
                        }`}
                        className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-[#53382C]/5 hover:border-[#53382C]/30 transition-colors"
                      >
                        {typeof tag === "string" ? tag : tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SẢN PHẨM LIÊN QUAN */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 mb-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              SẢN PHẨM LIÊN QUAN
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  image={relatedProduct.image}
                  title={relatedProduct.title || relatedProduct.name}
                  currentPrice={
                    relatedProduct.currentPrice ||
                    (relatedProduct.min_discounted_price
                      ? formatPrice(relatedProduct.min_discounted_price) + " đ"
                      : null) ||
                    relatedProduct.price
                  }
                  slug={relatedProduct.slug}
                  category={
                    typeof relatedProduct.category === "object"
                      ? relatedProduct.category?.name
                      : relatedProduct.category
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
