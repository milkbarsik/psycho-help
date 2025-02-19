import React, { FC, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from 'antd';
import GreetingBlock from './components/greeting-block/greeting-block';
import ReasonsBlock from './components/reasons-block/reasons-block';
import FeaturesBlock from './components/features-block/features-block';
import ChartBlock from './components/chart-block/schedule-block';
import TherapistsBlock from './components/doctors-block/doctors-block';
import styled from 'styled-components';

const Block = styled.div`
  padding-block: 48px;
  padding-inline: 24px;
`;

const BlockBlue = styled.div`
  padding: 12px 24px 24px;
  background: #d9e5ff;
`;

const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: auto;
  width: 100%;
`;

const Title = styled(Typography.Title)`
  text-align: center;
  margin-bottom: 24px;
`;

interface BlockWrapperProps {
  component: FC<any>;
  style: typeof Block | typeof BlockBlue;
  title?: string;
  props?: any;
  name: string;
	ref?: React.Ref<HTMLElement | null>;
}

//Объект с компонентами, используемыми на home-page

const blocks: BlockWrapperProps[] = [
  { component: GreetingBlock, style: Block, name: 'Greeting' },
  { component: ReasonsBlock, style: Block, title: 'С чем может помочь психолог?', name: 'reasons' },
  { component: FeaturesBlock, style: Block, title: 'Особенности работы службы', name: 'features' },
  { component: ChartBlock, style: BlockBlue, title: 'График работы', name: 'chart' },
];

const BlockWrapper = React.forwardRef<HTMLDivElement, BlockWrapperProps>(
  ( { component: Component, style: Style, title, props}, ref ) => (
    <Style ref={ref}>
      <ContentWrapper>
        {title && (
          <Title level={2} style={{ fontSize: '24px' }}>
            {title}
          </Title>
        )}
        <Component {...props} />
      </ContentWrapper>
    </Style>
  ),
);

const HomePage: FC = () => {
  const refs = useRef<HTMLDivElement[] | null[]>(blocks.map(() => null));

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (location.hash) {
      const targetRefIndex = blocks.findIndex((block) => `#${block.name}` === location.hash);

      if (targetRefIndex !== -1 && refs.current[targetRefIndex]) {
        refs.current[targetRefIndex]?.scrollIntoView({ behavior: 'smooth' });
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
