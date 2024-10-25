import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 40%;
    padding: 30px;
    background-color: black;
    background-clip: content-box;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', stream => {
      console.log(`stream: `, stream);
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <StyledVideo playsInline autoPlay ref={ref} />
  );
};


const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const [isBroadcaster, setBroadcaster] = useState(false);
  const [isViewer, setViewer] = useState(false);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  let roomID = 1;
  const query = new URLSearchParams(useLocation().search);
  const role = query.get('role');
  useEffect(() => {
    if (role === 'broadcaster') {
      setBroadcaster(true);
      setViewer(false);
    } else if (role === 'viewer') {
      setViewer(true);
      setBroadcaster(false);
    }
    console.log(peers);
  }, [role]);

  useEffect(() => {
    socketRef.current = io.connect(process.env.REACT_APP_WS);
    if (role === 'broadcaster') {
      navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then(stream => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('broadcaster join room', roomID);
        socketRef.current.on('new viewer', viewerID => {
          console.log('create peer and add stream for viewer');
          const peers = [];
          const peer = createPeer(viewerID, socketRef.current.id, stream);
          peersRef.current.push({
            peerID: viewerID,
            peer
          });
          peers.push({
            peerID: viewerID,
            peer
          });
          console.log(`peers: `, peers);
          setPeers(peers);
        });

        socketRef.current.on('broadcaster joined', payload => {
          console.log('broadcaster joined', payload);
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
          });

          peer.on('signal', signal => {
            console.log('emit return signal event from broadcaster');
            socketRef.current.emit('returning signal', { signal, callerID: payload.callerID });
          });

          peer.signal(payload.signal);
        });

        socketRef.current.on('receiving returned signal', payload => {
          console.log(`receiving returned signal`);
          const item = peersRef.current.find(p => p.peerID === payload.id);
          console.log(item);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on('user left', id => {
          const peerObj = peersRef.current.find(p => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(p => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });


      });
    } else if (role === 'viewer') {
      console.log(`id: `, socketRef.current);
      socketRef.current.emit('viewer join room', roomID);
      socketRef.current.on('viewer joined', payload => {
        console.log(payload.callerID + ' Received joined event');
        const peer = new Peer({
          initiator: false,
          trickle: false
        });

        peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        console.log(`peersRef: `, peersRef);

        const peerObj = {
          peer,
          peerID: payload.callerID
        };

        let isPeerExists = false;
        peers.forEach(peer => {
          if (peer.peerID === peerObj.peerID) {
            isPeerExists = true;
          }
        });
        if (!isPeerExists) {
          setPeers(peers => [...peers, peerObj]);
        }


        peer.on('signal', signal => {
          console.log('emit return signal event from viewer');
          socketRef.current.emit('returning signal', { signal, callerID: payload.callerID });
        });

        peer.signal(payload.signal);
      });

      socketRef.current.on('receiving returned signal', payload => {
        console.log(`receiving returned signal`);
        const item = peersRef.current.find(p => p.peerID === payload.id);
        console.log(item);
        item.peer.signal(payload.signal);
      });

      socketRef.current.on('new broadcaster', broadcasterId => {
        console.log('new broadcaster event');
        console.log('create peer and add it to list of current peer');
        const peer = new Peer({
          initiator: true,
          trickle: false
        });
        console.log(`peersRef: `, peersRef);
        peersRef.current.push({
          peerID: broadcasterId,
          peer
        });
        console.log(`peersRef: `, peersRef);

        const peerObj = {
          peer,
          peerID: broadcasterId
        };
        console.log(`peersObj: `, peerObj);

        let isPeerExists = false;
        peers.forEach(peer => {
          if (peer.peerID === peerObj.peerID) {
            isPeerExists = true;
          }
        });
        if (!isPeerExists) {
          console.log('Add peers');
          setPeers(peers => [...peers, peerObj]);
        }

        peer.on('signal', signal => {
          socketRef.current.emit('sending signal', {
            userToSignal: broadcasterId,
            callerID: socketRef.current.id,
            signal,
            from: 'broadcaster'
          });
        });
      });

      console.log('peers: ', peers);

      socketRef.current.on('broadcaster left', id => {
        const peerObj = peersRef.current.find(p => p.peerID === id);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        const peers = peersRef.current.filter(p => p.peerID !== id);
        peersRef.current = peers;

        console.log('peersRef: ', peersRef);
        console.log('peers: ', peers);
        setPeers(peers);
      });
    }
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
        from: 'viewer'
      });
    });

    return peer;
  }

  // function addPeer(incomingSignal, callerID, stream) {
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream
  //   });
  //
  //   peer.on('signal', signal => {
  //     socketRef.current.emit('returning signal', { signal, callerID });
  //   });
  //   console.log(`incomingSignal: `, incomingSignal);
  //   peer.signal(incomingSignal);
  //
  //   return peer;
  // }

  return (
    <Container>
      {isBroadcaster && <StyledVideo muted ref={userVideo} autoPlay playsInline />}

      { peers.map((peer) => {
        console.log(`peer: `, peer);
        return (
          <Video key={peer.peerID} peer={peer.peer} />
        );
      })}
    </Container>
  );
};

export default Room;
