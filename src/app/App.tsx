import { ConfigProvider, Layout, theme } from 'antd';
import Header from '@/widgets/header/header';
import Footer from '@/widgets/footer/footer';
import { AppContextProvider } from '@/app/context/provider';
// Импортируй созданный ранее провайдер модалок
import styles from './App.module.scss';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/shared/lib/dayjs';
import ru_RU from 'antd/locale/ru_RU';
import { appTheme } from '@/app/theme';
import { BackToTop } from '@/shared/ui';
import { AuthModalProvider } from './provider/AuthModalProvider';

dayjs.locale('ru');

function App() {
  const { currentTheme } = useTheme();
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });
  const themeConfig = {
    ...appTheme,
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };
  return (
    <QueryClientProvider client={client}>
      <ConfigProvider locale={ru_RU} theme={themeConfig}>
        <AppContextProvider>
          <Layout className={styles.layout}>
            <Header />
            <Layout.Content>
              <AppRouter />
            </Layout.Content>
            <Footer />
            <BackToTop />

            <AuthModalProvider />
          </Layout>
        </AppContextProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
