export const useWeek = () => {
  const today = new Date();

  const getWeekDates = (date: Date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const dates = [...Array(7)].map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return dates;
  };

  return { today, getWeekDates };
};
