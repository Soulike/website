import {type Category} from '@website/classes';
import {useEffect, useState} from 'react';

import {Category as CategoryApi} from '@/src/apis';

export function useCategory(id: number): {
    loading: boolean;
    category: Category | null;
} {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        setCategory(null);
        setLoading(true);
        if (!isNaN(id)) {
            void CategoryApi.getById(id)
                .then((category) => {
                    setCategory(category);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id]);

    return {loading, category};
}
