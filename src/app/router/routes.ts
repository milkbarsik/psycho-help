import type { FC } from 'react';
import { HomePage } from '@/pages/home-page';
import { PersonalCabinet } from '@/pages/personal-cabinet';
import { FaqPage } from '@/pages/faq-page';
import { DoctorsPage } from '@/pages/doctors-page';
import { DoctorPage } from '@/pages/doctor-page';
import { ResourcesPage, TestPage } from '@/pages';
import { ArticlePage } from '@/pages/article-page';
import { NewsPage } from '@/pages';
import { NewsItemPage } from '@/pages';

/*
 Тип маршрута:
 - "path" — URL-путь
 - "Component" — React-компонент, который будет отрисован по этому пути
 - "navText?" — этот текст отображается в хедере, если маршрут не должен быть в навигации, то navText не указывается

 Здесь использовалось "FC<any>", но "any" убрали,
 так как все текущие страницы не принимают внешних пропсов.

 Если позже появятся страницы с пропсами (например, компоненту нужно будет передавать userId),
 можно сделать тип дженериком:
 *ts
 interface RoutePath<T = Record<string, unknown>> {
   path: string;
   Component: FC<T>;
 }
 и тогда конкретный маршрут можно будет описывать с указанием пропсов:
 *ts
 { path: '/example', Component: ExamplePage as FC<ExampleProps> }
 */

interface routePath {
  path: string;
  Component: FC; // Компонент без пропсов
  navText?: string;
}

export const CABINET_PATH = '/cabinet';

// Список всех урлов, а также компонентов, отрисовываемых при нахождении на одном из них

export const authRoutes: routePath[] = [
  {
    path: '/',
    Component: HomePage,
    navText: 'Главная',
  },
  {
    path: '/therapists/',
    Component: DoctorsPage,
    navText: 'Психологи',
  },
  {
    path: '/therapists/:id',
    Component: DoctorPage,
  },
  {
    path: '/news/',
    Component: NewsPage,
    navText: 'Новости',
  },
  {
    path: '/news/:slug',
    Component: NewsItemPage,
  },
  {
    path: '/resources',
    Component: ResourcesPage,
    navText: 'Полезные материалы',
  },
  {
    path: '/article/:id',
    Component: ArticlePage,
  },
  {
    path: '/test/:id',
    Component: TestPage,
  },
  {
    path: '/faq',
    Component: FaqPage,
    navText: 'FAQ',
  },
  {
    path: CABINET_PATH,
    Component: PersonalCabinet,
  },
];

export const notAuthRoutes: routePath[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/therapists/',
    Component: DoctorsPage,
  },
  {
    path: '/therapists/:id',
    Component: DoctorPage,
  },
  {
    path: '/news/',
    Component: NewsPage,
  },
  {
    path: '/news/:slug',
    Component: NewsItemPage,
  },
  {
    path: '/resources',
    Component: ResourcesPage,
  },
  {
    path: '/article/:id',
    Component: ArticlePage,
  },
  {
    path: '/test/:id',
    Component: TestPage,
  },
  {
    path: '/faq',
    Component: FaqPage,
  },
];

export const NAV_PAGES = authRoutes.filter(
  (route): route is routePath & { navText: string } => !!route.navText,
);
