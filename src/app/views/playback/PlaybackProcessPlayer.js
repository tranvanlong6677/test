import React, { Component } from 'react';
import isEqual from 'react-fast-compare';

const progressInterval = 1000;

class PlaybackProcessPlayer extends Component {
  constructor(props) {
    super(props);
    this.prevPlayed = null;
    this.prevLoaded = null;
    this.progress();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }
  componentDidUpdate(prevProps) {
    /*const { light } = this.props
    if (!prevProps.light && light) {
      this.setState({ showPreview: true })
    }
    if (prevProps.light && !light) {
      this.setState({ showPreview: false })
    }*/
  }
  getCurrentTime() {
    if (!this.props.isReady) return null;
    return this.props.player.currentTime;
  }
  getDuration() {
    if (!this.props.player) return null;
    const { duration, seekable } = this.props.player;
    if (duration === Infinity && seekable.length > 0) {
      return seekable.end(seekable.length - 1);
    }
    return duration;
  }
  getSecondsLoaded() {
    if (!this.props.isReady) return null;
    if (!this.props.player) return null;
    const { buffered } = this.props.player;
    if (buffered.length === 0) {
      return 0;
    }
    const end = buffered.end(buffered.length - 1);
    const duration = this.getDuration();
    if (end > duration) {
      return duration;
    }
    return end;
  }

  progress() {
    if (this.props.player && this.props.isReady) {
      const playedSeconds = this.getCurrentTime() || 0;
      const loadedSeconds = this.getSecondsLoaded();
      const duration = this.getDuration();
      if (duration > 0) {
        const progress = {
          playedSeconds,
          played: playedSeconds / duration
        };
        if (loadedSeconds !== null) {
          progress.loadedSeconds = loadedSeconds;
          progress.loaded = loadedSeconds / duration;
        }
        //có thay đổi thì mới cập nhập
        if (
          progress.playedSeconds !== this.prevPlayed ||
          progress.loadedSeconds !== this.prevLoaded
        ) {
          this.props.handlePlayerProgress(progress);
        }
        this.prevPlayed = progress.playedSeconds;
        this.prevLoaded = progress.loadedSeconds;
      }
    }
    setTimeout(this.progress.bind(this), progressInterval);
  }
  render() {
    return <div></div>;
  }
}
export default PlaybackProcessPlayer;
