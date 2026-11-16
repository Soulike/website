export function loadScript(script: string, tagAttr?: Record<string, string>) {
  const tag = document.createElement('script');

  if (tagAttr !== undefined) {
    for (const [attr, value] of Object.entries(tagAttr)) {
      tag.setAttribute(attr, value);
    }
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
      for (const [attr, value] of Object.entries(tagAttr)) {
        tag.setAttribute(attr, value);
      }
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
