import { FC } from 'react';
import { Iuser } from '../../constants';
import * as St from './personal-data-styles';
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';
import { useNavigate } from 'react-router-dom';

const PersonalData: FC<{ data: Iuser }> = ({ data }) => {
  const edit = () => {};
	
	const {logOut} = useAuth()
	const navigate = useNavigate()
	
  const {fetching, isLoading, error} = useFetch( async () => {
		const res = await logOut()
		if (res.status == 200) {
			navigate('/')
		}
	})

  return (
    <St.wrapper>
      <St.head>
        <b>
          {data.surname} {data.name} {data.lastname}
        </b>
        <St.edit onClick={edit}></St.edit>
      </St.head>
      <p>{data.email}</p>
      <p>{data.phoneNumber}</p>
      <St.button onClick={fetching}>Выход</St.button>
    </St.wrapper>
  );
};

export default PersonalData;
