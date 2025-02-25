import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as Bell } from '../../assets/images/header/bell.svg';
import { ReactComponent as Profile } from '../../assets/images/header/profile.svg';
import * as St from './header-style';
import ModalWindow from '../modal/modal';
import { useAuth } from '@/api/auth/useAuth';
const Header = () => {

	const {isAuth} = useAuth()

  return (
    <St.StyledHeader>
      <St.ContentWrapper>
        <Logo />
        <St.link to="/">Главная</St.link>
        <St.link to="/therapists">Психологи</St.link>
        {/* <St.link to="/">Новости</St.link> */}
        {/* <St.link to="/">Полезные материалы</St.link> */}
        <St.link to="/faq">FAQ</St.link>
        {/* <St.link to="#">
          <Bell />
        </St.link> */}
        {/* отображаем кабинет, если авторизован, иначе модалку */}
				{
					isAuth 
						? 
						<St.link to="/cabinet">
							<Profile />
						</St.link>
						:
						<ModalWindow />
				}
      </St.ContentWrapper>
    </St.StyledHeader>
  );
};

export default Header;
