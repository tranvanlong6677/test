import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ToastMessage from '../../components/ToastMessage';
import { messageToastType_const } from '../../constant/config';
import { showToast } from '../../../features/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles, Slider, Box } from '@material-ui/core';
import PlaybackControlPlayer from './PlaybackControlPlayer';
import { lazy } from 'src/app/utils/commomService';
import PlaybackPlayer from './PlaybackPlayer';
import { pl } from 'date-fns/locale';
import {
  setGPSPayload
} from '../../../features/playback';
const StyledVideo = styled.video`
  width: 100%;
  max-height: 100%;
  background-color: #4c4c4c;
  background-clip: content-box;
  border: 2px solid #c62222;
`;
const Video = props => {
  const ref = useRef();
  return (
    <>
      {' '}
      <div
        class=""
        style={{
          paddingBottom: 0
        }}
      >
        {' '}
        <StyledVideo playsInline autoPlay ref={ref} id={props.id} />
      </div>{' '}
    </>
  );
};
const PlaybackVideo = ({ deviceSerial }) => {
  const dispatch = useDispatch();
  const isShowToast = useSelector(state => state.uiSlice.isShowToast);
  const [toastMessage, setToastMessage] = useState();
  const classes = useStyles();
  const vehicleSelected = useSelector(state => state.vodSlice.vehicleSelected);
  const [playerstate, setPlayerState] = useState({
    isReady: false,
    player: null
  });
  const { isReady, player } = playerstate;
  const onReady = d => {
    if (d.isReady) {
      setPlayerState({ ...playerstate, player: d.player, isReady: d.isReady });
      //Lấy thông tin thời gian bắt đầu kết thúc của 1 block set cho map
      dispatch(setGPSPayload(d))
    }
  };


  return (
    <div
      style={{
        position: 'relative',

      }}
    >
      <span className={classes.channelLabel}>
        {' '}
        {vehicleSelected != null ? vehicleSelected.channelName : ''}{' '}
      </span>
      <Video
        id={
          vehicleSelected != null
            ? vehicleSelected.channelId
            : ''
        }
      />{' '}
      <PlaybackControlPlayer player={player} isReady={isReady} />
      <PlaybackPlayer onReady={onReady} vehicleSelected={vehicleSelected} />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  pagination: {
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '64px',
    marginTop: '10px'
  },
  channelLabel: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    background: '#c62222',
    color: 'white',
    padding: '4px',
    borderRadius: '0px 0px 0px 4px'
  },
  noSignal: {
    backgroundColor: 'gray',
    height: 'max-content',
    backgroundColor: '#4c4c4c',
    backgroundClip: 'content-box',
    border: '2px solid #c62222',
    color: 'white'
  }
}));
export default PlaybackVideo;
