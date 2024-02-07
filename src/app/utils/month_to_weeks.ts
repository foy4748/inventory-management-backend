import moment from 'moment';

export default function getWeeksInMonth(month: number, year: number) {
  const startDate = moment([year]).add(month - 1, 'months');
  const endDate = moment(startDate).endOf('month');
  const weeks = [];

  while (startDate <= endDate) {
    weeks.push(startDate.isoWeek());
    startDate.add(1, 'week');
  }

  return weeks;
}
