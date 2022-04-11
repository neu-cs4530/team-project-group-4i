import React, { useState, useRef } from 'react';

import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, useMediaQuery, Theme, Menu as MenuContainer, MenuItem, Typography } from '@material-ui/core';
import { EmoticonTypes } from './EmoticonTypes';

export default function Emoticon() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [statusOpen, setStatusOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [statusEnabled, setStatus] = useState(false);

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
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography >{EmoticonTypes.SMILEY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography>{EmoticonTypes.FROWNY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography>{EmoticonTypes.EXTRAHAPPY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography>{EmoticonTypes.WINKY}</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography>{EmoticonTypes.COOL}</Typography>
        </MenuItem>
        <MenuItem onClick={() => setStatusOpen(false)}>
          <Typography>{EmoticonTypes.SLANTY}</Typography>
        </MenuItem>
      </MenuContainer>
    </>
  );
}
