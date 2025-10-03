import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Flex, Space, Spin, Typography, message } from 'antd';
import { Pagination } from '../../../../api/types';
import { serviceApi } from '../../../../api/service-api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination, Scrollbar, A11y } from 'swiper/modules';
import dayjs from 'dayjs';
import styles from './doctors-block.module.css';

const TherapistsBlock = () => {
  const [params, setParams] = useState<Pagination>({ pageSize: 15, pageNo: 1 });

  const { data, isFetching } = useQuery({
    queryKey: ['doctors', params],
    keepPreviousData: true,
    cacheTime: 1000 * 15,
    refetchOnWindowFocus: false,
    queryFn: () => serviceApi.getDoctors(params),
    onError: () => message.error('Не удалось получить список докторов'),
  });

  return (
    <Spin spinning={isFetching}>
      <div>
        <Swiper
          spaceBetween={12}
          slidesPerView={4}
          modules={[Navigation, SwiperPagination, Scrollbar, A11y]}
        >
          {data?.content &&
            data.content.map((doctor) => (
              <SwiperSlide
                key={`${doctor.username}-${dayjs().format()}`}
                style={{ height: '100%' }}
              >
                <div className={styles.doctorCard}>
                  <Flex vertical>
                    <div style={{ alignSelf: 'center' }}>
                      <Avatar
                        src={doctor?.photo?.length ? doctor.photo[0] : undefined}
                        alt={doctor.name}
                        size={100}
                      />
                    </div>
                    <Space direction="vertical">
                      <Typography.Title level={5}>{doctor.name}</Typography.Title>
                      <Typography.Paragraph ellipsis={{ rows: 4 }}>
                        {doctor.description}
                      </Typography.Paragraph>
                    </Space>
                  </Flex>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </Spin>
  );
};

export default TherapistsBlock;
