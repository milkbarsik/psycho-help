import { Layout } from 'antd';
import Header from '@/widgets/header/header';
import Footer from '@/widgets/footer/footer';
import { AppContextProvider } from '@/app/context/provider';
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
