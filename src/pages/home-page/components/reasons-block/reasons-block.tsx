import { Col, Flex, Image, Row, Typography } from 'antd';
import { REASONS_TO_VISIT } from '../../constants';
import styles from './reasons-block.module.css';

const ReasonsBlock = () => {
  return (
    <Row>
      {REASONS_TO_VISIT.map((item) => (
        <Col xs={12} xl={8}>
          <Flex vertical align="center">
            <Image src={item.image} preview={false} height={'100%'} alt="Иллюстрация с помощью" />
            <h2 className={styles.itemText}>{item.title}</h2>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

export default ReasonsBlock;
