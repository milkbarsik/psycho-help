import Logo from '@/shared/assets/images/Logo-2.svg?react';
// import { ReactComponent as Bell } from '../../assets/images/header/bell.svg';
import Profile from '@/shared/assets/images/header/profile.svg?react';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import ModalWindow from '@/features/auth/modal/modal';
import { useAuth } from '@/features/auth/api/useAuth';

const Header = () => {
  const { isAuth } = useAuth();

  const items = [
    { link: '/', text: 'Главная' },
    { link: '/therapists', text: 'Психологи' },
    { link: '/', text: 'Новости' },
    { link: '/resources', text: 'Полезные материалы' },
    { link: '/faq/', text: 'FAQ' },
  ];

  return (
    <header className={styles.styledHeader}>
      <nav className={styles.contentWrapper}>
        <Link to="/" aria-label="Вернуться на главную страницу">
          <Logo />
        </Link>
        <ul className={styles.contentList}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              <Link
                to={item.link}
                className={styles.link}
                aria-label={`Перейти на страницу ${item.text}`}
              >
                {item.text}
              </Link>
            </li>
          ))}
          {isAuth ? (
            <li className={styles.item}>
              <Link
                to="/cabinet"
                className={styles.link}
                aria-label="Перейти на страницу личного кабинета"
              >
                <Profile />
              </Link>
            </li>
          ) : (
            <li className={styles.item}>
              <ModalWindow />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
