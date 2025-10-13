import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru';

dayjs.locale('ru');
dayjs.extend(LocalizedFormat);

export const combineDateAndTime = (dateStr: string, timeStr: string) => {
	return dayjs(dateStr + ' ' + timeStr).toISOString();
}

export const getDayNameOfWeek = (date: string) => {
	return dayjs(date).format('LLLL').split(',')[0];
}

export const formatDateToCustomString = (isoDate: string) => {
	if (!dayjs(isoDate).isValid()) {
		return 'Ошибка загрузки даты.'
	}
	const date = dayjs(isoDate).format('LLLL').split(',');
	const DM = date[1].trim().split(' ').slice(0, 2).join(' ');

	return DM + ', ' + date[0] + ', ' + date[2];
}