import {Button, type ButtonProps} from '@/components/Button/index.js';

export interface NewGameButtonViewProps {
  onClick: ButtonProps['onClick'];
  className?: string;
}

export function View({onClick, className}: NewGameButtonViewProps) {
  return (
    <Button variant='primary' onClick={onClick} className={className}>
      New Game
    </Button>
  );
}
