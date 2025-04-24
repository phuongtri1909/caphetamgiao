"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  getAllNews,
  getFeaturedNews,
  getLatestNews,
  searchNews,
} from "@/services/newsService";

// Reusable components
import PageHero from "@/components/ui/franchise/PageHero";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import EmptyState from "@/components/ui/EmptyState";

// News-specific components
import NewsSearch from "@/components/ui/news/NewsSearch";
import NewsTabs from "@/components/ui/news/NewsTabs";
import NewsGrid from "@/components/ui/news/NewsGrid";

const NewsPage = () => {
  // States for the news content
  const [news, setNews] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch news based on active tab
  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        // Choose API endpoint based on active tab
        switch (currentTab) {
          case "featured":
            response = await getFeaturedNews(currentPage);
            break;
          case "latest":
            response = await getLatestNews(currentPage);
            break;
          default:
            response = await getAllNews(currentPage);
        }

        // Check if response contains data and meta information
        if (response.data && Array.isArray(response.data)) {
          setNews(response.data);
        } else if (response && Array.isArray(response)) {
          setNews(response);
        } else {
          setNews([]);
        }

        // Set pagination info if available
        if (response.meta) {
          setTotalPages(response.meta.last_page || 1);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    // Only fetch if not in search mode
    if (!isSearching) {
      fetchNewsData();
    }
  }, [currentTab, currentPage, isSearching]);

  // Handle search
  const handleSearch = async (query) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const response = await searchNews(query, 1);

      if (response.data && Array.isArray(response.data)) {
        setNews(response.data);
      } else if (response && Array.isArray(response)) {
        setNews(response);
      } else {
        setNews([]);
      }

      if (response.meta) {
        setTotalPages(response.meta.last_page || 1);
      }

      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching news:", err);
      setError("Không thể tìm kiếm tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Clear search and reset to default tab
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setCurrentTab(value);
    setCurrentPage(1);
    if (isSearching) {
      clearSearch();
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset on error
  const handleRetry = () => {
    setError(null);
    setIsSearching(false);
    setCurrentTab("all");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <PageHero
        backgroundImage="bg-[url('/news/banner.png')]"
        title={
          <>
            Mỗi ly cà phê Tâm Giao, <br className="hidden sm:block" />
            một câu chuyện sẻ chia, <br className="hidden sm:block" />
            lan tỏa hương vị yêu thương.
          </>
        }
        hideDefaultCta={true}
        customContent={
          <NewsSearch onSearch={handleSearch} initialQuery={searchQuery} />
        }
      />

      {/* Main Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Title and tabs */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {isSearching ? "Kết Quả Tìm Kiếm" : "Tin tức"}
            </h2>

            {isSearching ? (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <p className="text-gray-600">
                  Kết quả tìm kiếm cho:{" "}
                  <span className="font-medium">"{searchQuery}"</span>
                </p>
                <Button
                  variant="outline"
                  className="border-[#53382C] text-[#53382C]"
                  onClick={clearSearch}
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            ) : (
              <NewsTabs 
                currentTab={currentTab} 
                onTabChange={handleTabChange} 
              />
            )}
          </div>

          {/* News content */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay 
              message={error} 
              onRetry={handleRetry} 
            />
          ) : news.length === 0 ? (
            <EmptyState
              title="Không tìm thấy bài viết nào"
              description={
                isSearching
                  ? "Không có kết quả phù hợp với tìm kiếm của bạn."
                  : "Chưa có bài viết nào trong mục này."
              }
              actionText={isSearching ? "Quay lại tất cả bài viết" : null}
              onAction={isSearching ? clearSearch : null}
            />
          ) : (
            <NewsGrid 
              news={news} 
              containerVariants={containerVariants} 
            />
          )}

          {/* Pagination */}
          {!loading && news.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default NewsPage;