import {useMarkdown} from '@library/react-components/csr';
import {STRING_KEY, useI18nString} from '@module/blog-i18n';
import {OptionModelHooks} from '@module/model/react/blog';

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
