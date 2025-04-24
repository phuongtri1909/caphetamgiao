"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { getFranchises } from "@/services/franchiseService";

// Components
import PageHero from "@/components/ui/franchise/PageHero";
import FranchiseCard from "@/components/ui/franchise/FranchiseCard";
import Pagination from "@/components/ui/Pagination";
import CallToAction from "@/components/ui/CallToAction";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

const NhuongQuyenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        setLoading(true);
        const response = await getFranchises(currentPage);
        
        setFranchises(response.data);
        setPagination({
          currentPage: response.current_page,
          lastPage: response.last_page,
          total: response.total,
        });
      } catch (err) {
        console.error("Error fetching franchises:", err);
        setError("Không thể tải thông tin gói nhượng quyền. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, [currentPage]);

  const handlePageChange = (page) => {
    router.push(`/nhuongquyen?page=${page}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <>
      <PageHero
        backgroundImage="bg-[url('/franchise/banner.png')]"
        title="Nhượng Quyền Tâm Giao Coffee"
        description="Mở rộng cơ hội kinh doanh cùng thương hiệu cà phê uy tín, chất lượng và giàu bản sắc Việt Nam"
        
      />

      <section id="franchise-packages" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Các Gói Nhượng Quyền</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Lựa chọn gói nhượng quyền phù hợp với mục tiêu kinh doanh của bạn
            </p>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay 
              message={error} 
              onRetry={() => window.location.reload()} 
            />
          ) : franchises.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">
                Chưa có thông tin gói nhượng quyền
              </h3>
              <p className="text-gray-500 mb-6">
                Thông tin về các gói nhượng quyền sẽ sớm được cập nhật.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {franchises.map((franchise) => (
                  <FranchiseCard 
                    key={franchise.id} 
                    franchise={franchise} 
                    variants={itemVariants} 
                  />
                ))}
              </motion.div>
              
              <Pagination 
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>

      <CallToAction
        title="Sẵn sàng bắt đầu hành trình kinh doanh với Tâm Giao Coffee?"
        description="Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn chi tiết về các gói nhượng quyền và cơ hội kinh doanh."
        primaryButtonText="Liên hệ tư vấn"
        primaryButtonLink="/lienhe"
        secondaryButtonText="Đăng ký nhận tư vấn"
        secondaryButtonLink="/lienhe#form"
      />
    </>
  );
};

export default NhuongQuyenPage;