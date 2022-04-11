import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CloseIcon from '../../../icons/CloseIcon';

import useChatContext from '../../../hooks/useChatContext/useChatContext';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';
import Player from '../../../../../../classes/Player';

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

/**
 * Sorts the list of players alphanumerically such that numbers come before letters.
 * Also for example 'name10' comes after 'name9'
 * @param players List of players to sort
 */
 function alphanumericSort(players: Player[]): Player[] {
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  const sortedList = players.sort((player1, player2) => collator.compare(player1.userName, player2.userName));
  return sortedList;
 }

 
export default function ChatWindowHeader({onRecipientChange}: any) {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  const { userName } = useCoveyAppState();
  const playersInTown = usePlayersInTown();
  const sortedPlayers = alphanumericSort([...playersInTown]);

  return (
    <div className={classes.container}>
      <div className={classes.text}>Chat</div>
      <select id={"dmUser"} 
              onChange = {(e) =>
              onRecipientChange(e.target.value)}>
        
        <option value={"Everyone"} selected>
          Everyone
        </option>
        {
          sortedPlayers.filter(player => player.userName !== userName)
            .map(player => 
            <option value={player.userName}>
              {player.userName}
            </option>)
        }
      </select>
      <button className={classes.closeChatWindow} onClick={() => setIsChatWindowOpen(false)}>
        <CloseIcon />
      </button>
    </div>
  );
}
