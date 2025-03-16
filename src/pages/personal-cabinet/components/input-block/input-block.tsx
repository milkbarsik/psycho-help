import { FC, ReactNode, useState } from 'react';
import styles from './input-block.module.css';
import { Idoctors } from '../../constants';

const InputBlock: FC<{ date: string; doctors: Idoctors[] }> = ({ date, doctors }) => {
  const [typeReception, setTypeReception] = useState('inPerson');

  const doctorsElems = (): ReactNode[] =>
    doctors.map((elem: Idoctors) => (
      <option key={elem.id} value={elem.id}>
        {elem.surname} {elem.name} {elem?.lastname}
      </option>
    ));

  return (
    <div className={styles.wrapper}>
      <h2>{date}</h2>
      <input className={styles.input} name="date" type="hidden" value={date} required />
      <label className={styles.label} htmlFor="doctor">
        <select className={styles.select} name="doctor" id="doctor" required>
          {doctorsElems()}
        </select>
      </label>
      <label className={styles.label} htmlFor="typeReception">
        <div className={styles.typeReception}>
          <button
            className={styles.btTypeRec}
            style={{ backgroundColor: typeReception === 'online' ? '#5E8BF4' : 'white' }}
            onClick={() => setTypeReception('online')}
            type="button"
          >
            Онлайн
          </button>
          <button
            className={styles.btTypeRec}
            style={{ backgroundColor: typeReception === 'inPerson' ? '#5E8BF4' : 'white' }}
            onClick={() => setTypeReception('inPerson')}
            type="button"
          >
            Очно
          </button>
        </div>
        <input className={styles.input} id="typeReception" type="hidden" value={typeReception} name="typeReception" />
      </label>
      <div className={styles.addressTime}>
        <label className={styles.label} htmlFor="location">
          <select className={styles.select} name="location" id="location" required>
            <option value="address1">address1</option>
            <option value="address2">address2</option>
          </select>
        </label>
        <label className={styles.label} htmlFor="time">
          <input className={styles.input} name="time" type="time" step={3600} min="08:00" max="16:00" required />
        </label>
      </div>
      <label className={styles.label} htmlFor="comment">
        <input className={styles.input} type="text" name="comment" id="comment" placeholder="Коротко опишите проблему" required />
      </label>
    </div>
  );
};

export default InputBlock;
