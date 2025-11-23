import {useMemo} from 'react';

export interface DateStringProps {
  date: Date;
}

export function DateString(props: DateStringProps) {
  const {date} = props;

  const year = useMemo(() => date.getFullYear().toString(), [date]);
  const month = useMemo(
    () => (date.getMonth() + 1).toString().padStart(2, '0'),
    [date],
  );
  const day = useMemo(() => date.getDate().toString().padStart(2, '0'), [date]);

  const dateString = useMemo(
    () => `${year}-${month}-${day}`,
    [day, month, year],
  );
  return <time dateTime={dateString}>{dateString}</time>;
}
