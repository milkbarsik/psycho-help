import React, { FC, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GreetingBlock from './components/greeting-block/greeting-block';
import ReasonsBlock from './components/reasons-block/reasons-block';
import FeaturesBlock from './components/features-block/features-block';
import ChartBlock from './components/chart-block/schedule-block';
// import TherapistsBlock from './components/doctors-block/doctors-block';
import styles from './home-page.module.css';
import { BlockWrapperProps } from '@/api/types';

const ContentWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.contentWrapper}>{children}</div>
);

const Title: FC<{ text: string }> = ({ text }) => (
  <div className={styles.titleWrapper}>
    <h2 className={styles.title}>{text}</h2>
  </div>
);

//Объект с компонентами, используемыми на home-page
const blocks: BlockWrapperProps[] = [
  { component: GreetingBlock, name: 'Greeting' },
  {
    component: ReasonsBlock,
    title: 'С чем может помочь психолог?',
    name: 'reasons',
  },
  {
    component: FeaturesBlock,
    title: 'Особенности работы службы',
    name: 'features',
  },
  { component: ChartBlock, title: 'График работы', name: 'chart' },
];

const BlockWrapper = React.forwardRef<HTMLDivElement, BlockWrapperProps>(
  ({ component: Component, title }, ref) => (
    <div ref={ref}>
      <ContentWrapper>
        {title && <Title text={title} />}
        <Component />
      </ContentWrapper>
    </div>
  ),
);

const HomePage: FC = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
      const targetIndex = blocks.findIndex((block) => `#${block.name}` === location.hash);
      if (targetIndex !== -1 && refs.current[targetIndex]) {
        refs.current[targetIndex]?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div>
      {blocks.map((block, index) => (
        <BlockWrapper key={index} {...block} ref={(el) => (refs.current[index] = el)} />
      ))}
    </div>
  );
};

export default HomePage;
