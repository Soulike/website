import {useEffect, useState} from 'react';

export function useCurrentYear(): number {
    const [year, setYear] = useState(1970);
    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear());
    }, []);

    return year;
}
