import {useMarkdown} from '@library/react-components/csr';
import {OptionModelHooks} from '@module/model/react/blog';

import {STRING_KEY, useI18nString} from '@/i18n/index.js';

export function useViewModel() {
  const {about, loading: aboutLoading} = OptionModelHooks.useAbout();
  const {
    rendering: aboutRendering,
    onRenderStart,
    onRenderFinish,
  } = useMarkdown();
  const title = useI18nString(STRING_KEY.PAGE_TITLE_ABOUT);

  return {
    title,
    about,
    aboutLoading: aboutLoading || aboutRendering,
    onRenderStart,
    onRenderFinish,
  };
}
