"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getNewsDetail } from "@/services/newsService";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatVietnameseDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "@/components/ui/news/NewsCard";

const NewsDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNewsDetail(slug);
        console.log("Fetched article data:", data);
        
        setArticle(data);
        
        // If article has related news, set them
        if (data?.related_news && Array.isArray(data.related_news)) {
          setRelatedNews(data.related_news);
        }
      } catch (err) {
        console.error("Error fetching news article:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
      // Scroll to top when slug changes
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Function to share on social media
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || "Tin tức từ Tâm Giao Coffee";

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          alert('Đã sao chép liên kết vào clipboard!');
        });
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 md:py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-3" />
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-500">{error}</h2>
        <p className="mb-8 text-gray-600">
          Không thể tải bài viết này. Vui lòng thử lại sau hoặc quay lại trang tin tức.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/news">Quay lại trang tin tức</Link>
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <p className="mb-8 text-gray-600">
          Bài viết này không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/news">Quay lại trang tin tức</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Hero section with article avatar */}
      <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] bg-gray-900">
        {article.avatar && (
          <Image
            src={article.avatar}
            alt={article.title}
            fill
            priority
            className="object-cover opacity-70"
            onError={(e) => {
              e.target.src = '/news-placeholder.jpg';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
      </section>

      {/* Article content */}
      <section className="-mt-20 relative z-10 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={contentVariants}
            className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg p-6 md:p-10"
          >
            {/* Back button */}
            <Link href="/news" className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-6 transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Quay lại tin tức
            </Link>

            {/* Article header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-6">
                {/* Date */}
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {formatVietnameseDate(article.published_at || article.created_at)}
                </span>
                
                {/* Reading time */}
                {article.read_time && (
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {article.read_time} phút đọc
                  </span>
                )}
                
                {/* Category */}
                {article.category && (
                  <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    {article.category}
                  </span>
                )}
              </div>

              {/* Article excerpt/summary */}
              {article.excerpt && (
                <p className="text-lg font-medium text-muted-foreground italic border-l-4 border-primary/30 pl-4 py-2">
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Share buttons */}
            <div className="flex items-center justify-end space-x-3 mb-8">
              <span className="text-sm text-muted-foreground">Chia sẻ:</span>
              <button 
                onClick={() => handleShare('facebook')} 
                className="p-2 rounded-full bg-muted hover:bg-primary/10 text-primary transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={16} />
              </button>
              <button 
                onClick={() => handleShare('twitter')} 
                className="p-2 rounded-full bg-muted hover:bg-primary/10 text-primary transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={16} />
              </button>
              <button 
                onClick={() => handleShare('copy')} 
                className="p-2 rounded-full bg-muted hover:bg-primary/10 text-primary transition-colors"
                aria-label="Copy link"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Article content */}
            <motion.div 
              variants={contentVariants}
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related articles section */}
      {relatedNews && relatedNews.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Bài Viết Liên Quan
            </h2>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedNews.slice(0, 3).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </motion.div>

            <div className="text-center mt-10">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/news">Xem tất cả bài viết</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter signup */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Đăng ký nhận tin
            </h2>
            <p className="text-muted-foreground mb-6">
              Để lại email để nhận các bài viết mới nhất về cà phê và cập nhật từ Tâm Giao Coffee
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email"
                placeholder="Email của bạn"
                className="flex-1 h-12 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                Đăng ký
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default NewsDetail;