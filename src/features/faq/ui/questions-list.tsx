import Question from './question';
import styles from './questions-list.module.css';

const QuestionsList = ({
  questions,
}: {
  questions: Array<{ id: number; ask: string; answer: string }>;
}) => {
  return (
    <div className={styles.wrapper}>
      {questions.map((questionObj) => (
        <Question
          ask={questionObj.ask}
          id={questionObj.id}
          answer={questionObj.answer}
          key={questionObj.id}
        />
      ))}
    </div>
  );
};

export default QuestionsList;
