import {useEffect, useState} from 'react';

/**
 * @returns date string in YYYY-MM-DD format.
 */
export function useDateString(date: Date) {
  const [dateString, setDateString] = useState('1970-01-01');

  useEffect(() => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    setDateString(`${year}-${month}-${day}`);
  }, [date]);

  return dateString;
}
