import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import { Player } from 'video-react';
//import 'video-react/dist/video-react.css'; // import css

class CallWindow extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Video: true,
      Audio: true,
      Audio: { echoCancellation: true },
      tasks: [
        {
          id: '1',
          taskName: 'Read book',
          type: 'inProgress',
          backgroundColor: 'red'
        },
        {
          id: '2',
          taskName: 'Pay bills',
          type: 'inProgress',
          backgroundColor: 'green'
        },
        {
          id: '3',
          taskName: 'Go to the gym',
          type: 'Done',
          backgroundColor: 'blue'
        },
        {
          id: '4',
          taskName: 'Play baseball',
          type: 'Done',
          backgroundColor: 'green'
        }
      ],
      skillTag: []
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
    console.log('this.props -- ', this.props);
    const { config: currentConfig } = this.props;
    // Initialize when the call started
    if (!currentConfig && nextProps.config) {
      const { config, mediaDevice } = nextProps;

      _.forEach(config, (conf, type) =>
        mediaDevice.toggle(_.capitalize(type), conf)
      );

      this.setState({
        Video: config.video,
        Audio: config.audio
      });
    }
  }

  componentDidUpdate() {
    this.setMediaStream();
  }

  //   doSomethingBeforeUnload = () => {
  //     this.props.endCall(true);
  //     // Do something
  // }

  // // Setup the `beforeunload` event listener
  // setupBeforeUnloadListener = () => {
  //     window.addEventListener("beforeunload", (ev) => {

  //         ev.preventDefault();

  //         return this.doSomethingBeforeUnload();
  //     });
  // };

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
    const getClass = (icon, type) =>
      classnames(`btn-action fa ${icon}`, {
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

  onDragStart = (event, taskName) => {
    console.log('dragstart on div: ', taskName);
    event.dataTransfer.setData('taskName', taskName);
  };
  onDragOver = event => {
    event.preventDefault();
  };

  onDrop = (event, cat) => {
    let taskName = event.dataTransfer.getData('taskName');
    const { saveSkiilTag } = this.props;
    console.log('taskName -- ', taskName);
    console.log(this.props);
    this.props.saveSkillTag(taskName);

    let tasks = this.state.tasks.filter(task => {
      if (task.taskName == taskName) {
        task.type = cat;
      }
      return task;
    });

    this.setState({
      ...this.state,
      tasks
    });
  };

  render() {
    var tasks = {
      inProgress: [],
      Done: []
    };
    let self = this;

    this.state.tasks.forEach(task => {
      tasks[task.type].push(
        <div
          key={task.id}
          onDragStart={event => this.onDragStart(event, task.taskName)}
          draggable
          className="draggable"
          style={{ backgroundColor: task.bgcolor }}
        >
          {task.taskName}
        </div>
      );
    });

    const { status, endCall, startCallInterviewer, saveSkiilTag } = this.props;
    return (
      <div>
        <div className={classnames('call-window', status)}>
          <div className="drag-container">
            <h2 className="head">To Do List Drag & Drop</h2>
            <div
              className="inProgress"
              onDragOver={event => this.onDragOver(event)}
              onDrop={event => {
                this.onDrop(event, 'inProgress');
              }}
            >
              <span className="group-header">In Progress</span>
              {tasks.inProgress}
            </div>
            <div
              className="droppable"
              onDragOver={event => this.onDragOver(event)}
              onDrop={event => this.onDrop(event, 'Done')}
            >
              <span className="group-header">Done</span>

              {tasks.Done}
            </div>
          </div>
          <video id="peerVideo" ref={el => (this.peerVideo = el)} autoPlay />
          {/* <Player
          ref={player => {
            this.player = player;
          }}
          autoPlay
        >
          <source src={this.state.peerSrc} /></Player>  */}

          <video
            id="localVideo"
            ref={el => (this.localVideo = el)}
            autoPlay
            muted
          />

          <div className="video-control">
            {this.renderControlButtons()}
            {this.props.user && this.props.user.roleId == 2 ? (
              <button
                type="button"
                className="btn-action hangup fa fa-phone"
                onClick={() => endCall(true)}
              />
            ) : null}
            {this.props.user && this.props.user.roleId == 2 ? (
              <button
                type="button"
                className="btn-action startup fa fa-phone"
                onClick={() => startCallInterviewer(true)}
              ></button>
            ) : null}
          </div>
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
  startCallInterviewer: PropTypes.func.isRequired,
  saveSkiilTag: PropTypes.func.isRequired
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
