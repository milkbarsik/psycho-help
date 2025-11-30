import styles from './Tests.module.scss';
import { testMocks } from '@/pages/resources-page/entities/tests/mocks.ts';
import { TestCard } from '@/pages/resources-page/components';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

const initialTests = testMocks.slice(0, 5);

export const Tests = () => {
  const [tests, setTests] = useState(initialTests);

  const handleShowMore = () => {
    setTests(testMocks);
  };
  const isShowMoreVisible = tests.length < testMocks.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.testList}>
        {tests.map((item, index) => {
          return (
            <TestCard
              ellipseDescription
              title={item.title}
              info={{
                key: item.countQuestion,
                value: item.time,
              }}
              description={item.description}
              hasHorizontalDesktopVersion
              key={`tests-${index}`}
            />
          );
        })}
      </div>
      {isShowMoreVisible && (
        <Button className={styles.showMore} onClick={handleShowMore}>
          Показать ещё
        </Button>
      )}
    </div>
  );
};
