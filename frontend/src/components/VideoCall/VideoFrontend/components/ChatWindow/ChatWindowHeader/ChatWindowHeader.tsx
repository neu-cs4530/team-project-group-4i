import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CloseIcon from '../../../icons/CloseIcon';

import useChatContext from '../../../hooks/useChatContext/useChatContext';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

export default function ChatWindowHeader({onRecipientChange}: any) {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  const { userName } = useCoveyAppState();
  const playersInTown = usePlayersInTown();
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  const MAX_USERNAME_LENGTH = 10;

  return (
    <div className={classes.container}>
      <div className={classes.text}>Chat</div>
      <select onChange={(e) =>
        onRecipientChange(e.target.value)}
        defaultValue={'Everyone'}>
        <option value={'Everyone'} disabled>
          Everyone
        </option>
        {
          playersInTown.filter(player => player.userName !== userName)
            .sort((player1, player2) => collator.compare(player1.userName, player2.userName))
            .map(player => 
            <option value={player.userName}>
              {`${player.userName.substring(0, MAX_USERNAME_LENGTH)}${player.userName.length > 10 ? '...' : ''}`}
            </option>)
        }
      </select>
      <button className={classes.closeChatWindow} onClick={() => setIsChatWindowOpen(false)}>
        <CloseIcon />
      </button>
    </div>
  );
}
