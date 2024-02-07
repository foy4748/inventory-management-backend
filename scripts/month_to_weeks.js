const moment = require('moment');

function getWeeksInMonth(month, year) {
  const startDate = moment([year]).add(month - 1, 'months');
  const endDate = moment(startDate).endOf('month');
  const weeks = [];

  while (startDate <= endDate) {
    weeks.push(startDate.isoWeek());
    startDate.add(1, 'week');
  }

  return weeks;
}

console.log(getWeeksInMonth(12, 2024)); // Replace with your desired month and year
