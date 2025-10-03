import { useEffect, useState } from 'react';
import type { FC, CSSProperties } from 'react';
import { Calendar, ConfigProvider, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ru_RU from 'antd/locale/ru_RU';
import styles from './calendar.module.css';
import { useAppointment } from '../../storeOfAppointment/appointment';
import type { GetAppointment } from '@/api/types';
import Marker from './marker/marker';

dayjs.locale('ru');


// Accepted, Approved, Cancelled, Done
const specialDatesTypes: Record<string, string> = {
  'Accepted': '#FFCF52',
  'Approved': '#33C175',
	// '2025-04-10': '#7D8488'
};

type Props = {
	appointments: GetAppointment[] | undefined;
}

const ACalendar:FC<Props> = ({appointments}) => {
	const setAppointment = useAppointment(state => state.setAppointment);
  const { token } = theme.useToken();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [specialDates, setSpecialDates] = useState<Record<string, string>>({});

	// выбор сегодняшней даты по умолчанию
  useEffect(() => {
		setAppointment({date: dayjs().format('YYYY-MM-DD')});
		setSelectedDate(dayjs());
	}, []);

	// формирования объекта с помеченными датами
	useEffect(() => {
		if (appointments) {
			setSpecialDates(Object.assign({}, ...appointments.map(el => {
				return { [dayjs(el.remind_time).format('YYYY-MM-DD')]: el.status };
			})));
		}
	}, [appointments]);

	// изменение при выборе даты
  const onChange = (value: Dayjs) => {
    setAppointment({date: value.format('YYYY-MM-DD')});
		setSelectedDate(dayjs(value));
  };

  // полностью перезаписываем содержимое ячейки
  const dateFullCellRender = (value: Dayjs) => {

    const key = value.format('YYYY-MM-DD');
    const specialBg = specialDatesTypes[specialDates[key]];

    // определяем, чем мы хотим пометить
    const isToday = value.isSame(dayjs(), 'day');
    const isSelected = value.isSame(selectedDate, 'day');

    const style: CSSProperties = {
      // фон: выбранная, или спец., или дефолт
      backgroundColor: isSelected
        ? '#1890ff'
        : specialBg
          ? specialBg
          : undefined,
      ...(isToday
        ? { boxShadow: '0 0 0 1px #555555 inset' }
        : {}),
    };

    return (
      <div className={styles.cell} style={style}>
        {value.date()}
      </div>
    );
  };

  return (
    <ConfigProvider
			locale={ru_RU}
			theme={{
				components: {
					Calendar: {
						fullBg: 'transparent',
						fullPanelBg: 'transparent',
						fontSize: 16
					}
				}
			}}>
      <div style={{ width: '100%', borderRadius: token.borderRadiusLG}}>
        <Calendar
          fullscreen={false}
          onChange={onChange}
          value={selectedDate}
          fullCellRender={dateFullCellRender}
        />
				<div className={styles.markers}>
					<Marker text='Прием подтвержден' type='Approved'/>
					<Marker text='Прием не подтвержден' type='Accepted'/>
					<Marker text='Выбранная дата' type='selected'/>
				</div>
      </div>
    </ConfigProvider>
  );
};

export default ACalendar;
