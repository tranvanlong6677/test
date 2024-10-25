import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import ToastMessage from '../../components/ToastMessage';
import { messageToastType_const } from '../../constant/config';
import { showToast } from '../../../features/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import { Grid, makeStyles } from '@material-ui/core';
import BorderAllIcon from '@material-ui/icons/BorderAll';

const StyledVideo = styled.video`
  width: 100%;
  max-height: 100%;
  background-color: #4c4c4c;
  background-clip: content-box;
  border: 2px solid #c62222;
`;

const event = {
  BROAD_CASTER_JOIN_ROOM: 'broadcaster-join-room',
  OFFER_FROM_BROADCASTER: 'offer-from-broadcaster',
  ANSWER_FROM_BROADCASTER: 'answer-from-broadcaster',
  ICE_CANDIDATE_FROM_BROADCASTER: 'ice-candidate-from-broadcaster',

  VIEWER_JOIN_ROOM: 'viewer-join-room',
  OFFER_FROM_VIEWER: 'offer-from-viewer',
  ANSWER_FROM_VIEWER: 'answer-from-viewer',
  ICE_CANDIDATE_FROM_VIEWER: 'ice-candidate-from-viewer',

  BROADCASTER_NOT_JOIN_ROOM: 'broadcaster_not_join_room',

  VIEWER_LEFT: 'viewer-left',
  BROADCASTER_LEFT: 'broadcaster-left',
  VIEWER_REACH_LIMIT: 'viewer_reach_limit'
};

const Video = props => {
  const ref = useRef();

  useEffect(() => {
    console.log('props.peer: ', props.peer);
    // props.peer.ontrack = (e) => {
    //   console.log(`stream: `, e.streams[0]);
    //   ref.current.srcObject = e.streams[0];
    // };
    props.peer.onaddstream = event => {
      console.log('onaddstream', event.stream);
      ref.current.srcObject = event.stream;
    };
  }, []);

  return <> <div> <StyledVideo playsInline autoPlay ref={ref} /></div> </>;
};

