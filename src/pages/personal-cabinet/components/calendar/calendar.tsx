import React from 'react';
import { Calendar, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const ACalendar: React.FC<{ getDate: (param: string) => void }> = ({ getDate }) => {
  const { token } = theme.useToken();

  const onChange = (value: Dayjs) => {
    getDate(value.format('YYYY-MM-DD'));
  };

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: token.borderRadiusLG,
  };

  React.useEffect(() => {
    getDate(dayjs().format('YYYY-MM-DD'));
  }, [getDate]);

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onChange={onChange} />
    </div>
  );
};

export default ACalendar;
