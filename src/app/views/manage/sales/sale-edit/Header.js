import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

function Header({ closeToolbarRef }) {
  const classes = useStyles();

  const handleClose = (isSave) => {
      if(!closeToolbarRef) return;
      closeToolbarRef(isSave);
  };

  return (
    <Toolbar className="device-active-toolbar">
    
      <Typography variant="h5" className={classes.title}>
        Sửa đại lý
      </Typography>
      <IconButton
        edge="start"
        color="inherit"
        onClick={() => handleClose()}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
    </Toolbar>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'none !important'
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    flex: 1,
  }
}));

export default Header;
