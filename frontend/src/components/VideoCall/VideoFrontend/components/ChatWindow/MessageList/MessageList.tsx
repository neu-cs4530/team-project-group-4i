import React from 'react';
import { ChatMessage } from '../../../../../../classes/TextConversation';
import MessageInfo from './MessageInfo/MessageInfo';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';

interface MessageListProps {
  messages: ChatMessage[];
}

const getFormattedTime = (message?: ChatMessage) =>
  message?.dateCreated.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' }).toLowerCase();

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  console.log(localParticipant);

  const players = usePlayersInTown();
  const app = useCoveyAppState();

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        const time = getFormattedTime(message)!;
        const previousTime = getFormattedTime(messages[idx - 1]);

        // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
        const shouldDisplayMessageInfo = time !== previousTime || message.author !== messages[idx - 1]?.author ||
          (message.toUser !==  messages[idx - 1]?.toUser);

        const myPlayerId = app.myPlayerID;
        const myPlayerUsername = players.find(player => player.id === myPlayerId)?.userName;
        const isAuthorLocalParticipant = myPlayerUsername === message.author;
        const isToUserLocalParticipant = myPlayerUsername === message.toUser;

        const profile = players.find(p => p.id == message.author);
        const recipient = message.toUser;

        return (
          <React.Fragment key={message.sid}>
            {shouldDisplayMessageInfo && (
              <MessageInfo author={profile?.userName || message.author} toUser={recipient} isAuthorLocalParticipant={isAuthorLocalParticipant}
                isToUserLocalParticipant={isToUserLocalParticipant} dateCreated={time} />
            )}
            <TextMessage body={message.body} isAuthorLocalParticipant={isAuthorLocalParticipant} />
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
}
