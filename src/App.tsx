import { Layout } from 'antd';
import Header from './components/header/header';
import Footer from './components/footer/footer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styled from 'styled-components';
import AppRouter from './components/router/AppRouter';
import { useEffect } from 'react';
import { useFetch } from './api/useFetch';
import { useAuth } from './api/auth/useAuth';

const LayoutStyle = styled(Layout)`
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
`;

function App() {
  /* В главном компоненте мы просто подключили импортированный роутер
     Также импортировали общие стили для всего проекта
  */


	// Импортируем необходимые методы для управления состоянием авторизованности
	const {getUser, setUser, setAuth} = useAuth();

	/* Передаем логику запроса в мидлвар по обработке ошибок в запросах,
		который возварщает функцию вызова, статус выполнения запроса и ошибку (в случае ее наличия)
	*/
	const {fetching, isLoading, error} = useFetch( async () => {
		const res = await getUser();
		if (res.status === 200) {
			setUser(res.data.email);
			setAuth(true);
		}
	});

 // при загрузке сайта происходит автоматическая проверка на валидность токена
	useEffect(() => {
		fetching();
	}, [])

  return (
    <LayoutStyle>
      <Header />
      <Layout.Content>
        <AppRouter isLoading={isLoading}/>
      </Layout.Content>
      <Footer />
    </LayoutStyle>
  );
}

export default App;
