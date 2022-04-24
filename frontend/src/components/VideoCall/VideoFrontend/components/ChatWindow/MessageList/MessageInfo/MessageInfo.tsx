import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    messageInfoContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'left',
      padding: '1.425em 0 0.083em',
      fontSize: '12px',
      color: '#606B85',
    },
    directMessageUser: {
      color: '#1474FF'
    },
    directMessagePrivate: {
      color: '#FF1414'
    }
  })
);

interface MessageInfoProps {
  author: string;
  toUser: string;
  dateCreated: string;
  isAuthorLocalParticipant: boolean;
  isToUserLocalParticipant: boolean;
}

export default function MessageInfo({ author, toUser, dateCreated, isAuthorLocalParticipant, isToUserLocalParticipant }: MessageInfoProps) {
  const classes = useStyles();
  const MAX_USERNAME_LENGTH = 8;

  return (
    <div className={classes.messageInfoContainer}>
      {isAuthorLocalParticipant ?
        <div>{'(You)'}</div> :
        <div className={classes.directMessageUser}>{`${author.substring(0, MAX_USERNAME_LENGTH)}${author.length > 8 ? '...' : ''}`}</div>
      }
      <div>to</div>
      {isToUserLocalParticipant &&
        <div>
          <div>{'(You)'}</div>
          <div className={classes.directMessagePrivate}>{'(Privately)'}</div>
        </div>
      }
      {!isToUserLocalParticipant &&
        <div>
          <div className={classes.directMessageUser}>{`${toUser.substring(0, MAX_USERNAME_LENGTH)}${toUser.length > 8 ? '...' : ''}`}</div>
          {((isAuthorLocalParticipant && (toUser !== 'Everyone')) &&
            <div className={classes.directMessagePrivate}>{'(Privately)'}</div>)
          }
        </div>
      }
      <div>{dateCreated}</div>
    </div>
  );
}
