import {STRING_KEY, useI18nString} from '@website/i18n';
import {OptionModelHooks} from '@website/model/react/blog';
import {useMarkdown} from '@website/react-components/csr';

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
