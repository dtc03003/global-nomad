import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrevIcon from '@/images/icon/icon_calendar_prev.svg';
import NextIcon from '@/images/icon/icon_calendar_next.svg';

interface CustomDatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
}

export default function CustomedDatePicker({ selected, onChange }: CustomDatePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
        <div>
          <button
            aria-label="Previous Month"
            className={'react-datepicker__navigation react-datepicker__navigation--previous'}
            onClick={decreaseMonth}
          >
            <span className={'react-datepicker__navigation-icon react-datepicker__navigation-icon--previous'}>
              <PrevIcon style={{ position: 'absolute', left: 0 }} />
            </span>
          </button>
          <span className="react-datepicker__current-month">
            {monthDate.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            aria-label="Next Month"
            className={'react-datepicker__navigation react-datepicker__navigation--next'}
            onClick={increaseMonth}
          >
            <span className={'react-datepicker__navigation-icon react-datepicker__navigation-icon--next'}>
              <NextIcon style={{ position: 'absolute', left: 0 }} />
            </span>
          </button>
        </div>
      )}
      inline
    />
  );
}