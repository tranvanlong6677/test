import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import ImageItem from '../../../components/ImageItem';

ImageItem.propTypes = {
  closeToolbarRef: PropTypes.func,
  imageName: PropTypes.string
};
function ToolbarEdit({ closeToolbarRef, imageName = 'Ảnh' }) {
  const classes = useStyles();

  const handleClose = isSave => {
    if (!closeToolbarRef) return;
    closeToolbarRef(isSave);
  };

  return (
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        onClick={() => handleClose()}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        {imageName}
      </Typography>
    </Toolbar>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

export default ToolbarEdit;
