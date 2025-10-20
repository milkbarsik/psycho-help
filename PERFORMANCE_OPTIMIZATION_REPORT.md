# Отчет по оптимизации производительности

## Обзор выполненной работы

Была проведена комплексная оптимизация производительности React приложения, включающая настройку code splitting, lazy loading, анализ размера бандла и оптимизацию изображений.

## 1. Code Splitting и Lazy Loading

### 1.1 Настройка Vite для code splitting

**Файл:** `vite.config.ts`

```typescript
// Добавлен rollup-plugin-visualizer для анализа бандла
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Разделение vendor библиотек
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('antd')) {
              return 'antd-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            return 'vendor';
          }
          
          // Разделение страниц
          if (id.includes('src/pages')) {
            const pageName = id.split('src/pages/')[1].split('/')[0];
            return `page-${pageName}`;
          }
          
          // Разделение функциональных модулей
          if (id.includes('src/features')) {
            const featureName = id.split('src/features/')[1].split('/')[0];
            return `feature-${featureName}`;
          }
          
          // Общие компоненты
          if (id.includes('src/shared')) {
            return 'shared';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  }
})
```

**Результат:**
- Бандл разделен на логические чанки
- React и React DOM выделены в отдельный чанк
- Ant Design компоненты в отдельный чанк
- Каждая страница в свой чанк
- Функциональные модули разделены по чанкам

### 1.2 Lazy Loading страниц

**Файл:** `src/app/router/routes.ts`

```typescript
import { lazy } from 'react';

// Lazy loading для всех страниц
const HomePage = lazy(() => import('@/pages/home-page').then(module => ({ default: module.HomePage })));
const PersonalCabinet = lazy(() => import('@/pages/personal-cabinet').then(module => ({ default: module.PersonalCabinet })));
const FaqPage = lazy(() => import('@/pages/faq-page').then(module => ({ default: module.FaqPage })));
const DoctorsPage = lazy(() => import('@/pages/doctors-page').then(module => ({ default: module.DoctorsPage })));
const DoctorPage = lazy(() => import('@/pages/doctor-page').then(module => ({ default: module.DoctorPage })));
```

**Файл:** `src/app/router/AppRouter.tsx`

```typescript
import { Suspense } from 'react';

return (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* маршруты */}
    </Routes>
  </Suspense>
);
```

**Результат:**
- Страницы загружаются только при переходе на них
- Уменьшен начальный размер бандла
- Улучшена скорость первой загрузки

## 2. Анализ размера бандла

### 2.1 Настройка анализатора

**Добавлен пакет:** `rollup-plugin-visualizer`

**Команда для анализа:**
```bash
npm run build:analyze
```

**Результат:**
- Генерируется HTML отчет в `dist/stats.html`
- Показывает размер каждого чанка
- Включает gzip и brotli размеры
- Визуализация дерева зависимостей

## 3. Оптимизация изображений

### 3.1 Компонент OptimizedImage

**Файл:** `src/shared/ui/optimized-image/OptimizedImage.tsx`

**Функциональность:**
- Lazy loading с Intersection Observer
- Поддержка современных форматов (WebP, AVIF)
- Responsive images с srcSet
- Placeholder изображения
- Error handling
- Анимация загрузки

**Ключевые особенности:**

```typescript
// Intersection Observer для lazy loading
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

// Генерация srcSet для разных форматов
const generateSrcSet = (baseSrc: string) => {
  const baseName = baseSrc.replace(/\.[^/.]+$/, '');
  const extension = baseSrc.split('.').pop();
  
  const webpSrcSet = [
    `${baseName}-320w.webp 320w`,
    `${baseName}-640w.webp 640w`,
    `${baseName}-1024w.webp 1024w`,
    `${baseName}-1920w.webp 1920w`,
  ].join(', ');

  // Аналогично для AVIF и fallback форматов
};
```

### 3.2 Стили для OptimizedImage

**Файл:** `src/shared/ui/optimized-image/OptimizedImage.module.css`

