import React, { useState, useRef } from 'react';
import {
  useToast
} from '@chakra-ui/react';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, useMediaQuery, Theme, Menu as MenuContainer, MenuItem, Typography } from '@material-ui/core';
import { EmoticonTypes } from './EmoticonTypes';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';

export default function Emoticon() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [statusOpen, setStatusOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {apiClient, myPlayerID, currentTownID } = useCoveyAppState();
  const toast = useToast()

  const updateSelectedEmoticon = async (emoticon: string) => {
    try{
      await apiClient.updatePlayerEmoticon({coveyTownID: currentTownID,
        myPlayerID: myPlayerID, emoticon: emoticon});
      toast({
        title: 'Emoticon updated.',
        status: 'success'
      })
      setStatusOpen(false);
    }catch(err){
      toast({
        title: 'Unable to update emoticon',
        description: String(err),
        status: 'error'
      });
    }
  }

  return (
    <>
      <Button
        onClick={() => setStatusOpen(isOpen => !isOpen)}
        ref={anchorRef}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            Set Emoticon
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={statusOpen}
        onClose={() => setStatusOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.SMILEY)}>
          <Typography >{EmoticonTypes.SMILEY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.FROWNY)}>
          <Typography>{EmoticonTypes.FROWNY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.EXTRAHAPPY)}>
          <Typography>{EmoticonTypes.EXTRAHAPPY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.WINKY)}>
          <Typography>{EmoticonTypes.WINKY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.COOL)}>
          <Typography>{EmoticonTypes.COOL}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon(EmoticonTypes.SLANTY)}>
          <Typography>{EmoticonTypes.SLANTY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedEmoticon('')}>
          <Typography>Clear Emoticon</Typography>
        </MenuItem>
      </MenuContainer>
    </>
  );
}
