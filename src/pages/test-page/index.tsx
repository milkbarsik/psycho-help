import { useState } from 'react';
import clsx from 'clsx';
import { mockTestData } from './mocks';
import { TRANSLATES as t } from './constants';
import { asArray } from '@/shared/lib/coerce';
import styles from './TestPage.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import type { TTestAnswers } from './models';

export const TestPage = () => {
  const { slug } = useParams();
  const data = mockTestData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TTestAnswers>({});
  const navigate = useNavigate();

  const questions = asArray(data?.questions);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigate(`/resources?entity=tests`);
    }
  };

  const handleFinish = () => {
    navigate(`/test/${slug}/result`, { state: { answers } });
  };

  if (!currentQuestion) {
    return <div>{t.notFound}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.counter} aria-live="polite">
          {currentQuestionIndex + 1} {t.of} {data.questions.length}
        </div>
      </div>

      <div className={styles.question}>
        <h1 className={styles.title}>{currentQuestion.title}</h1>

        <div className={styles.options}>
          {asArray(currentQuestion.options).map((option) => (
            <button
              type="button"
              key={option.id}
              aria-pressed={answers[currentQuestion.id] === option.id}
              className={clsx(styles.option, {
                [styles.selected]: answers[currentQuestion.id] === option.id,
              })}
              onClick={() => handleAnswer(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={`${styles.buttonAction} ${styles.buttonActionBack}`}
          onClick={handlePrev}
        >
          {t.back}
        </button>

        {isLastQuestion ? (
          <button
            className={`${styles.buttonAction} ${styles.buttonActionComplete}`}
            onClick={handleFinish}
            disabled={!answers[currentQuestion.id]}
          >
            {t.finish}
          </button>
        ) : (
          <button
            className={`${styles.buttonAction} ${styles.buttonActionNext}`}
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            {t.next}
          </button>
        )}
      </div>
    </div>
  );
};
