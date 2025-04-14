import {hitokoto, SentenceCategory} from '@website/hitokoto';

export async function Hitokoto() {
  let sentence = '这里应该有一句话';
  try {
    sentence = await hitokoto.getSentence([
      SentenceCategory.ANIME,
      SentenceCategory.COMIC,
      SentenceCategory.GAME,
    ]);
  } catch (e) {
    console.error(e);
  }

  return <div>{sentence}</div>;
}
