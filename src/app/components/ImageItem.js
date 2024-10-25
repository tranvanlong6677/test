import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { CameraAlt, Room } from '@material-ui/icons';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },

  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1),
    color: '#C62222'
  },
  imgStyle: {
    cursor: 'pointer',
    width: '100%',
    height: '230px'
  },
  borderRounded: {
    // marginRight: 15,
    textAlign: 'center',
    margin: '0 auto',
    paddingTop: 7,
    width: '60px',
    height: '60px',
    border: '3px solid #C62222',
    borderRadius: '100%'
  },
  groupInforImage: {
    display: 'flex',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sizeTextImage: { fontSize: '16px' }
}));

const ImageItem = ({ className, actionDetailsImgRef, image, ...rest }) => {
  const classes = useStyles();

  // console.log(moment(image.device_time));
  const handleView = () => {
    if (!actionDetailsImgRef) return;
    actionDetailsImgRef(image);
  };
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="center" mb={1}>
        <img
          onClick={() => handleView()}
          src={image.url}
          alt={image.file_name}
          className={classes.imgStyle}
        />
      </Box>

      {/* <Box flexGrow={1} />
      <Divider /> */}
      <Grid container className={classes.groupInforImage}>
        <Grid item xs={8}>
          <Grid container justify="space-between" spacing={2}>
            <Grid className={classes.statsItem} item>
              <AccessTimeIcon className={classes.statsIcon} />
              <Typography
                className={classes.sizeTextImage}
                display="inline"
                variant="caption"
              >
                {image.created_at &&
                  moment.unix(image.created_at).format('HH:mm:ss DD/MM/YYYY')}
              </Typography>
            </Grid>
          </Grid>{' '}
          <Grid container justify="space-between" spacing={2}>
            <Grid className={classes.statsItem} item>
              <CameraAlt className={classes.statsIcon} />
              <Typography
                className={classes.sizeTextImage}
                display="inline"
                variant="caption"
              >
                Camera {image.camera_num}
              </Typography>
            </Grid>
          </Grid>{' '}
          <Grid container justify="space-between" spacing={2}>
            <Grid className={classes.statsItem} item>
              <Room color={'#C62222'} className={classes.statsIcon} />
              <Typography
                className={classes.sizeTextImage}
                display="inline"
                variant="caption"
              >
                {image?.location}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          spacing={1}
          style={{
            display: 'block',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid>
            <div className={classes.borderRounded}>
              <Typography variant={'h5'}>{Number(image.speed)}</Typography>
              <Typography variant={'caption'}>Km/h</Typography>
            </div>
          </Grid>
          <br />
          <Grid>
            <b>{image.device.vehicle?.license_plate}</b>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

ImageItem.propTypes = {
  actionDetailsImgRef: PropTypes.func,
  image: PropTypes.shape({
    url: PropTypes.string,
    file_name: PropTypes.string
  }).isRequired
};

export default ImageItem;
