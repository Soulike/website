import {useEffect, useState} from 'react';

import {Option} from '@/src/apis';

export function useAbout(): {loading: boolean; about: string | null} {
    const [about, setAbout] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Option.get()
            .then((result) => {
                if (result !== null) {
                    setAbout(result.about);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {loading, about};
}
