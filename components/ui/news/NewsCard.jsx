import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { truncateHTML, formatVietnameseDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const NewsCard = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/news-placeholder.jpg";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageError ? fallbackImage : article.thumbnail}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setImageError(true)}
        />
        {article.category && (
          <span className="absolute top-3 left-3 bg-[#53382C]/90 text-white text-xs px-2 py-1 rounded">
            {article.category}
          </span>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center text-xs text-gray-500 space-x-4 mb-2">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatVietnameseDate(article.published_at || article.created_at)}
          </span>
        </div>
        
        <Link href={`/news/${article.slug}`} className="block">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {truncateHTML(article.excerpt || article.content, 120)}
        </p>
        
        <Link 
          href={`/news/${article.slug}`}
          className="inline-flex items-center text-sm font-medium text-[#53382C] hover:text-primary transition-colors mt-auto"
        >
          Đọc bài viết
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default NewsCard;