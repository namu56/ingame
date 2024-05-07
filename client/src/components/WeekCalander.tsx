import { useWeek } from '@/hooks/useWeek';
import { useState } from 'react';
import styled from 'styled-components';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { media } from '@/styles/theme';

const Week = () => {
  const { today, getWeekDates } = useWeek();

  const [calendarDay, setCalendarDay] = useState<Date[]>(getWeekDates(today));
  const [now, setNow] = useState<Date>(today);

  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const calendarWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarObject = [
    { week: calendarWeek[0], day: calendarDay[0] },
    { week: calendarWeek[1], day: calendarDay[1] },
    { week: calendarWeek[2], day: calendarDay[2] },
    { week: calendarWeek[3], day: calendarDay[3] },
    { week: calendarWeek[4], day: calendarDay[4] },
    { week: calendarWeek[5], day: calendarDay[5] },
    { week: calendarWeek[6], day: calendarDay[6] },
  ];

  const onPrev = () => {
    const prevDay = new Date(now);
    prevDay.setDate(now.getDate() - 7);
    setNow(prevDay);
    setCalendarDay(getWeekDates(prevDay));
  };

  const onNext = () => {
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 7);
    setNow(nextDay);
    setCalendarDay(getWeekDates(nextDay));
  };

  const onClickDate = (calendar: Date) => {
    setSelectedDay(new Date(calendar.getFullYear(), calendar.getMonth(), calendar.getDate()));
  };

  return (
    <WeekStyle>
      <div className="">
        <button onClick={onPrev}>
          <GrFormPrevious />
        </button>
      </div>
      <div className="daylistContainer">
        {calendarObject.map((calendar, index) => (
          <div
            key={index}
            className={`daylistSector ${calendar.day.getDate() === selectedDay.getDate() ? 'selected' : ''} ${calendar.day.getDate() === today.getDate() ? 'today' : ''}`}
            onClick={() => onClickDate(calendar.day)}
          >
            <div className="week">{calendar.week}</div>
            <div className="day">{calendar.day.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="">
        <button onClick={onNext}>
          <GrFormNext />
        </button>
      </div>
    </WeekStyle>
  );
};

const WeekStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-family: 'Pretendard400';
  font-size: ${({ theme }) => theme.font.small};

  .daylistContainer {
    display: flex;
    gap: 10px;

    .daylistSector {
      width: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      gap: 4px;
      border-radius: ${({ theme }) => theme.borderRadius.small};

      &:hover {
        cursor: pointer;
      }

      transition:
        background-color 0.2s ease,
        color 0.2s ease;

      .week {
        color: ${({ theme }) => theme.color.grayDark};
        font-size: ${({ theme }) => theme.font.xsmall};
      }

      ${media.mobile} {
        width: 8vw;
      }
    }

    .daylistSector.selected {
      background-color: ${({ theme }) => theme.color.blue};
      color: ${({ theme }) => theme.color.white};

      .week {
        color: ${({ theme }) => theme.color.white};
      }
    }

    .daylistSector.today {
      border: 2px solid ${({ theme }) => theme.color.blue};
    }
  }
`;

export default Week;
