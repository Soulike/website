import {Button, type ButtonProps} from '@/components/Button/index.js';
import {STRING_KEY, useI18nString} from '@/i18n/index.js';

export interface NewGameButtonViewProps {
  onClick: ButtonProps['onClick'];
  className?: string;
}

export function View({onClick, className}: NewGameButtonViewProps) {
  const newGameText = useI18nString(STRING_KEY.NEW_GAME_BUTTON);

  return (
    <Button variant='primary' onClick={onClick} className={className}>
      {newGameText}
    </Button>
  );
}
