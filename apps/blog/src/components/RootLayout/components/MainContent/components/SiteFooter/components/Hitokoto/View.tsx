import type React from 'react';

import {Hitokoto as HitokotoApi} from '@/src/apis/third-party';

export async function Hitokoto() {
  let hitokoto: string = '这里应该有一句话';
  try {
    hitokoto = await HitokotoApi.getPlainTextFromAnimationCategory();
  } catch (e) {
    console.error(e);
  }

  return <div>{hitokoto}</div>;
}
