export const formattedDate = (calendar: Date) =>
  calendar
    .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '-')
    .slice(0, -1);
