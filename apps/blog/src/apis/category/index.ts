import {type Category} from '@website/classes';
import {appRequestWrapper} from '@website/utils';
import {message} from 'antd';
import axios from 'axios';

import {GET_ALL, GET_BY_ID} from './ROUTE';

export async function getAll(): Promise<Category[] | null> {
    return await appRequestWrapper(
        async () => await axios.get(GET_ALL),
        message.warning,
        message.error
    );
}

export async function getById(id: number): Promise<Category | null> {
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
