import {AppRouter} from '../../types.js';
import articleDispatcher from './Article/index.js';
import categoryDispatcher from './Category/index.js';
import optionDispatcher from './Option/index.js';

export default (router: AppRouter) => {
  articleDispatcher(router);
  categoryDispatcher(router);
  optionDispatcher(router);
};
