import React from 'react';
import { Calendar, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppointment } from '../../storeOfAppointment/appointment';

const ACalendar = () => {
	const setAppointment = useAppointment(state => state.setAppointment);
  const { token } = theme.useToken();

  const onChange = (value: Dayjs) => {
    setAppointment({date: value.format('YYYY-MM-DD')});
  };

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: token.borderRadiusLG,
  };

  React.useEffect(() => {
    setAppointment({date: dayjs().format('YYYY-MM-DD')});
  }, []);

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onChange={onChange} />
    </div>
  );
};

export default ACalendar;
