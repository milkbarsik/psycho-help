import { Layout } from 'antd';
import Header from './components/header/header';
import Footer from './components/footer/footer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './App.module.css';
import AppRouter from './components/router/AppRouter';
import { useEffect } from 'react';
import { useFetch } from './api/useFetch';
import { useAuth } from './api/auth/useAuth';

function App() {

  /* В главном компоненте мы просто подключили импортированный роутер
       Также импортировали общие стили для всего проекта
  */

  // Импортируем необходимые методы для управления состоянием авторизованности
  const { getUser } = useAuth();

  /* Передаем логику запроса в мидлвар по обработке ошибок в запросах,
     который возвращает функцию вызова, статус выполнения запроса и ошибку (в случае её наличия)
  */
  const { fetching, isLoading } = useFetch(async () => {
    await getUser();
  });

  // при загрузке сайта происходит автоматическая проверка на валидность токена
  useEffect(() => {
    fetching();
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout.Content>
        <AppRouter isLoading={isLoading} />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default App;
