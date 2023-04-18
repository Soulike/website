import {appRequestWrapper} from '@website/utils';
import {message} from 'antd';
import axios from 'axios';

import {GET_ABOUT} from './ROUTE';

export async function get(): Promise<{about: string} | null> {
    return await appRequestWrapper(
        async () => await axios.get(GET_ABOUT),
        message.warning,
        message.error
    );
}
