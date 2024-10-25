import ControlIcons from 'src/app/components/player/ControlIcons';
import PlaybackProcessPlayer from './PlaybackProcessPlayer';
import React, { useEffect, useRef, useState } from 'react';

const PlaybackControlPlayer = React.memo(({ player, isReady }) => {
  {
    ///Player Control
    const format = seconds => {
      if (isNaN(seconds)) {
        return '00:00';
      }

      const date = new Date(seconds * 1000);
      const hh = date.getUTCHours();
      const mm = date.getUTCMinutes();
      const ss = date
        .getUTCSeconds()
        .toString()
        .padStart(2, '0');

      if (hh) {
        return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
      } else {
        return `${mm}:${ss}`;
      }
    };
    const [playerstate, setPlayerState] = useState({
      playing: true,
      muted: true,
      volume: 0.5,
      playerbackRate: 1.0,
      played: 0,
      seeking: false
    });
    //Destructure State in other to get the values in it
    const {
      playing,
      muted,
      volume,
      playerbackRate,
      played,
      seeking
    } = playerstate;
    const playerRef = player;
    const playerDivRef = useRef(null);
    const handlePlayAndPause = () => {
      if (!isReady) return;
      setPlayerState({ ...playerstate, playing: !playerstate.playing });
      if (playerstate.playing) {
        player.pause();
      } else {
        player.play();
      }
    };

    const handleMuting = () => {
      setPlayerState({ ...playerstate, muted: !playerstate.muted });
    };

    const handleRewind = () => {
      if (!isReady) return;
      player.currentTime = getCurrentTime() - 5;
    };

    const handleFastForward = () => {
      if (!isReady) return;
      player.currentTime = getCurrentTime() + 10;
    };

    const handleVolumeChange = (e, newValue) => {
      setPlayerState({
        ...playerstate,
        volume: parseFloat(newValue / 100),
        muted: newValue === 0 ? true : false
      });
    };

    const handleVolumeSeek = (e, newValue) => {
      setPlayerState({
        ...playerstate,
        volume: parseFloat(newValue / 100),
        muted: newValue === 0 ? true : false
      });
    };

    const handlePlayerRate = rate => {
      try {
        if (!isReady) return;
        setPlayerState({ ...playerstate, playerbackRate: rate });
        player.playbackRate = rate;
      } catch (error) {
        this.props.onError(error);
      }
    };

    const handleFullScreenMode = () => {
      //screenfull.toggle(playerDivRef.current);
    };

    const handlePlayerProgress = state => {
      if (!playerstate.seeking) {
        setPlayerState({
          ...playerstate,
          ...state,
          playerbackRate: playerbackRate
        });
      }
    };

    const handlePlayerSeek = (e, newValue) => {
      //Tính toán seek
      const duration = getDuration();
      if (!duration || !isReady) {
        console.warn('could not seek – duration not yet available');
        return;
      }
      player.currentTime = parseFloat(newValue / 100) * duration;
      //Set lại state
      setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
    };

    const handlePlayerMouseSeekDown = e => {
      setPlayerState({ ...playerstate, seeking: true });
    };

    const handlePlayerMouseSeekUp = (e, newValue) => {
      setPlayerState({ ...playerstate, seeking: false });
      playerRef.current.seekTo(newValue / 100);
    };
    const getCurrentTime = () => {
      if (!isReady) return null;
      return player.currentTime;
    };

    const getDuration = () => {
      if (!player) return null;
      const { duration, seekable } = player;
      if (duration === Infinity && seekable.length > 0) {
        return seekable.end(seekable.length - 1);
      }
      return duration;
    };
    const currentPlayerTime = player != null ? getCurrentTime() : '00:00';
    const movieDuration = player != null ? getDuration() : '00:00';
    const playedTime = format(currentPlayerTime);
    const fullMovieTime = format(movieDuration);
    return (
      <div>
        <PlaybackProcessPlayer
          handlePlayAndPause={handlePlayAndPause}
          handlePlayerProgress={handlePlayerProgress}
          playerbackRate={playerbackRate}
          player={player}
          isReady={isReady}
        />
        <ControlIcons
          key={volume.toString()}
          playandpause={handlePlayAndPause}
          playing={playing}
          rewind={handleRewind}
          fastForward={handleFastForward}
          muting={handleMuting}
          muted={muted}
          volumeChange={handleVolumeChange}
          volumeSeek={handleVolumeSeek}
          volume={volume}
          playerbackRate={playerbackRate}
          playRate={handlePlayerRate}
          fullScreenMode={handleFullScreenMode}
          played={played}
          onSeek={handlePlayerSeek}
          onSeekMouseUp={handlePlayerMouseSeekUp}
          onSeekMouseDown={handlePlayerMouseSeekDown}
          playedTime={playedTime}
          fullMovieTime={fullMovieTime}
          seeking={seeking}
          isReady={isReady}
        />
      </div>
    );
  }
});

export default PlaybackControlPlayer;
