import {Option as OptionService} from '../../Service/index.js';
import {AppRouter} from '../../types.js';
import {GET_ABOUT} from './ROUTE.js';

export default (router: AppRouter) => {
  router.get(GET_ABOUT, async (ctx) => {
    ctx.response.body = await OptionService.get();
  });
};
