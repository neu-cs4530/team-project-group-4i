import React, { useState, useRef } from 'react';

import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, useMediaQuery, Theme, Menu as MenuContainer, MenuItem, Typography } from '@material-ui/core';

export default function StatusMessage() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [statusOpen, setStatusOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [statusEnabled, setStatus] = useState(false);
  return (
    <>
      <Button
        onClick={() => setStatusOpen(isOpen => !isOpen)}
        ref={anchorRef}
        // className={props.buttonClassName}
        data-cy-more-Button
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
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography variant="body1">AFK</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography variant="body1">Ready to chat</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography variant="body2">Clear Status</Typography>
        </MenuItem>
      </MenuContainer>
    </>
  )
}