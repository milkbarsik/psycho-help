import { useState, useRef, useEffect } from 'react';
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
    { link: '/', text: 'Новости' },
    { link: '/resources', text: 'Полезные материалы' },
    { link: '/faq/', text: 'FAQ' },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        <Link
          to="/"
          className={`${styles.header__logo} ${menuOpen ? styles.header__logo_open : ''}`}
          aria-label="Вернуться на главную страницу"
        >
          <Logo />
        </Link>
        <button
          className={`${styles.header__burger} ${menuOpen ? styles.header__burger_open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          // aria-expanded={menuOpen}
          // aria-controls="main-navigation"
          ref={burgerRef}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul
          // id="main-navigation"
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
          <li className={styles.header__auth}>
            {isAuth ? (
              <Link to="/cabinet" className={styles.header__link}>
                <Profile />
              </Link>
            ) : (
              <ModalWindow />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
