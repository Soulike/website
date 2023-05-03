import {type Article} from '@website/classes';
import * as request from '@website/request';
import {message} from 'antd';

import {
    ADD,
    DELETE_BY_ID,
    GET_ALL,
    GET_BY_CATEGORY,
    GET_BY_ID,
    MODIFY,
} from './ROUTE';

export async function getById(id: number): Promise<Article | null> {
    return await request.getServerResponse(GET_BY_ID, {
        urlSearchParams: new URLSearchParams({json: JSON.stringify({id})}),
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}

export async function getAll(): Promise<Article[] | null> {
    return await request.getServerResponse(GET_ALL, {
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}

export async function getByCategory(
    category: number
): Promise<Article[] | null> {
    return await request.getServerResponse(GET_BY_CATEGORY, {
        urlSearchParams: new URLSearchParams({
            json: JSON.stringify({category}),
        }),
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}

export async function add(
    article: Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>
): Promise<true | null> {
    return await request.postServerResponse(ADD, article, {
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}

export async function deleteById(id: number): Promise<true | null> {
    return await request.postServerResponse(
        DELETE_BY_ID,
        {id},
        {
            onRequestFail: (msg) => message.warning(msg),
            onRequestError: (msg) => message.error(msg),
        }
    );
}

export async function modify(
    article: Pick<Article, 'id'> &
        Partial<
            Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
        >
): Promise<true | null> {
    return await request.postServerResponse(MODIFY, article, {
        onRequestFail: (msg) => message.warning(msg),
        onRequestError: (msg) => message.error(msg),
    });
}
