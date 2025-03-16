import React from 'react';
import { user, doctors } from './constants';
import PersonalData from './components/personal-data/personal-data';
import { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from './components/calendar/calendar';
import InputBlock from './components/input-block/input-block';

const PersonalCabinet: FC = () => {
  const [date, setDate] = React.useState<string>('');

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <h1 className={styles.h1}>Запись на прием</h1>
        <form className={styles.form} method="post" action="127.0.0.1">
          <ACalendar getDate={setDate} />
          <input type="hidden" name="date" value={date} required />
          <InputBlock date={date} doctors={doctors} />
          <button className={styles.subButton} type="submit">Записаться</button>
        </form>
      </main>
      <aside className={styles.aside}>
        <PersonalData data={user} />
      </aside>
    </div>
  );
};

export default PersonalCabinet;
