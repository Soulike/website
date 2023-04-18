import {type Category} from '@website/classes';
import {useEffect, useState} from 'react';

import {Category as CategoryApi} from '@/src/apis';

export function useCategories(): {
    loading: boolean;
    categories: Category[] | null;
} {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setCategories(null);
        CategoryApi.getAll()
            .then((categories) => {
                setCategories(categories);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {loading, categories};
}
