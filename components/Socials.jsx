'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSocialLinks } from '@/services/socialService';

const Socials = ({ containerStyles, iconsStyles }) => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const links = await getSocialLinks();
        console.log("Social Links:", links);
        
        setSocialLinks(links);
      } catch (error) {
        console.error("Error loading social links:", error);
        // Fallback nếu API lỗi - sử dụng mảng rỗng
        setSocialLinks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocialLinks();
  }, []);

  if (loading) {
    return (
      <div className={`${containerStyles} opacity-50`}>
        {/* Hiển thị placeholder khi đang tải */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`${iconsStyles} animate-pulse bg-gray-200 rounded-full`} />
        ))}
      </div>
    );
  }
  
  // Nếu không có dữ liệu từ API, hiển thị component trống
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`${containerStyles}`}>
      {socialLinks.map((social, index) => {
        return (
          <Link 
            href={social.link || '/'} 
            key={social.id || index} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={social.name}
          >
            <div className={`${iconsStyles} flex items-center justify-center`}>
              {/* Hiển thị icon từ file SVG */}
              {social.icon ? (
                <Image 
                  src={social.icon} 
                  alt={social.name || 'Social icon'}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                /* Fallback nếu không có icon */
                <span className="text-xs">{social.name?.charAt(0) || '?'}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;