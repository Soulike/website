import axios from 'axios';
import {useEffect, useState} from 'react';

export function useHitokoto(): string {
    const [hitokoto, setHitokoto] = useState('这里应该有一句话');

    useEffect(() => {
        const getHitokoto = async () => {
            const {data} = await axios.get('https://v1.hitokoto.cn/', {
                params: {
                    c: 'a',
                    encode: 'text',
                    _t: Date.now(),
                },
            });

            return data;
        };

        getHitokoto()
            .then((hitokoto) => {
                setHitokoto(hitokoto);
            })
            .catch(null);
    }, []);

    return hitokoto;
}
