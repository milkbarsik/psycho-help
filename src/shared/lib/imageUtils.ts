/**
 * Утилиты для работы с изображениями
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

/**
 * Генерирует оптимизированный URL изображения
 */
export const getOptimizedImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // Если это внешний URL, возвращаем как есть
  if (src.startsWith('http')) {
    return src;
  }
  
  // Для локальных изображений можно добавить параметры оптимизации
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};

/**
 * Генерирует srcSet для responsive изображений
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: number[] = [320, 640, 1024, 1920],
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
): string => {
  const baseName = baseSrc.replace(/\.[^/.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  
  return sizes
    .map(size => `${baseName}-${size}w.${extension} ${size}w`)
    .join(', ');
};

/**
 * Проверяет поддержку WebP в браузере
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Проверяет поддержку AVIF в браузере
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABkAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEAwgMgk8AAAAB3J0aW4AAAAA';
  });
};

/**
 * Получает оптимальный формат изображения для браузера
 */
export const getOptimalImageFormat = async (): Promise<'avif' | 'webp' | 'jpeg'> => {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpeg';
};
