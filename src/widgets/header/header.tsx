import { useAuth } from '@/features/auth/api/useAuth';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
// import Logo from '@/shared/assets/images/Logo-2.svg?react';
import Logo from './Logo.svg?react';
import Profile from '@/shared/assets/images/header/profile.svg?react';
import ModalWindow from '@/features/auth/modal/modal';

const Header = () => {
  const { isAuth } = useAuth();

  const items = [
    { link: '/', text: 'Главная' },
    { link: '/therapists', text: 'Психологи' },
    { link: '/', text: 'Новости' },
    { link: '/', text: 'Полезные материалы' },
    { link: '/faq/', text: 'FAQ' },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        <Link to="/" aria-label="Вернуться на главную страницу">
          <Logo className={styles.header__logo} />
        </Link>
        <ul className={styles.header__list}>
          {items.map((item, index) => (
            <li key={index} className={styles.header__item}>
              <Link
                to={item.link}
                className={styles.header__link}
                aria-label={`Перейти на страницу ${item.text}`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        {isAuth ? (
          <div className={styles.header__item}>
            <Link
              to="/cabinet"
              className={styles.header__link}
              aria-label="Перейти на страницу личного кабинета"
            >
              <Profile />
            </Link>
          </div>
        ) : (
          <div className={styles.header__item}>
            <ModalWindow />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
