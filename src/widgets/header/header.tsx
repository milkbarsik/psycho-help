import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import Logo from '@/shared/assets/images/logo.svg?react';
import Profile from '@/shared/assets/images/header/profile.svg?react';
import Auth from '@/shared/assets/images/header/Auth.svg?react';
import ModalWindow from '@/features/auth/modal/modal';

const PAGES = [
  { link: '/', text: 'Главная' },
  { link: '/therapists', text: 'Психологи' },
  { link: '/news', text: 'Новости' },
  { link: '/resources', text: 'Полезные материалы' },
  { link: '/faq/', text: 'FAQ' },
];

const Header = () => {
  const { isAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      setIsAnimating(true);
      setMenuOpen(true);
    }
  }, [menuOpen, closeMenu]);

  const handleAuthClick = () => {
    closeMenu();
    setModalOpen(true);
  };

  useEffect(() => {
    if (menuOpen) {
      const initialOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = initialOverflow;
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200 && menuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen, closeMenu]);

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav} aria-label="Основная навигация">
        <Link to="/" className={styles.header__logo} aria-label="Вернуться на главную страницу">
          <Logo aria-hidden="true" />
        </Link>
        <button
          className={`${styles.header__burger} ${menuOpen ? styles.header__burger_open : ''}`}
          onClick={toggleMenu}
          type="button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <ul
          className={`${styles.header__list} ${isAnimating ? styles.header__list_animating : ''} ${menuOpen ? styles.header__list_open : ''}`}
        >
          {PAGES.map((item, index) => (
            <li key={index} className={styles.header__item}>
              <Link to={item.link} className={styles.header__link} onClick={closeMenu}>
                {item.text}
              </Link>
            </li>
          ))}
          <li className={styles.header__item}>
            {isAuth ? (
              <Link
                to="/cabinet"
                className={styles.header__link}
                aria-label="Личный кабинет"
                onClick={closeMenu}
              >
                <Profile className={styles.header__profile} aria-hidden="true" />
              </Link>
            ) : (
              <button
                className={styles.header__auth}
                onClick={handleAuthClick}
                type="button"
                aria-label="Открыть окно входа"
              >
                <Auth aria-hidden="true" />
                <span>Войти</span>
              </button>
            )}
          </li>
        </ul>
      </nav>
      {!isAuth && <ModalWindow isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
    </header>
  );
};

export default Header;
