import {ViewModelError} from '@website/classes';
import {notification} from 'antd';

export function handleViewModelError(error: ViewModelError) {
  notification.error({message: error.messageForView});
  error.printUnderlyingError();
}
