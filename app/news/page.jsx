"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/ui/news/NewsCard";
import {
  getAllNews,
  getFeaturedNews,
  getLatestNews,
  searchNews,
} from "@/services/newsService";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);

    try {
      const response = await searchNews(searchQuery, 1);

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
      {/* Hero Banner Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-cover bg-center bg-[url('/images/news-banner.jpg')]">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto h-full flex flex-col justify-center items-center relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Tin Tức & Cập Nhật
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl"
          >
            Khám phá thế giới cà phê qua những bài viết chuyên sâu và tin tức
            mới nhất từ Tâm Giao Coffee
          </motion.p>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 w-full max-w-md"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-white/90 placeholder:text-gray-500 text-black border-0 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                className="ml-2 h-12 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[70px]"
              >
                <Search size={20} />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

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
              <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="w-full max-w-3xl mx-auto"
              >
                <TabsList className="grid grid-cols-3 h-auto p-1 bg-muted rounded-lg">
                  <TabsTrigger
                    value="all"
                    className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
                  >
                    Tất cả bài viết
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
                  >
                    Bài viết nổi bật
                  </TabsTrigger>
                  <TabsTrigger
                    value="latest"
                    className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
                  >
                    Bài viết mới nhất
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* News grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  setIsSearching(false);
                  setCurrentTab("all");
                }}
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Thử lại
              </Button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">
                Không tìm thấy bài viết nào
              </h3>
              <p className="text-gray-500 mb-6">
                {isSearching
                  ? "Không có kết quả phù hợp với tìm kiếm của bạn."
                  : "Chưa có bài viết nào trong mục này."}
              </p>
              {isSearching && (
                <Button
                  onClick={clearSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Quay lại tất cả bài viết
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && news.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages).keys()].map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(page + 1)}
                      className={
                        currentPage === page + 1
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-primary text-primary hover:bg-primary/10"
                      }
                      size="sm"
                    >
                      {page + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Tiếp
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsPage;
