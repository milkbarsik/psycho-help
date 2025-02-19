import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './pages/home-page/home-page';
import PersonalCabinet from './pages/personal-cabinet/personal-cabinet';
import Header from './components/header/header';
import Footer from './components/footer/footer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styled from 'styled-components';
import AppRouter from './components/router/AppRouter';

const LayoutStyle = styled(Layout)`
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
`;

function App() {
  /* В главном компоненте мы просто подключили импортированный роутер
     Также импортировали общие стили для всего проекта
  */
  return (
    <LayoutStyle>
      <Header />
      <Layout.Content>
        <AppRouter />
      </Layout.Content>
      <Footer />
    </LayoutStyle>
  );
}

export default App;
