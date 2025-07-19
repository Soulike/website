async function animate(
  element: HTMLElement,
  ...args: Parameters<HTMLElement['animate']>
): Promise<void> {
  return new Promise((resolve) => {
    const animation = element.animate(...args);
    animation.addEventListener(
      'finish',
      () => {
        resolve();
      },
      {once: true},
    );
  });
}

export async function playTilePopAnimation(
  tileElement: HTMLElement,
  duration = 400,
  delay = 0,
): Promise<void> {
  const keyframes: Parameters<HTMLElement['animate']>[0] = [
    {transform: 'scale(0)', opacity: 0},
    {transform: 'scale(1.05)', opacity: 1, offset: 0.5},
    {transform: 'scale(1)', opacity: 1},
  ];
  const easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';

  return animate(tileElement, keyframes, {
    duration,
    easing,
    delay,
    fill: 'none',
  });
}

export async function playTileMoveAnimation(
  tileElement: HTMLElement,
  displacement: {x: number; y: number},
  duration = 400,
  delay = 0,
) {
  const {x, y} = displacement;
  const keyframes: Parameters<HTMLElement['animate']>[0] = [
    {transform: 'translate(0, 0)'},
    {
      transform: `translate(${x.toString()}, ${y.toString()})`,
    },
  ];
  const easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';

  return animate(tileElement, keyframes, {
    duration,
    easing,
    delay,
    fill: 'none',
  });
}
