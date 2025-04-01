import { FC, ReactNode, useMemo, useState } from 'react';
import styles from './input-block.module.css';
import { Idoctors } from '../../constants';

const InputBlock: FC<{ date: string; doctors: Idoctors[] }> = ({ date, doctors }) => {
  const [typeReception, setTypeReception] = useState('inPerson');

  const doctorsElems = useMemo<ReactNode[]>(
    () =>
      doctors.map((elem: Idoctors) => (
        <option key={elem.id} value={elem.id}>
          {elem.surname} {elem.name} {elem?.lastname}
        </option>
      )),
    [doctors],
  );

  const items = useMemo(
    () => [
      {
        style: {
          backgroundColor: typeReception === 'online' ? '#5E8BF4' : 'white ',
          color: typeReception === 'online' ? 'white' : 'black',
        },
        onClick: () => setTypeReception('online'),
        type: 'button',
        buttonText: 'Онлайн',
      },
      {
        style: {
          backgroundColor: typeReception === 'inPerson' ? '#5E8BF4' : 'white',
          color: typeReception === 'inPerson' ? 'white' : 'black',
        },
        onClick: () => setTypeReception('inPerson'),
        type: 'button',
        buttonText: 'Очно',
      },
    ],
    [typeReception],
  );

  const options =
    typeReception === 'inPerson'
      ? [
          { value: 'online1', label: 'Онлайн консультация 1' },
          { value: 'online2', label: 'Онлайн консультация 2' },
        ]
      : [
          { value: 'address1', label: 'Очная консультация 1' },
          { value: 'address2', label: 'Очная консультация 2' },
        ];

  return (
    <div className={styles.wrapper}>
      <h2>{date}</h2>
      <input className={styles.input} name="date" type="hidden" value={date} required />
      <label className={styles.label} htmlFor="doctor">
        <select className={styles.select} name="doctor" id="doctor" required>
          {doctorsElems}
        </select>
      </label>
      <label className={styles.label} htmlFor="typeReception">
        <div className={styles.typeReception}>
          {items.map((item, index) => (
            <button
              key={index}
              className={styles.btTypeRec}
              style={item.style}
              onClick={item.onClick}
              type="button"
            >
              {item.buttonText}
            </button>
          ))}
        </div>
        <input
          className={styles.input}
          id="typeReception"
          type="hidden"
          value={typeReception}
          name="typeReception"
        />
      </label>
      <div className={styles.addressTime}>
        <label className={styles.label} htmlFor="location">
          <select className={styles.select} name="location" id="location" required>
            {options.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label} htmlFor="time">
          <input
            className={styles.input}
            name="time"
            type="time"
            step={3600}
            min="08:00"
            max="16:00"
            required
          />
        </label>
      </div>
      <label className={styles.label} htmlFor="comment">
        <textarea
          className={styles.textarea}
          name="comment"
          id="comment"
          placeholder="Коротко опишите проблему"
          required
        />
      </label>
    </div>
  );
};

export default InputBlock;
