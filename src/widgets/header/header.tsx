import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import Logo from './Logo.svg?react';
import Burger from '@/widgets/Burger.svg?react';
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
    { link: '/', text: 'Полезные материалы' },
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
        <Link to="/" aria-label="Вернуться на главную страницу">
          <Logo className={styles.header__logo} />
        </Link>
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Открыть меню"
          ref={burgerRef}
        >
          <Burger />
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
