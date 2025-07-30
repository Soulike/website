import {Button, type ButtonProps} from '@mui/material';

export interface NewGameButtonViewProps {
  onClick: ButtonProps['onClick'];
}

export function View({onClick}: NewGameButtonViewProps) {
  return (
    <Button
      color={'inherit'}
      variant={'outlined'}
      size={'large'}
      onClick={onClick}
    >
      New Game
    </Button>
  );
}
