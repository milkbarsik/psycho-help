import { ReactComponent as Logo } from '../../assets/images/logo.svg';
// import { ReactComponent as Bell } from '../../assets/images/header/bell.svg';
import { ReactComponent as Profile } from '../../assets/images/header/profile.svg';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import ModalWindow from '../modal/modal';
import { useAuth } from '@/api/auth/useAuth';

const Header = () => {
  const { isAuth } = useAuth();

  const items = [
    { link: '/', text: 'Главная' },
    { link: '/therapists', text: 'Психологи' },
    { link: '/faq/', text: 'FAQ' },
  ];

  return (
    <header className={styles.styledHeader}>
      <nav className={styles.contentWrapper}>
        <ul className={styles.contentList}>
          <li>
            <Link to="/">
              <Logo />
            </Link>
          </li>
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
