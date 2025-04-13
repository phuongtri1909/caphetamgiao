"use client";
import Link from "next/link";
import { Button } from "./ui/button";

// import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

// components
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProducts } from "@/services/productService";
import { truncateHTML } from "@/lib/utils";
import { useEffect, useState } from "react";

const Work = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFeaturedProducts();
        
        // Format the products to match ProjectCard's expected format
        const formattedProducts = response.map(product => ({
          image: product.image,
          category: product.category?.name || "Không phân loại",
          name: product.name,
          description: product.description ? truncateHTML(product.description, 100) : "" ,
          slug: product.slug,
          price: product.min_discounted_price ? 
                `${product.min_discounted_price.toLocaleString('vi-VN')} đ` : 
                "Liên hệ"
        }));
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="relative mb-12 xl:mb-48">
        <div className="container mx-auto text-center py-12">
          <p>Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="relative mb-12 xl:mb-48">
        <div className="container mx-auto text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="relative mb-12 xl:mb-48">
        <div className="container mx-auto text-center py-12">
          <p>Không có sản phẩm nào</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mb-12 xl:mb-48">
      <div className="container mx-auto">
        {/* text */}
        <div className="max-w-[400px] mx-auto xl:mx-0 text-center xl:text-left mb-12 xl:h-[400px] flex flex-col justify-center items-center xl:items-start">
          <h2 className="section-title mb-4">Sản Phẩm Mới</h2>
          <p className="subtitle mb-8">
            Sản phẩm mới, chất lượng vượt trội, đột phá trải nghiệm.
          </p>
          <Link href="/projects">
            <Button>Tất Cả Sản Phẩm</Button>
          </Link>
        </div>
        {/* slider */}
        <div className="xl:max-w-[1000px] xl:absolute right-0 top-0">
          <Swiper
            className="h-auto pb-16" // Changed from fixed height to auto height with padding for pagination
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={30}
            modules={[Pagination]}
            pagination={{ clickable: true }}
          >
            {/* show only the first 6 for the slides */}
            {products.slice(0, 6).map((project, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="h-full pb-4">
                  <ProjectCard project={project} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Work;