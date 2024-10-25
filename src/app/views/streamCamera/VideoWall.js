import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ToastMessage from '../../components/ToastMessage';
import { messageToastType_const } from '../../constant/config';
import { showToast } from '../../../features/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { generate_token } from 'src/app/utils/commomService';

import VGPSPlayer from './VGPSPlayer';
import { forEach } from 'draft-js/lib/DefaultDraftBlockRenderMap';
import './style.css'
const StyledVideo = styled.video`
  width: 100%;
  max-height: 100%;
  background-color: #4c4c4c;
  background-clip: content-box;
  border: 2px solid #c62222;
`;
const CDN_URL = process.env.REACT_APP_CDN_SERVER;

const VideoWall = React.memo(({ deviceSerial }) => {
  const dispatch = useDispatch();
  const isShowToast = useSelector(state => state.uiSlice.isShowToast);
  const [toastMessage, setToastMessage] = useState();
  const classes = useStyles();


  const cameras = [
    {
      id: `${deviceSerial}_01`,
      name: 'CH1'
    },
    {
      id: `${deviceSerial}_02`,
      name: 'CH2'
    }
  ];
  //const [divCam, setDivCam] = useState(2);
  // const [playCam, setPlayCam] = useState(false);
  //let playCam = false;
  let divCam = 2;
  const Video = props => {
    const ref = useRef();
    return (
      <>
        {' '}
        <div class="">
          {' '}
          <StyledVideo playsInline autoPlay ref={ref} id={props.id} />
        </div>{' '}
      </>
    );
  };
  var players = [];
  useEffect(() => {
    if (!deviceSerial) return

    if (players.length > 0) {
      for (let l of players) {
        l.stop();
      }
      players = [];
    }
    for (let c of cameras) {
      if (c.id) {
        let token = generate_token(32);
        var ws_url = `${CDN_URL}/evup/${token}/${c.id}`;
        const player = new VGPSPlayer(c.id, { transport: ws_url });
        players.push(player);
      }

    }

    return () => {
      if (players.length > 0) {
        for (let l of players) {
          l.stop();
        }
        players = [];
      }
    };

  }, [cameras]);
  /*const handleChange = () => {
    const arr = [1, 2, 4];
    const index = arr.findIndex(e => e == divCam);
    if (index < arr.length - 1) {
      //divCam = arr[index + 1];
      setDivCam(arr[index + 1]);
    } else {
      setDivCam(arr[0]);
      //divCam = arr[0];
    }
  };
  const play = () => {
    if(roomID) {
      setPlayCam(true)
      connectByRoom(roomID)
    } else {
      setToastMessage('Vui lòng chọn thiết bị');
      setPlayCam(false)
      dispatch(showToast());
    }
    //var ws_url = `ws://cdn01.vgps.vn/evup/${Date.now()}/${cameraId}`;
    //new VGPSPlayer(cameraId, { transport: ws_url });
    //playCam = true;
    //setPlayCam(true);
  };*/

  /* const stop = () => {
    playCam = false;
    //setPlayCam(false);
    //setPeers([])
  };*/
  return (
    <>
      {/*<div
        className="row p-1"
        style={{ backgroundColor: '#c62222', margin: '1em 0px' }}
      >
        <div className="col-6 items-left">
          {!playCam ? (
            <img
              className="cursor-pointer"
              onClick={() => play()}
              width="30px"
              height="30px"
              src="/static/iconSvg/controlPlay.svg"
            />
          ) : (
            <img
              className="cursor-pointer"
              onClick={() => stop()}
              width="30px"
              height="30px"
              src="/static/iconSvg/controlStop.svg"
            />
          )}
        </div>
        <div className="col-6 d-flex justify-content-end">
          <img
            style={{
              padding: '0.05px',
              borderRadius: '2px',
              border: '1px solid white'
            }}
            className="cursor-pointer"
            onClick={() => handleChange()}
            width="28px"
            height="28px"
            src={`/static/iconSvg/Grid${divCam}.svg`}
          />
        </div>
          </div>*/}
      <div className="row">
        {cameras.length > 0 &&
          cameras.map((camera, index) => {
            return index < divCam ? (
              <>
                {' '}
                <div
                  key={index}
                  className={divCam > 1 ? `col-6 px-0` : 'col-12 px-0'}
                >
                  <div
                    style={{
                      position: 'relative',
                      paddingLeft: 2.5,
                      paddingRight: 2.5
                    }}
                  >
                    <span className={classes.channelLabel}>
                      {' '}
                      {camera.name}{' '}
                    </span>
                    <Video id={camera.id} />{' '}
                  </div>
                </div>
              </>
            ) : null;
          })}
        {/*<Video key={cameraId} />*/}
      </div>
    </>
  );
});
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
export default VideoWall;
