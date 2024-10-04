import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './pages/home-page/home-page';
import Header from './components/header/header';
import Footer from './components/footer/footer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styled from 'styled-components';

const LayoutStyle = styled(Layout)`
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
`;

function App() {
  return (
    <LayoutStyle>
      <Header />
      <Layout.Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout.Content>
      <Footer />
    </LayoutStyle>
  );
}

export default App;
