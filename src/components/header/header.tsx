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
        <St.link href="/">Главная</St.link>
        <St.link href="/therapists/">Психологи</St.link>
        {/* <St.link href="/">Новости</St.link> */}
        {/* <St.link href="/">Полезные материалы</St.link> */}
        <St.link href="/faq">FAQ</St.link>
        {/* <St.link href="#">
          <Bell />
        </St.link> */}
        {/* отображаем кабинет, если авторизован, иначе модалку */}
				{
					isAuth 
						? 
						<St.link href="/cabinet">
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
