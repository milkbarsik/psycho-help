import { ConfigProvider, Layout } from 'antd';
import Header from '@/widgets/header/header';
import Footer from '@/widgets/footer/footer';
import { AppContextProvider } from '@/app/context/provider';
import styles from './App.module.scss';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import ru_RU from 'antd/locale/ru_RU';
import { appTheme } from '@/app/utils';

dayjs.locale('ru');

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider locale={ru_RU} theme={appTheme}>
        <AppContextProvider>
          <Layout className={styles.layout}>
            <Header />
            <Layout.Content>
              <AppRouter />
            </Layout.Content>
            <Footer />
          </Layout>
        </AppContextProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
