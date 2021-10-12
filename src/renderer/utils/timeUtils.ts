export const timeDifference = (current: number, previous: number) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = (current - previous) * 1000;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed) / 1000 + '초 전';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + '분 전';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + '시간 전';
  } else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + '일 전';
  } else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed / msPerMonth) + '달 전';
  } else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + '년 전';
  }
};
