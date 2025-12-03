import styles from './question.module.css';
import buttonImage from '@/shared/assets/images/main/question/button.svg';
import clsx from 'clsx';

const Question = ({
  id,
  ask,
  answer,
  onToggle,
  isActive,
}: {
  id: number;
  ask: string;
  answer: string;
  onToggle: (param: number) => void;
  isActive: boolean;
}) => {
  return (
    <div
      className={clsx(styles.wrapper, { [styles.active]: isActive })}
      onClick={() => onToggle(id)}
    >
      <div className={styles.ask}>
        <p className={styles.p}>{ask}</p>
        <img className={styles.button} src={buttonImage} alt="" />
      </div>
      <p className={styles.answer}>{answer}</p>
    </div>
  );
};

export default Question;
