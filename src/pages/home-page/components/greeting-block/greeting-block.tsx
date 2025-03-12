import { Button, Flex, Image, Typography } from 'antd';
import GreetingImage from '../../../../assets/images/greeting-screen.png';
import { SERVICE_PROPS } from '../../constants';
import styles from './greeting-block.module.css';

const GreatingBlock = () => {
  return (
    <Flex wrap="wrap" className={styles.greetingBlock}>
      <Flex vertical flex={14} justify="space-between" style={{ minWidth: '50%' }}>
        <Flex vertical gap={20}>
          <Typography.Title level={4} style={{ fontSize: '16px', color: '#5e8bf4' }}>
            СЛУЖБА ПСИХОЛОГИЧЕСКОЙ ПОМОЩИ
          </Typography.Title>

          <Typography.Title level={1} className={styles.greetingTitle}>
            <span>
              Профессиональная помощь
              <br />
              студентам и сотрудникам университета
            </span>
          </Typography.Title>

          <Typography.Title className={styles.greetingTitle}>
            {SERVICE_PROPS.map((item, index) => (
              <Typography.Paragraph key={index}>
                <Flex gap={24} style={{ fontSize: '18px' }}>
                  <span>—</span>
                  {item}
                </Flex>
              </Typography.Paragraph>
            ))}
          </Typography.Title>

          <Button type="primary" htmlType="submit" className={styles.signupButton}>
            Записаться
          </Button>
        </Flex>
      </Flex>

      <Flex vertical flex={10} justify="space-between" style={{ alignSelf: 'center' }}>
        <div className={styles.greetingImageWrapper}>
          <Image
            src={GreetingImage}
            preview={false}
            height={'100%'}
            alt="Иллюстрация на главной странице"
          />
        </div>
        <Typography.Paragraph className={styles.importantText}>
          <b>Важно!</b> Консультации проходят в очном и онлайн режиме, бесплатны и конфиденциальны.
        </Typography.Paragraph>
      </Flex>
    </Flex>
  );
};

export default GreatingBlock;
