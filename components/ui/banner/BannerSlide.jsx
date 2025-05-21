'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getActiveBanners } from '@/services/bannerService';
import styles from './BannerSlide.module.css';

const BannerSlide = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerSlide}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.banner} ${index === currentIndex ? styles.active : ''}`}
          >
            <Image
              src={banner.image}
              alt={banner.title || 'Banner'}
              width={1920}
              height={600}
              priority={index === currentIndex}
              className={styles.bannerImage}
            />
          </div>
        ))}
      </div>
      
      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlide; 