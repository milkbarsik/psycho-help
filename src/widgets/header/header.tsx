import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import Logo from './Logo.svg?react';
import Profile from '@/shared/assets/images/header/profile.svg?react';
import ModalWindow from '@/features/auth/modal/modal';

const Header = () => {
  const { isAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const items = [
    { link: '/', text: 'Главная' },
    { link: '/therapists', text: 'Психологи' },
    { link: '/news', text: 'Новости' },
    { link: '/resources', text: 'Полезные материалы' },
    { link: '/faq/', text: 'FAQ' },
  ];

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const initialOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = initialOverflow;
      };
    }
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        <Link
          to="/"
          className={styles.header__logo}
          aria-label="Вернуться на главную страницу"
        >
          <Logo />
        </Link>
        <button
          className={`${styles.header__burger} ${menuOpen ? styles.header__burger_open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          ref={burgerRef}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <ul
          className={`${styles.header__list} ${menuOpen ? styles.header__list_open : ''}`}
          ref={menuRef}
        >
          {items.map((item, index) => (
            <li key={index} className={styles.header__item}>
              <Link
                to={item.link}
                className={styles.header__link}
                onClick={() => setMenuOpen(false)}
              >
                {item.text}
              </Link>
            </li>
          ))}
          <li className={styles.header__item}>
            {isAuth ? (
              <Link to="/cabinet" className={styles.header__link}>
                <Profile className={styles.profileIcon} />
              </Link>
            ) : (
              <ModalWindow onMenuClose={closeMenu} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