function VideoComponent({ roomID }) {
  // webRTC
  const classes = useStyles();
  const peersRef = useRef([]);
  const socketRef = useRef();
  const dispatch = useDispatch();

  const handleChange = () => {
    const arr = [1, 2, 4];
    const index = arr.findIndex((e) => e == divCam );
    if (index < arr.length - 1) {
      setDivCam(arr[index + 1])

    } else {
      setDivCam(arr[0])
    }
  }
  // let roomID = 868808038275142;
  const [peers, setPeers] = useState([]);
  const isShowToast = useSelector(state => state.uiSlice.isShowToast);
  const [toastMessage, setToastMessage] = useState();
  const [divCam, setDivCam] = useState(1)
  const [playCam, setPlayCam] = useState(false)

  useEffect(() => {
    setPeers([])
    setPlayCam(false)
  }, [roomID]);

  const connectByRoom = (roomID) => {
    // console.log(roomID);
    socketRef.current = io.connect(`${process.env.REACT_APP_WS}`);

    socketRef.current.emit(event.VIEWER_JOIN_ROOM, { roomID });

    let iceCandidatesQueue = [];
    // Recive offer from broadcaster
    // {desc: desc, viewerID, broadcasterID: socket.id}
    socketRef.current.on(event.OFFER_FROM_BROADCASTER, payload => {
      console.log('event: ', event.OFFER_FROM_BROADCASTER);
      const { desc, viewerID, broadcasterID } = payload;
      const peer = createPeer();
      peer.onicecandidate = function(e) {
        if (e.candidate) {
          console.log('sending ice candidate: ', e.candidate);
          socketRef.current.emit(event.ICE_CANDIDATE_FROM_VIEWER, {
            roomID,
            viewerID,
            ice: e.candidate
          });
        }
      };

      peersRef.current = [
        {
          peerID: broadcasterID,
          peer: peer
        }
      ];
      setPeers([{ peer, peerID: broadcasterID }]);

      // peersRef.current.push({
      //   peerID: broadcasterID,
      //   peer: peer
      // });
      // setPeers(peers => [...peers, { peer, peerID: broadcasterID }]);

      const remoteDescription = new RTCSessionDescription(desc);
      peer
        .setRemoteDescription(remoteDescription)
        .then(() => {
          console.log(
            'Set REMOTE description success. REMOTE DESCRIPTION: ',
            JSON.stringify(remoteDescription)
          );
          if (iceCandidatesQueue) {
            iceCandidatesQueue.forEach(candidate => {
              peer
                .addIceCandidate(candidate)
                .then(() => {
                  console.log(`set ice-candidate for from queue`);
                })
                .catch(err => {
                  console.log('set ice-candidate failed: ', err.name);
                });
            });
          }
          iceCandidatesQueue = null;
          var mediaConstraints = {
            answerToReceiveAudio: true
          };
          return peer.createAnswer(mediaConstraints);
        })
        .then(answer => {
          console.log(
            'Set LOCAL description success. ANSWER DESCRIPTION: ',
            JSON.stringify(answer)
          );
          return peer.setLocalDescription(answer);
        })
        .then(() => {
          const answerFromViewerPayload = {
            desc: peer.localDescription,
            broadcasterID,
            roomID
          };
          socketRef.current.emit(
            event.ANSWER_FROM_VIEWER,
            answerFromViewerPayload
          );
        });

      socketRef.current.on(event.ICE_CANDIDATE_FROM_BROADCASTER, payload => {
        const iceCandidate = new RTCIceCandidate(payload.ice);
        if (peer.remoteDescription) {
          peer
            .addIceCandidate(iceCandidate)
            .then(() => {
              console.log(`===set ice-candidate for success`);
            })
            .catch(err => {
              console.log('set ice-candidate failed: ', err.name);
            });
        } else {
          console.log('add ice to queue');
          iceCandidatesQueue.push(iceCandidate);
        }
      });

      peer.ontrack = handleAddTrack;
      peer.onaddstream = handleAddStream;
      peer.oniceconnectionstatechange = function() {
        console.log('ICE state: ', peer.iceConnectionState);
      };
    });
  


    // break;
    // }

    socketRef.current.on(event.BROADCASTER_LEFT, payload => {
      const { broadcasterID } = payload;
      const peerObj = peersRef.current.find(p => p.peerID === broadcasterID);
      if (peerObj) {
        peerObj.peer.close();
      }
      const peers = peersRef.current.filter(p => p.peerID !== broadcasterID);
      peersRef.current = peers;
      //
      // console.log('peersRef: ', peersRef);
      // console.log('peers: ', peers);
      setPeers(peers);
    });

    socketRef.current.on(event.VIEWER_REACH_LIMIT, () => {
      console.log('VIEWER REACH LIMIT');
      setToastMessage('Đã đạt giới hạn 2 người xem một lúc');
      setPlayCam(false)
      dispatch(showToast());
    });

    socketRef.current.on(event.BROADCASTER_NOT_JOIN_ROOM, () => {
      console.log('Camera chưa connect đến server. Vui lòng kiểm tra lại');
      setToastMessage('Camera chưa connect đến server. Vui lòng kiểm tra lại');
      setPlayCam(false)
      dispatch(showToast());
    });
  }
  const play = () => {
    if(roomID) {
      setPlayCam(true)
      connectByRoom(roomID)
    } else {
      setToastMessage('Vui lòng chọn thiết bị');
      setPlayCam(false)
      dispatch(showToast());
    }
  }

  const stop = () => {
    setPlayCam(false)
    setPeers([])
  }

  function createPeer() {
    return new RTCPeerConnection({
      iceServers: [
        {
          url: 'turn:18.141.178.224:3479',
          username: 'VgpsWebrtc',
          credential: 'vgpsTurn224'
        }
        // {
        //   "url": "turn:turn-tokyo.ohmnilabs.com:5349?transport=tcp",
        //   "username": "turn-ramen",
        //   "credential": "H7D0AArXju9d",
        //   "urls": "turn:turn-tokyo.ohmnilabs.com:5349?transport=tcp"
        // }
      ]
    });
  }

  // TODO: Handle add track
  function handleAddTrack(e) {
    console.log('handleAddTrack');
    // remoteVideoRef.current.srcObject = e.streams[0]
  }

  function handleAddStream(event) {
    console.info('event onaddstream', JSON.stringify(event.stream));
  }

  function lackofCam() {
    var tmp = [];
    for (var i = 1; i <= divCam - peers.length; i++) {
      tmp.push(i);
    }

    return tmp;
  }

  return (
    <>
      {isShowToast && (
        <ToastMessage
          type={messageToastType_const.warning}
          message={toastMessage}
        />
      )}
      <div className="row p-1" style={{backgroundColor:"#c62222", margin: '1em 0px'}}>
        <div className="col-6 items-left">
            { !playCam 
              ? <img className="cursor-pointer" onClick={() => play()} width="30px" height="30px"
                src="/static/iconSvg/controlPlay.svg" /> 
              :  <img className="cursor-pointer" onClick={() => stop()} width="30px" height="30px"
                src="/static/iconSvg/controlStop.svg" />
            }
          
        </div>
        <div className="col-6 d-flex justify-content-end">

          <img style={{ padding: '0.05px', borderRadius: '2px', border: '1px solid white'}} className="cursor-pointer" onClick={() => handleChange()} width="28px" height="28px"
            src={`/static/iconSvg/Grid${divCam}.svg`} />

        </div>
      </div>
      {/*<h1>Broadcast: {peers.length}</h1>*/}
      <div className="row">
        {peers.length > 0 &&
          peers.map((peer, index) => {
            return index < divCam ? (<> <div key={index}  className={divCam > 1 ? `col-6 mt-2` : 'col-12 mt-2'}> 
              <div style={{position:'relative'}}>
                <span className={classes.channelLabel}> CH{index+1} </span><Video key={index} peer={peer.peer} /> </div>
              </div></>) : null;
          })}

        {playCam && lackofCam().length > 0 && lackofCam().map((item, index) => {
          return item  ? (<> <div  key={index}  className={divCam > 1 ? `col-6 mt-2` : 'col-12 mt-2'}> 
            <div style={{position:'relative'}}>
              <span className={classes.channelLabel}> CH{peers.length + index +1} </span>
                <div className={classes.noSignal}> No SIGNAL </div>
              
              </div>
            </div></>) : null;
        })}
      </div>

      {/* <StyledVideo /> */}
      {/*{<Repeat numTimes={2 - peers.length} />}*/}
    </>
  );
}

const Repeat = props => {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(<StyledVideo playsInline autoPlay />);
  }
  return items;
};

const useStyles = makeStyles(theme => ({
  pagination: {
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '64px',
    marginTop: '10px', 
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
export default VideoComponent;
