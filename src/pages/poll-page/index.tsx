import { Button } from '@/shared/ui';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSLATES as t } from './constants';
import { mockPollData } from './mocks';
import type { TPollAnswers } from './models';
import { asArray } from '@/shared/lib/coerce';
import styles from './PollPage.module.scss';

type TPollStep = 'questions' | 'feedback' | 'finished';

const RATING_VALUES = [1, 2, 3, 4, 5];

export const PollPage = () => {
  const data = mockPollData;
  const [step, setStep] = useState<TPollStep>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TPollAnswers>({});
  const [rating, setRating] = useState(0);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [isFeedbackErrorVisible, setIsFeedbackErrorVisible] = useState(false);
  const navigate = useNavigate();

  const feedbackErrorText = !rating
    ? recommend === null
      ? t.feedbackErrorBoth
      : t.feedbackErrorRating
    : recommend === null
      ? t.feedbackErrorRecommend
      : '';

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
      navigate(`/resources?entity=polls`);
    }
  };

  const handleFinishQuestions = () => {
    setStep('feedback');
  };

  const handleBackFromFeedback = () => {
    setStep('questions');
  };

  const handleSubmit = () => {
    if (feedbackErrorText) {
      setIsFeedbackErrorVisible(true);
      return;
    }
    // Когда появится бэк, здесь будет отправка answers и feedback ({ rating, recommend })
    setStep('finished');
  };

  if (!currentQuestion) {
    return <div>{t.notFound}</div>;
  }

  if (step === 'finished') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.thanks}>
          <h1 className={styles.title}>{t.thanksTitle}</h1>
          <p className={styles.thanksText}>{t.thanksText}</p>
          <Button className={styles.thanksBtn} variant="secondary" to="/resources?entity=polls">
            {t.otherPolls}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'feedback') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.question}>
          <h1 className={styles.title}>{t.feedbackTitle}</h1>
          <div className={styles.stars}>
            {RATING_VALUES.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={value <= rating}
                className={clsx(styles.star, { [styles.starActive]: value <= rating })}
                onClick={() => setRating(value)}
                aria-label={`${t.rating} ${value} ${t.of} ${RATING_VALUES.length}`}
              >
                {value <= rating ? <StarFilled aria-hidden /> : <StarOutlined aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.question}>
          <h2 className={styles.title}>{t.recommendQuestion}</h2>
          <div className={styles.recommendOptions}>
            <button
              type="button"
              aria-pressed={recommend === true}
              className={clsx(styles.option, { [styles.selected]: recommend === true })}
              onClick={() => setRecommend(true)}
            >
              {t.yes}
            </button>
            <button
              type="button"
              aria-pressed={recommend === false}
              className={clsx(styles.option, { [styles.selected]: recommend === false })}
              onClick={() => setRecommend(false)}
            >
              {t.no}
            </button>
          </div>
        </div>

        {isFeedbackErrorVisible && !!feedbackErrorText && (
          <p className={styles.feedbackError} role="alert">
            {feedbackErrorText}
          </p>
        )}

        <div className={styles.buttons}>
          <button
            className={`${styles.buttonAction} ${styles.buttonActionBack}`}
            onClick={handleBackFromFeedback}
          >
            {t.back}
          </button>
          <button
            className={`${styles.buttonAction} ${styles.buttonActionComplete}`}
            onClick={handleSubmit}
          >
            {t.submit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.counter} aria-live="polite">
          {currentQuestionIndex + 1} {t.of} {questions.length}
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
            onClick={handleFinishQuestions}
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
