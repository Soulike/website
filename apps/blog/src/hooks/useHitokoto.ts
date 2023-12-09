import {useEffect, useState} from 'react';

export function useHitokoto(): string {
    const [hitokoto, setHitokoto] = useState('这里应该有一句话');

    useEffect(() => {
        const urlSearchParams = new URLSearchParams({
            c: 'a',
            encode: 'text',
            _t: `${Date.now()}`,
        });

        const getHitokoto = async () => {
            const response = await fetch(
                `https://v1.hitokoto.cn/?${urlSearchParams.toString()}`,
                {
                    method: 'GET',
                },
            );
            return await response.text();
        };

        void getHitokoto()
            .then((hitokoto) => {
                if (hitokoto) setHitokoto(hitokoto);
            })
            .catch(null);
    }, []);

    return hitokoto;
}
