import styles from './Tests.module.scss';
import { testMocks } from '@/pages/resources-page/entities/tests/mocks.ts';
import { TestCard } from '@/pages/resources-page/components';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

const initialTests = testMocks.slice(0, 6);

export const Tests = () => {
  const [tests, setTests] = useState(initialTests);

  const handleShowMore = () => setTests(testMocks);
  const isShowMoreVisible = tests.length < testMocks.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.testList} data-testid="tests-list">
        {tests.map((item) => (
          <TestCard key={item.id} test={item} />
        ))}
      </div>
      {isShowMoreVisible && (
        <Button data-testid="show-more-tests" className={styles.showMore} onClick={handleShowMore}>
          Показать ещё
        </Button>
      )}
    </div>
  );
};
