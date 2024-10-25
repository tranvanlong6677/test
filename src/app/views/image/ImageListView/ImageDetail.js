import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Container, Dialog, Slide } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ToolbarEdit from './Toolbar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
ImageDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object,
  closeRef: PropTypes.func.isRequired
};

function ImageDetail({ open, closeRef, data }) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  const classes = useStyles();
  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={() => closeRef()}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <ToolbarEdit imageName={data.file_name} closeToolbarRef={closeRef} />
        </AppBar>
        <Container maxWidth="lg" className={classes.container}>
          <img src={data.url} alt={data.file_name} className={classes.imgStyle} />
        </Container>
      </Dialog>
    </div>

  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  container: {
    padding: 15,
    textAlign: 'center'
  },
  imgStyle: {
    width: '100%',
    height: 'auto'
  }
}));
export default ImageDetail;
