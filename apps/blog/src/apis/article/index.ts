import {type Article} from '@website/classes';
import {appRequestWrapper} from '@website/utils';
import {message} from 'antd';
import axios from 'axios';

import {
    GET_ALL_WITH_ABSTRACT,
    GET_BY_CATEGORY_WITH_ABSTRACT,
    GET_BY_ID,
} from './ROUTE';

export async function getAllWithAbstract(): Promise<Article[] | null> {
    return await appRequestWrapper(
        async () => await axios.get(GET_ALL_WITH_ABSTRACT),
        message.warning,
        message.error
    );
}

export async function getById(id: number): Promise<Article | null> {
    return await appRequestWrapper(
        async () =>
            await axios.get(GET_BY_ID, {
                params: {
                    json: JSON.stringify({id}),
                },
            }),
        message.warning,
        message.error
    );
}

export async function getByCategoryWithAbstract(
    category: number
): Promise<Article[] | null> {
    return await appRequestWrapper(
        async () =>
            await axios.get(GET_BY_CATEGORY_WITH_ABSTRACT, {
                params: {
                    json: JSON.stringify({category}),
                },
            }),
        message.warning,
        message.error
    );
}
