import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import Logo from './Logo.svg?react';
import Profile from '@/shared/assets/images/header/profile.svg?react';
import Auth from '@/features/auth/modal/icons/Auth.svg?react';
import ModalWindow from '@/features/auth/modal/modal';

const items = [
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
      <div className={styles.header__inner}>
        <nav className={styles.header__nav}>
          <Link to="/" className={styles.header__logo} aria-label="Вернуться на главную страницу">
            <Logo />
          </Link>
          <button
            className={`${styles.header__burger} ${menuOpen ? styles.header__burger_open : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
          <ul
            className={`${styles.header__list} ${isAnimating ? styles.header__list_animating : ''} ${menuOpen ? styles.header__list_open : ''}`}
          >
            {items.map((item, index) => (
              <li key={index} className={styles.header__item}>
                <Link to={item.link} className={styles.header__link} onClick={closeMenu}>
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
                <button
                  className={styles.header__authButton}
                  onClick={handleAuthClick}
                  aria-label="Открыть окно входа"
                >
                  <Auth />
                  <span>Войти</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {!isAuth && <ModalWindow isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
    </header>
  );
};

export default Header;
