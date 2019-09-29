import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Portal } from 'react-overlays';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  Checkbox,
  Col,
  ControlLabel,
  FormControl,
  InputGroup,
  Radio
} from 'react-bootstrap';
import Header from '../header/header';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
//import DatePicker from 'react-datepicker';
//import DatePicker from '../../../../assets/react-datepicker/es/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionGetStudentList } from '../../common/core/redux/actions';
import { actionSetStudentAsUser } from '../../common/core/redux/actions';
import moment from 'moment';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import ImageCropper from '../../common/cropper/imageCropper';
import achievementDefaultImage from '../../assets/img/default_achievement.jpg';
import _ from 'lodash';
import VideoPlayer from 'react-video-js-player';

import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  isValidURL,
  ZoomInAndOut,
  generateTimestamp
} from '../../common/commonFunctions';
import spikeViewApiService from '../../common/core/api/apiService';
//import MediaList from '../mediaList';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;
let badgeImgArray = [];
let badgeImgPreview = [];
let certificateImgArray = [];
let certificateImgPreview = [];
let mediaImgArray = [];
let mediaImgPreview = [];
const emptyToDate = '10000000';



class ShowVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {   
        // video: {
        //     src: this.props.chatLink,
        //     poster: "http://www.example.com/path/to/video_poster.jpg"         
        // }, 
        showVideoModal:true
    }; 
  }

  componentWillMount() {   
      console.log(typeof(this.props.chatLink));
      console.log(this.props.userId);
     let videoLink = this.props.chatLink;   
     this.setState({chatLink:this.props.chatLink });
  }


onPlayerReady(player){
    console.log("Player is ready: ", player);
    this.player = player;
}

onVideoPlay(duration){
    console.log("Video played at: ", duration);
}

onVideoPause(duration){
    console.log("Video paused at: ", duration);
}

onVideoTimeUpdate(duration){
    console.log("Time updated: ", duration);
}

onVideoSeeking(duration){
    console.log("Video seeking: ", duration);
}

onVideoSeeked(from, to){
    console.log(`Video seeked from ${from} to ${to}`);
}

onVideoEnd(){
    console.log("Video ended");
}




  closeShowVideoModal = status => {   
    this.setState({
      showVideoModal: false
      
    });   
    this.props.closeShowVideoComponent();
  };

  render() {
    let self = this;
    const { isLoading } = this.state;  
     console.log(self.props.chatLink);
  
    return (
      <Modal
      bsSize="large"
      show={this.state.showVideoModal}
      onHide={this.closeShowVideoModal.bind(this, 'close')}
      backdrop="static"
      keyboard={false}
    >
      <ToastContainer
        autoClose={5000}
        className="custom-toaster-main-cls"
        toastClassName="custom-toaster-bg"
        transition={ZoomInAndOut}
      />
      <Modal.Header closeButton>
        <Modal.Title className="subtitle text-center">
         Video           
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
         {this.state.chatLink ?     <VideoPlayer
                        controls={true}
                        src={this.state.chatLink}
                       // poster={this.state.video.poster}
                        width="720"
                        height="420"
                        type="video/webm" 
                        onReady={this.onPlayerReady.bind(this)}
                        onPlay={this.onVideoPlay.bind(this)}
                        onPause={this.onVideoPause.bind(this)}
                        onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                        onSeeking={this.onVideoSeeking.bind(this)}
                        onSeeked={this.onVideoSeeked.bind(this)}
                        onEnd={this.onVideoEnd.bind(this)}
                    /> : "Video is not available"}   
              </Modal.Body>
          <Modal.Footer>
       
           
           </Modal.Footer>
           </Modal>          
            
     
    );
  }
}
ShowVideo = validation(strategy)(ShowVideo);
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { actionGetStudentList, actionSetStudentAsUser },
    dispatch
  );
};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowVideo);
