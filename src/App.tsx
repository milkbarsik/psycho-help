import { Layout } from 'antd';
import Header from './components/header/header';
import Footer from './components/footer/footer';


import styles from './App.module.css';
import AppRouter from './components/router/AppRouter';
import { useEffect, useState } from 'react';
import { useFetch } from './api/useFetch';
import { useAuth } from './api/auth/useAuth';

function App() {
  const [isUserLoading, setUserLoading] = useState<boolean>(true);

  /* В главном компоненте мы просто подключили импортированный роутер
       Также импортировали общие стили для всего проекта
  */

  // Импортируем необходимые методы для управления состоянием авторизованности
  const { getUser } = useAuth();

  /* Передаем логику запроса в мидлвар по обработке ошибок в запросах,
     который возвращает функцию вызова, статус выполнения запроса и ошибку (в случае её наличия)
  */
  const { fetching } = useFetch(async () => {
    await getUser().finally(() => {
      setUserLoading(false);
    });
  });

  // при загрузке сайта происходит автоматическая проверка на валидность токена
  useEffect(() => {
    fetching();
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout.Content>
        <AppRouter isLoading={isUserLoading} />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default App;
