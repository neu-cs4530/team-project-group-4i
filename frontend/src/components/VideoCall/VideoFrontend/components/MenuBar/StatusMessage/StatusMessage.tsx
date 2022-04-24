import React, { useState, useRef } from 'react';

import { useToast } from '@chakra-ui/react'
import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, useMediaQuery, Theme, Menu as MenuContainer, MenuItem, Typography } from '@material-ui/core';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';
import StatusMessageTypes from './StatusMessageTypes'

export default function StatusMessage() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [statusOpen, setStatusOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { apiClient, myPlayerID, currentTownID } = useCoveyAppState();
  const toast = useToast();

  const updateSelectedStatusMessage = async (statusMessage: string) => {
    try{
      await apiClient.updatePlayerStatusMessage({coveyTownID: currentTownID,
        myPlayerID: myPlayerID, statusMessage: statusMessage});
      toast({
        title: 'Status updated.',
        status: 'success'
      })
      setStatusOpen(false);
    }catch(err){
      toast({
        title: 'Unable to update status',
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
        // className={props.buttonClassName}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            Set Status
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
        <MenuItem onClick={() => updateSelectedStatusMessage(StatusMessageTypes.AFK)}>
          <Typography variant="body1">AFK</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedStatusMessage(StatusMessageTypes.Ready)}>
          <Typography variant="body1">Ready to chat</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedStatusMessage(StatusMessageTypes.BRB)}>
          <Typography variant="body1">BRB</Typography>
        </MenuItem>
        <MenuItem onClick={() => updateSelectedStatusMessage("")}>
          <Typography variant="body2">Clear Status</Typography>
        </MenuItem>
      </MenuContainer>
    </>
  )
}