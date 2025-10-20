import React, { useState, useRef, useEffect } from 'react';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const generateSrcSet = (baseSrc: string) => {
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');
    const extension = baseSrc.split('.').pop();
    
    const webpSrcSet = [
      `${baseName}-320w.webp 320w`,
      `${baseName}-640w.webp 640w`,
      `${baseName}-1024w.webp 1024w`,
      `${baseName}-1920w.webp 1920w`,
    ].join(', ');

    const avifSrcSet = [
      `${baseName}-320w.avif 320w`,
      `${baseName}-640w.avif 640w`,
      `${baseName}-1024w.avif 1024w`,
      `${baseName}-1920w.avif 1920w`,
    ].join(', ');

    const fallbackSrcSet = [
      `${baseName}-320w.${extension} 320w`,
      `${baseName}-640w.${extension} 640w`,
      `${baseName}-1024w.${extension} 1024w`,
      `${baseName}-1920w.${extension} 1920w`,
    ].join(', ');

    return { webpSrcSet, avifSrcSet, fallbackSrcSet };
  };

  const { webpSrcSet, avifSrcSet, fallbackSrcSet } = generateSrcSet(src);

  if (hasError) {
    return (
      <div 
        className={`${styles.errorPlaceholder} ${className}`}
        style={{ width, height }}
        ref={imgRef}
      >
        <span>Изображение не загружено</span>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.imageContainer} ${className}`}
      style={{ width, height }}
      ref={imgRef}
    >
      {!isInView && placeholder && (
        <div className={styles.placeholder}>
          <img 
            src={placeholder} 
            alt="" 
            className={styles.placeholderImage}
          />
        </div>
      )}
      
      {isInView && (
        <picture>
          <source 
            srcSet={avifSrcSet} 
            type="image/avif"
            sizes={`(max-width: 640px) 320px, (max-width: 1024px) 640px, (max-width: 1920px) 1024px, 1920px`}
          />
          <source 
            srcSet={webpSrcSet} 
            type="image/webp"
            sizes={`(max-width: 640px) 320px, (max-width: 1024px) 640px, (max-width: 1920px) 1024px, 1920px`}
          />
          <img
            src={src}
            srcSet={fallbackSrcSet}
            sizes={`(max-width: 640px) 320px, (max-width: 1024px) 640px, (max-width: 1920px) 1024px, 1920px`}
            alt={alt}
            width={width}
            height={height}
            className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};
