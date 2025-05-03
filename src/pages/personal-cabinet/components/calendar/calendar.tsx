import React from 'react';
import { Calendar, ConfigProvider, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ru_RU from 'antd/locale/ru_RU';
import styles from './calendar.module.css';

dayjs.locale('ru');


//Accepted, Approved, Cancelled, Done
const specialDates: Record<string, string> = {
  'Accepted': '#FFCF52',
  'Approved': '#33C175',
	// '2025-04-10': '#7D8488'
};

type Props = {
	getDate: (param: string) => void;
	appointments: any
}

const ACalendar: React.FC<Props> = ({getDate, appointments}) => {
  const { token } = theme.useToken();

  // state для выбранной даты
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const today = dayjs();

  // при монтировании сразу возвращаем сегодня
  React.useEffect(() => {
    getDate(today.format('YYYY-MM-DD'));
  }, []);

  // handler изменения
  const onChange = (date: Dayjs) => {
    setSelectedDate(date);
    getDate(date.format('YYYY-MM-DD'));
  };

  // полностью перезаписываем содержимое ячейки
  const dateFullCellRender = (value: Dayjs) => {
    const key = value.format('YYYY-MM-DD');
    const specialBg = specialDates[key];

    // определяем, чем мы хотим пометить
    const isToday = value.isSame(today, 'day');
    const isSelected = value.isSame(selectedDate, 'day');

    const style: React.CSSProperties = {
      height: 'calc((1vw + 1vh))',
			width: 'calc((1vw + 1vh))',
			padding: '1rem',
			marginLeft: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
			userSelect: 'none',
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
      <div style={style}>
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

				</div>
      </div>
    </ConfigProvider>
  );
};

export default ACalendar;
