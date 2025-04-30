import { useState } from 'react';
import styles from './question.module.css';
import buttonImage from '../../../assets/images/main/question/button.svg';
import ActivebuttonImage from '../../../assets/images/main/question/active-button.svg';

const Question = ({ id, ask, answer }: { id: number; ask: string; answer: string }) => {
  const [isActive, setActive] = useState(false);

  function onClick() {
    setActive((prev) => !prev);
  }

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.ask}>
        <div
          className={styles.button}
          style={{ backgroundImage: `url(${isActive ? ActivebuttonImage : buttonImage})` }}
        ></div>
        <p className={styles.p}>{ask}</p>
      </div>
      {isActive && <p className={styles.answer}>{answer}</p>}
    </div>
  );
};

export default Question;
