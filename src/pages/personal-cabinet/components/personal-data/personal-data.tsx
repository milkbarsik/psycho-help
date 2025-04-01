import { FC } from 'react';
import { Iuser } from '../../constants';
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './personal-data.module.css';
import editImg from '../../../../assets/images/cabinet/edit.svg';

const PersonalData: FC<{ data: Iuser }> = ({ data }) => {
  const edit = () => {};

  const { logOut } = useAuth();
  const navigate = useNavigate();

  const {
    fetching,
    // isLoading,
    // error
  } = useFetch(async () => {
    const res = await logOut();
    if (res.status === 200) {
      navigate('/');
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <b>
          {data.surname} {data.name} {data.lastname}
        </b>
        <div
          className={styles.edit}
          style={{ backgroundImage: `url(${editImg})` }}
          onClick={edit}
        ></div>
      </div>
      <p>{data.email}</p>
      <p>{data.phoneNumber}</p>
      <button className={styles.button} onClick={() => fetching()}>
        Выход
      </button>
    </div>
  );
};

export default PersonalData;
