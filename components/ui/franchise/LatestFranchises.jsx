"use client";

import { useState, useEffect } from "react";
import { getFranchises } from "@/services/franchiseService";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import FranchiseCard from "@/components/ui/franchise/FranchiseCard";

const LatestFranchises = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestFranchises = async () => {
      try {
        setLoading(true);
        const response = await getFranchises(1);
        setFranchises(response.data.slice(0, 4)); // Get only the first 4 franchises
      } catch (error) {
        console.error("Error loading latest franchises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFranchises();
  }, []);
  
  // Format price with commas for thousands
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "Liên hệ";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12 text-center">Gói Nhượng Quyền</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-[#53382C] border-r-[#53382C]/30 border-b-[#53382C]/10 border-l-[#53382C]/60 animate-spin"></div>
              <p className="mt-4 text-[#53382C]">Đang tải gói nhượng quyền...</p>
            </div>
          </div>
        ) : franchises.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có gói nhượng quyền nào.</p>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {franchises.map((franchise) => (
                 <FranchiseCard 
                 key={franchise.id} 
                 franchise={franchise} 
                 variants={itemVariants} 
               />
              ))}
            </motion.div>
            
            <div className="mt-12 text-center">
              <Link href="/nhuongquyen">
                <Button variant="outline" className="border-[#53382C] text-[#53382C] hover:bg-[#53382C] hover:text-white">
                  Xem tất cả gói nhượng quyền
                  <ArrowRightIcon size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestFranchises;