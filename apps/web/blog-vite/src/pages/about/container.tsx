import {AboutView} from './view.js';
import {useViewModel} from './view-model.js';

export function About() {
  const {title, about, aboutLoading, onRenderFinish, onRenderStart} =
    useViewModel();

  return (
    <>
      <title>{title}</title>
      <AboutView
        aboutMarkdown={about ?? ''}
        loading={aboutLoading}
        onRenderStart={onRenderStart}
        onRenderFinish={onRenderFinish}
      />
    </>
  );
}
