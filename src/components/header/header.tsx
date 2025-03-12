import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as Bell } from '../../assets/images/header/bell.svg';
import { ReactComponent as Profile } from '../../assets/images/header/profile.svg';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import ModalWindow from '../modal/modal';
import { useAuth } from '@/api/auth/useAuth';

const Header = () => {
  const { isAuth } = useAuth();

  return (
    <header className={styles.styledHeader}>
      <div className={styles.contentWrapper}>
        <Logo />
        <Link to="/" className={styles.link}>Главная</Link>
        <Link to="/therapists/" className={styles.link}>Психологи</Link>
        <Link to="/faq" className={styles.link}>FAQ</Link>
        {
          isAuth ? (
            <Link to="/cabinet" className={styles.link}>
              <Profile />
            </Link>
          ) : (
            <ModalWindow />
          )
        }
      </div>
    </header>
  );
};

export default Header;
