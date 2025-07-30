import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import {NewGameButton} from '../NewGameButton/index.js';

export interface GameOverModalViewProps {
  open: boolean;
  onClose: () => void;
}

export function View({open, onClose}: GameOverModalViewProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby='game-over-title'>
      <DialogTitle id='game-over-title'>Game Over</DialogTitle>
      <DialogContent>
        <Typography>
          No more moves available! Would you like to start a new game?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
        <NewGameButton />
      </DialogActions>
    </Dialog>
  );
}
