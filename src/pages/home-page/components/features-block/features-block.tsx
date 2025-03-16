import { Row, Col, Flex, Typography, Image } from 'antd';
import { FEATURES_OF_WORK } from '../../constants';
import styles from './features-block.module.css';

const FeaturesBlock = () => {
  return (
    <Row gutter={64} className={styles.featuresBlock}>
      {FEATURES_OF_WORK.map((item) => (
        <Col xs={24} xl={12} key={item.title} className={styles.featureItem}>
          <Flex gap={16}>
            <div className={styles.featureImage}>
              <Image src={item.image} preview={false} alt="Иллюстрация особенностей службы" />
            </div>
            <Flex vertical>
              <Typography.Title level={3} style={{ fontSize: '20px' }} className={styles.title}>
                {item.title}
              </Typography.Title>
              <Typography.Text>{item.desc}</Typography.Text>
            </Flex>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

export default FeaturesBlock;
