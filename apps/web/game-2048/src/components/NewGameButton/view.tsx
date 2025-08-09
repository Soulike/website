import {Button, type ButtonProps} from '@mui/material';

export interface NewGameButtonViewProps {
  onClick: ButtonProps['onClick'];
  className?: string;
}

export function View({onClick, className}: NewGameButtonViewProps) {
  return (
    <Button
      color={'inherit'}
      variant={'outlined'}
      size={'large'}
      onClick={onClick}
      className={className}
    >
      New Game
    </Button>
  );
}
