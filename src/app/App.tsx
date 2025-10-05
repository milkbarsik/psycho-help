import { Layout } from 'antd';
import Header from '@/widgets/header/header';
import Footer from '@/widgets/footer/footer';
import { AppContextProvider } from '@/app/context/provider';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './App.module.scss';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AppContextProvider>
      <Layout className={styles.layout}>
        <Header />
        <Layout.Content>
          <AppRouter />
        </Layout.Content>
        <Footer />
      </Layout>
    </AppContextProvider>
  );
}

export default App;
