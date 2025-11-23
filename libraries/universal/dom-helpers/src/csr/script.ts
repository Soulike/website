export function loadScript(script: string, tagAttr?: Record<string, string>) {
  const tag = document.createElement('script');

  if (tagAttr !== undefined) {
    Object.keys(tagAttr).forEach((attr) => {
      tag.setAttribute(attr, tagAttr[attr]);
    });
  }

  tag.innerHTML = script;
  document.body.appendChild(tag);
}

export async function loadExternalScript(
  src: string,
  tagAttr?: Record<string, string>,
) {
  await new Promise<void>((resolve, reject) => {
    const tag = document.createElement('script');

    if (tagAttr !== undefined) {
      Object.keys(tagAttr).forEach((attr) => {
        tag.setAttribute(attr, tagAttr[attr]);
      });
    }

    tag.src = src;

    tag.onload = () => {
      resolve();
    };
    tag.onerror = () => {
      reject(new Error(`External script load failed: ${src}`));
    };

    document.body.appendChild(tag);
  });
}
