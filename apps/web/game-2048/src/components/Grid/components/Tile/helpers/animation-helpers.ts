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

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const animation = tileElement.animate(keyframes, {
        duration,
        easing,
        delay,
      });
      animation.addEventListener(
        'finish',
        () => {
          resolve();
        },
        {once: true},
      );
    });
  });
}
