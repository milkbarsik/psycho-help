import React, { FC } from 'react';
import { Iuser } from '../../constants';
import styles from './personal-data.module.css';
import editImg from '../../../../assets/images/cabinet/edit.svg';

const PersonalData: FC<{ data: Iuser }> = ({ data }) => {
  const edit = () => { };

  const logOut = () => { };

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
      <button className={styles.button} onClick={logOut}>
        Выход
      </button>
    </div>
  );
};

export default PersonalData;
