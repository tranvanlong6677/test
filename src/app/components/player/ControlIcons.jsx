import React from 'react';
import './ControlIcons.css';
import {
  Grid,
  Typography,
  Button,
  Slider,
  Popover,
  Tooltip,
  IconButton
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { FastRewind } from '@material-ui/icons';
import { FastForwardSharp } from '@material-ui/icons';
import { PlayArrowSharp } from '@material-ui/icons';
import { PauseSharp } from '@material-ui/icons';
import { VolumeUp } from '@material-ui/icons';
import { VolumeOff } from '@material-ui/icons';
import { Fullscreen } from '@material-ui/icons';

const ControlIcons = ({
  playandpause,
  playing,
  rewind,
  fastForward,
  muting,
  muted,
  volumeChange,
  volumeSeek,
  volume,
  playRate,
  playerbackRate,
  fullScreenMode,
  onSeek,
  played,
  onSeekMouseUp,
  onSeekMouseDown,
  fullMovieTime,
  playedTime,
  isReady
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopOver = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  const PrettoSlider = styled(Slider)({
    height: 5,
    '& .MuiSlider-track': {
      border: 'none'
    },
    '& .MuiSlider-thumb': {
      height: 16,
      width: 16,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit'
      },
      '&:before': {
        display: 'none'
      }
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
      },
      '& > *': {
        transform: 'rotate(45deg)'
      }
    }
  });
  return (
    <div className="controls__div">
      {/* Top Controls */}
      {/*<Grid container direction='row' alignItems='center' justifyContent='start' style={{padding: 16 }}>
              <Grid item>
                <Typography variant='h5' style={{color:'white'}}>Player</Typography>
              </Grid>
    </Grid>*/}

      {/* Middle Controls */}
      {/*<Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
  ></Grid>*/}

      {/* Bottom Controls */}
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingBottom: 5,
          paddingTop: 0,
          paddingLeft: 5,
          paddingRight: 5
        }}
      >
        {/* <Grid item>
          <Typography variant="h5" style={{ color: 'white' }}>
            Tears Of Steel
          </Typography>
          </Grid>*/}

        <Grid item xs={12}>
          <PrettoSlider
            min={0}
            max={100}
            value={played * 100}
            onChange={onSeek}
            onMouseDown={onSeekMouseDown}
            onChangeCommitted={onSeekMouseUp}
            valueLabelDisplay="auto"
            style={{
              padding: 0
            }}
            disabled={!isReady ? true : false}
            // aria-label="custom thumb label"
            components={{
              ValueLabel: ValueLabelComponent
            }}
          />
          <Grid container direction="row" justifyContent="space-between">
            <Typography
              variant="h7"
              style={{ color: 'white', fontSize: '0.8em' }}
            >
              {playedTime}
            </Typography>
            <Grid item>
              <Grid container alignItems="center" direction="row">
                <IconButton
                  className="controls__icons"
                  aria-label="reqind"
                  onClick={rewind}
                  disabled={!isReady ? true : false}
                >
                  <FastRewind fontSize="small" style={{ color: 'white' }} />
                </IconButton>

                <IconButton
                  className="controls__icons"
                  aria-label="reqind"
                  onClick={playandpause}
                  disabled={!isReady ? true : false}
                >
                  {playing ? (
                    <PauseSharp fontSize="small" style={{ color: 'white' }} />
                  ) : (
                    <PlayArrowSharp
                      fontSize="small"
                      style={{ color: 'white' }}
                    />
                  )}
                </IconButton>

                <IconButton
                  className="controls__icons"
                  aria-label="reqind"
                  onClick={fastForward}
                  disabled={!isReady ? true : false}
                >
                  <FastForwardSharp
                    fontSize="small"
                    style={{ color: 'white' }}
                  />
                </IconButton>
                <IconButton
                  className="controls__icons"
                  aria-label="reqind"
                  onClick={muting}
                  disabled={!isReady ? true : false}
                >
                  {muted ? (
                    <VolumeOff fontSize="small" style={{ color: 'white' }} />
                  ) : (
                    <VolumeUp fontSize="small" style={{ color: 'white' }} />
                  )}
                </IconButton>

                {/*<Typography style={{ color: '#fff', paddingTop: '5px' }}>
              {volume * 100}
            </Typography>
            <Slider
              min={0}
              max={100}
              value={volume * 100}
              onChange={volumeChange}
              onChangeCommitted={volumeSeek}
              className="volume__slider"
              />*/}
                <Button
                  variant="text"
                  onClick={handlePopOver}
                  className="bottom__icons"
                  disabled={!isReady ? true : false}
                >
                  <Typography style={{ fontSize: '1em', color: 'white' }}>
                    x{playerbackRate}
                  </Typography>
                </Button>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  style={{ color: 'white' }}
                >
                  <Grid container direction="column-reverse">
                    {[0.5, 1, 1.5, 2].map(rate => (
                      <Button variant="text" onClick={() => playRate(rate)}>
                        <Typography
                          color={
                            rate === playerbackRate ? 'secondary' : 'default'
                          }
                          style={{ fontSize: '0.8em' }}
                        >
                          {rate}
                        </Typography>
                      </Button>
                    ))}
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
            <Typography
              variant="h7"
              style={{ color: 'white', fontSize: '0.8em' }}
            >
              {fullMovieTime}
            </Typography>
          </Grid>
        </Grid>

        <Grid item></Grid>
      </Grid>
    </div>
  );
};

export default ControlIcons;
