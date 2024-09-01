import * as OptionApi from '@/src/apis/option';

export async function getAboutMarkdown() {
  const response = await OptionApi.getAbout();
  if (response.isSuccessful) {
    return response.data.about;
  } else {
    throw new Error(response.message);
  }
}
