/* Используемые в проекте библиотеки:
  React-Router - для переходов по урлам
  antd - По сути, готовые компоненты
  axios - для удобных запросов к БД
*/

/* Композиция проекта:
 В целом обычная для React (страницы делятся на компоненты и отдельно пишутся) 
 В src/components сделаны переиспользуемые компоненты, которые могут появиться несколько раз за проект
 В src/pages сделаны собственно сами страницы сайта
 Элементы со стилями выделены в отдельный файл, откуда потом импортируются в файл компонента и там используются
 В папке API выведена вся работа с БД, .
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalStyles from './global-styles';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
