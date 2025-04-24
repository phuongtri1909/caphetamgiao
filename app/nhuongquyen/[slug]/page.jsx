"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFranchiseDetail } from "@/services/franchiseService";
import ContactFormModal from "@/components/ui/franchise/ContactFormModal";

// Components
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import FeatureList from "@/components/ui/franchise/FeatureList";
import FranchiseCard from "@/components/ui/franchise/FranchiseCard";

const FranchiseDetailPage = () => {
  const { slug } = useParams();
  const [franchise, setFranchise] = useState(null);
  const [otherFranchises, setOtherFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchFranchiseDetail = async () => {
      try {
        setLoading(true);
        const response = await getFranchiseDetail(slug);

        setFranchise(response.franchise);
        setOtherFranchises(response.other_franchises);
      } catch (err) {
        console.error("Error fetching franchise detail:", err);
        setError(
          "Không thể tải thông tin chi tiết gói nhượng quyền. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchFranchiseDetail();
    }
  }, [slug]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ErrorDisplay
          message={error}
          backLink="/nhuongquyen"
          backLinkText="Quay lại danh sách gói nhượng quyền"
        />
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">
          Không tìm thấy gói nhượng quyền
        </h2>
        <p className="mb-8 text-gray-600 text-center">
          Gói nhượng quyền này không tồn tại hoặc đã bị xóa.
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/nhuongquyen">Quay lại danh sách gói nhượng quyền</Link>
        </Button>
      </div>
    );
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative bg-primary/10 pt-16 pb-24 px-4">
          <div className="container mx-auto">
            <Link
              href="/nhuongquyen"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-6 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Quay lại danh sách gói
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {franchise.name_package}
              </h1>
              <p className="text-xl text-muted-foreground">{franchise.name}</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background rounded-lg shadow-xl p-6 md:p-10"
          >
            {/* Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">
                Mô tả gói nhượng quyền
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: franchise.description }}
              />
            </div>

            {/* Features */}
            {franchise.details &&
              Array.isArray(franchise.details) &&
              franchise.details.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">
                    Quyền lợi nhượng quyền
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {franchise.details.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-md p-4 border border-gray-100 flex items-start"
                      >
                        <div className="text-primary mr-2 mt-1">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: feature }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            {/* Call to Action */}
            <div className="bg-primary/10 p-6 md:p-8 rounded-lg text-center mt-12">
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                Bạn quan tâm đến gói nhượng quyền này?
              </h3>
              <p className="text-muted-foreground mb-6">
                Liên hệ với chúng tôi ngay để được tư vấn chi tiết và bắt đầu
                quy trình nhượng quyền.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleContactClick}
              >
                <Phone className="mr-2 h-4 w-4" />
                Liên hệ tư vấn
              </Button>
            </div>
          </motion.div>

          {/* Other Franchises Section */}
          {otherFranchises.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
                Các gói nhượng quyền khác
              </h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {otherFranchises.map((franchise) => (
                  <FranchiseCard
                    key={franchise.id}
                    franchise={franchise}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        franchiseName={franchise.name_package}
        franchiseId={franchise.id}
        franchiseCode={franchise.code}
      />
    </>
  );
};

export default FranchiseDetailPage;
