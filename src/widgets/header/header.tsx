// import { ReactComponent as Logo } from '../../assets/images/Logo-2.svg';
import { ReactComponent as Logo } from '@/shared/assets/images/Logo-2.svg';
// import { ReactComponent as Bell } from '../../assets/images/header/bell.svg';
import { ReactComponent as Profile } from '@/shared/assets/images/header/profile.svg';
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
    { link: '/', text: 'Полезные ресурсы' },
    { link: '/faq/', text: 'FAQ' },
  ];

  return (
    <header className={styles.styledHeader}>
      <nav className={styles.contentWrapper}>
        <Link to="/">
          <Logo />
        </Link>
        <ul className={styles.contentList}>
          {items.map((item, index) => (
            <li key={index}>
              <Link to={item.link} className={styles.link}>
                {item.text}
              </Link>
            </li>
          ))}
          {isAuth ? (
            <li>
              <Link to="/cabinet" className={styles.link}>
                <Profile />
              </Link>
            </li>
          ) : (
            <li>
              <ModalWindow />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