**Особенности:**
- Плавная анимация появления изображения
- Skeleton loading эффект
- Responsive поведение
- Error state стили

```css
.image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image.loaded {
  opacity: 1;
}

/* Skeleton loading */
.imageContainer::before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

### 3.3 Утилиты для работы с изображениями

**Файл:** `src/shared/lib/imageUtils.ts`

**Функции:**
- `getOptimizedImageUrl()` - генерация оптимизированных URL
- `generateSrcSet()` - создание responsive srcSet
- `supportsWebP()` / `supportsAVIF()` - проверка поддержки форматов
- `getOptimalImageFormat()` - выбор оптимального формата

### 3.4 Обновление существующего компонента Img

**Файл:** `src/shared/ui/img/Img.tsx`

```typescript
// Обновлен для использования OptimizedImage
return (
  <OptimizedImage
    src={imgSrc}
    alt=""
    width={width}
    height={height}
    className={className}
    priority={priority}
    onError={handleError}
  />
);
```

## 4. Lazy Loading компонентов

### 4.1 Хук useLazyComponent

**Файл:** `src/shared/lib/useLazyComponent.ts`

```typescript
export const useLazyComponent = (options: UseLazyComponentOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Intersection Observer логика
  // ...
};
```

### 4.2 Компонент LazyComponent

**Файл:** `src/shared/ui/lazy-component/LazyComponent.tsx`

```typescript
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
```

## 5. Дополнительные оптимизации

### 5.1 Минификация

**Настройки Terser:**
- Удаление `console.log` в продакшене
- Удаление `debugger` statements
- Агрессивная минификация кода

### 5.2 Настройки сборки

- Увеличен лимит предупреждений о размере чанков до 1000KB
- Включена минификация с Terser
- Оптимизированное разделение кода

## 6. Результаты оптимизации

### 6.1 Улучшения производительности

1. **Code Splitting:**
   - Начальный бандл уменьшен за счет lazy loading страниц
   - Логическое разделение кода на чанки
   - Лучшее кэширование отдельных частей приложения

2. **Lazy Loading:**
   - Страницы загружаются по требованию
   - Компоненты загружаются при появлении в viewport
   - Изображения загружаются с задержкой

3. **Оптимизация изображений:**
   - Поддержка современных форматов (WebP/AVIF)
   - Responsive изображения
   - Lazy loading изображений
   - Placeholder и error handling

### 6.2 Инструменты для мониторинга

- **Bundle Analyzer:** `npm run build:analyze`
- **HTML отчет:** `dist/stats.html`
- **Визуализация:** Интерактивное дерево зависимостей

## 7. Рекомендации по использованию

### 7.1 Для изображений

```typescript
// Используйте OptimizedImage вместо обычных img тегов
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Описание"
  width={300}
  height={200}
  priority={true} // для изображений выше сгиба
  placeholder="/path/to/placeholder.jpg"
/>
```

### 7.2 Для компонентов

```typescript
// Обертывайте тяжелые компоненты в LazyComponent
<LazyComponent
  threshold={0.1}
  rootMargin="50px"
  triggerOnce={true}
>
  <HeavyComponent />
</LazyComponent>
```

### 7.3 Для анализа

```bash
# Анализ размера бандла
npm run build:analyze

# Откройте dist/stats.html в браузере
```

## 8. Дальнейшие возможности оптимизации

1. **Service Worker** для кэширования
2. **Preloading** критических ресурсов
3. **React.memo** для предотвращения лишних ререндеров
4. **Virtual scrolling** для больших списков
5. **Tree shaking** для неиспользуемого кода

## Заключение

Проведенная оптимизация значительно улучшила производительность приложения:

- ✅ Настроен code splitting и lazy loading
- ✅ Добавлен анализ размера бандла
- ✅ Оптимизированы изображения
- ✅ Созданы утилиты для lazy loading
- ✅ Улучшена общая архитектура производительности

Приложение теперь загружается быстрее, использует меньше трафика и предоставляет лучший пользовательский опыт.
