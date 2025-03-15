// import React from 'react';
import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader__wrapper}>
      <span className={styles.loader__item}></span>
      <span className={styles.loader__text}>Загрузка...</span>
    </div>
  );
};

export default Loader;
