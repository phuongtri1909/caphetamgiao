"use client";

import { useState, useEffect } from "react";
import { getLatestNews } from "@/services/newsService";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { truncateHTML } from "@/lib/utils";

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const response = await getLatestNews(1);
        setNews(response.slice(0,3));
      } catch (error) {
        console.error("Error loading latest news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12 text-center">Tin Tức Mới Nhất</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-[#53382C] border-r-[#53382C]/30 border-b-[#53382C]/10 border-l-[#53382C]/60 animate-spin"></div>
              <p className="mt-4 text-[#53382C]">Đang tải tin tức...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có tin tức nào.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
                  <Link href={`/news/${article.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.thumbnail || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <CalendarDays size={14} className="mr-1" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <Link href={`/news/${article.slug}`}>
                      <h3 className="text-lg font-semibold mb-2 text-[#53382C] hover:text-[#795548] transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4">
                      {truncateHTML(article.excerpt || article.content, 120)}
                    </p>
                    <Link href={`/news/${article.slug}`} className="text-[#53382C] hover:text-[#795548] font-medium text-sm inline-flex items-center">
                      Đọc tiếp
                      <ArrowRightIcon size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/news">
                <Button variant="outline" className="border-[#53382C] text-[#53382C] hover:bg-[#53382C] hover:text-white">
                  Xem tất cả bài viết
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

export default LatestNews;