import React, { useEffect, useRef, useState, Component } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import PlaybackTable from './PlaybackTable';
import Hls from './hls';

const hlsRecMap = new Map();
console.log('hlsRecMap >>>>>',hlsRecMap);
const CDN_API_URL = process.env.REACT_APP_CDN_API_SERVER;

class PlaybackPlayer extends Component {
  constructor(props) {
    super(props);
    this.handleRowClickView = this.handleRowClickView.bind(this);
  }
  handleRowClickView(fileInfo) {
    if (!this.props.vehicleSelected) {
      alert('Không tìm thấy thông tin xe');
      return;
    }
    console.log('======>devicee,', this.props.vehicleSelected);
    var channelId = this.props.vehicleSelected.channelId;
    var deviceId = this.props.vehicleSelected.id;
    var src = `${CDN_API_URL}/vgps/hls/box/${channelId}/${fileInfo.FileId}.m3u8`;
    var hls;
    if (hlsRecMap.size > 0) {
      console.log('checkHlsRecMap >>>>>',hlsRecMap);
      hls = hlsRecMap.get(channelId);
      hls.destroy();
      hlsRecMap.delete(channelId);
    }
    var mediaPlayer = document.getElementById(channelId);
    if (!mediaPlayer) {
      alert('Không tìm thấy thông player media');
      return;
    }
    //Khởi tạo player
    hls = new Hls();
    hlsRecMap.set(channelId, hls);
    hls.loadSource(src);
    hls.attachMedia(mediaPlayer);
    var self = this;
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      mediaPlayer.play();
      self.props.onReady({
        player: mediaPlayer,
        isReady: true,
        fileInfo: fileInfo,
        channelId: channelId,
        deviceId: deviceId
      });
    });
    hls.on(Hls.Events.ERROR, function (event, data) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // alert('LỖI NETWORK');
          console.log('LỖI NETWORK');
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          //alert('LỖI MEDIA');
          console.log('LỖI MEDIA');
          break;
        default:
          alert('KHÔNG CÓ DỮ LIỆU');
          hls.destroy();
          break;
      }
    });
  }
  render() {
    return <PlaybackTable onRowClickView={this.handleRowClickView} />;
  }
}

export default PlaybackPlayer;
