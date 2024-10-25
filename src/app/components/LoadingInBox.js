import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingInBox = ({ content, style }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.spiner}>
        <CircularProgress className={classes.spiner} color="inherit" />
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '20h',
      position: 'relative',
      background: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none'
    },
    spiner: {
      width: '50px !important',
      height: '50px !important'
    }
  }));


export default LoadingInBox;
