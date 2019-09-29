import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css'; // import css


class CallWindow extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Video: true,
      Audio: true,
      Audio: {echoCancellation:true}      
    };

    this.btns = [
      { type: 'Video', icon: 'fa-video-camera' },
      { type: 'Audio', icon: 'fa-microphone' }
    ];  
  }




  componentDidMount() {
    this.setMediaStream();   
   }

  componentWillReceiveProps(nextProps) {
    const { config: currentConfig } = this.props;
    // Initialize when the call started
    if (!currentConfig && nextProps.config) {
      const { config, mediaDevice } = nextProps;
      _.forEach(config, (conf, type) => mediaDevice.toggle(_.capitalize(type), conf));

      this.setState({
        Video: config.video,
        Audio: config.audio
      });
    }
  }

  componentDidUpdate() {
    this.setMediaStream();
  }
 
  setMediaStream() {
    const { peerSrc, localSrc } = this.props;
    if (this.peerVideo && peerSrc) this.peerVideo.srcObject = peerSrc;
    if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc; 
  }

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  toggleMediaDevice(deviceType) {
    const { mediaDevice } = this.props;
    const deviceState = _.get(this.state, deviceType);
    this.setState({ [deviceType]: !deviceState });
    mediaDevice.toggle(deviceType);
  }

  renderControlButtons() {
    const getClass = (icon, type) => classnames(`btn-action fa ${icon}`, {
      disable: !_.get(this.state, type)
    });

    return this.btns.map(btn => (
      <button
        key={`btn${btn.type}`}
        type="button"
        className={getClass(btn.icon, btn.type)}
        onClick={() => this.toggleMediaDevice(btn.type)}
      />
    ));
  }

  render() {
    const { status, endCall,startCallInterviewer } = this.props;
    return (
      <div className={classnames('call-window', status)}>
        <video id="peerVideo" ref={el => this.peerVideo = el} autoPlay /> */}
        {/* <Player
          ref={player => {
            this.player = player;
          }}
          autoPlay
        >
          <source src={this.state.source} /></Player> */}

        <video id="localVideo" ref={el => this.localVideo = el} autoPlay muted />
        <div className="video-control">
          {this.renderControlButtons()}
          <button
            type="button"
            className="btn-action hangup fa fa-phone"
            onClick={() => endCall(true)}
          />
    {this.props.user && this.props.user.roleId == 2 ?
           <button
            type="button"
            className="btn-action startup fa fa-phone"
            onClick={() => startCallInterviewer(true)}
          ></button>: null}
        </div> 
      </div>
    );
  }
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.object, // eslint-disable-line
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
  startCallInterviewer: PropTypes.func.isRequired
};

// export default CallWindow;

const mapStateToProps = state => {
  return {
    user: state.User.userData    
  };
};

export default connect(
  mapStateToProps,
  null
)(CallWindow);