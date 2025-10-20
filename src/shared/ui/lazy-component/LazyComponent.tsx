import React, { Suspense, type ReactNode } from 'react';
import { useLazyComponent } from '@/shared/lib/useLazyComponent';
import { Loader } from '../loader';
import styles from './LazyComponent.module.css';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <Loader />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = '',
}) => {
  const { ref, isVisible } = useLazyComponent({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div ref={ref} className={`${styles.lazyContainer} ${className}`}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div className={styles.placeholder}>
          {fallback}
        </div>
      )}
    </div>
  );
};
