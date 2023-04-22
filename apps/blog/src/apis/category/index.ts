import {type Category} from '@website/classes';
import * as request from '@website/request';
import {message} from 'antd';

import {GET_ALL, GET_BY_ID} from './ROUTE';

export async function getAll(): Promise<Category[] | null> {
    return await request.getServerResponse(GET_ALL, {
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}

export async function getById(id: number): Promise<Category | null> {
    return await request.getServerResponse(GET_BY_ID, {
        urlSearchParams: new URLSearchParams({
            json: JSON.stringify({id}),
        }),
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}
