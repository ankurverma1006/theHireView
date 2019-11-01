import React, { Component } from 'react';
import Header from '../header/header';
import SideBar from '../header/sidebar';
// import {
//   Button,
//   Media,
//   Row,
//   Col,
//   FormControl,
//   InputGroup
// } from 'react-bootstrap';
import { Modal, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from 'video-react';
import VideoPlayer from 'react-video-js-player';
//import Summary from './summary/addSummary';
import ShowVideo from '../jobDescription/showVideo';

//import CompetencyRecommendations from '../profile/competency/recommendations/competencyWiseRecommendations';
import ImageCropper from '../../common/cropper/imageCropper';
import DownloadLink from 'react-download-link';
//import Img from '../../common/cropper/img';
import {
  showErrorToast,
  uploadToAzure,
  limitCharacter,
  SampleNextArrow,
  SamplePrevArrow,
  getThumbImage
} from '../../common/commonFunctions';
import theRapidHireApiService from '../../common/core/api/apiService';
import CONSTANTS from '../../common/core/config/appConfig';

import {
  actionGetStudentPersonalInfo,
  actionGetAllCompetency,
  actionGetAchievementsByUser,
  actionGetRecommendationsByUser,
  actionUpdateUserInfo,
  actionGetAchievementsData
} from '../../common/core/redux/actions';
import achievementDefaultImage from '../../assets/img/default_achievement.jpg';
import SpiderChart from '../../common/spiderChart/spiderChart';

var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  swipeToSlide: true,
  // nextArrow: <SampleNextArrow props={this.props} />,
  // prevArrow: <SamplePrevArrow props={this.props} />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

class VideoHistory extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      video: {
        src: 'http://www.example.com/path/to/video.mp4',
        poster: 'http://www.example.com/path/to/video_poster.jpg'
      },
      showJobDescriptionComponent: false,
      jobDescriptionDetail: {},

      loader1: false,
      loader2: false,
      jobDescriptionListData: [],
      userData: {},
      showDropdown: false,
      isActive: 'true',
      contentEditable: false,
      editName: false,
      name: '',
      editTagLine: false,
      showVideo: false,
      videoSkillTag: []
    };

    //To use microphone it shud be {audio: true}
    this.audioConstraints = {
      //  audio: true,
      video: true
    };
    this.seek = this.seek.bind(this);
  }

  componentWillMount() {
    //let userId = this.props.user.userId;
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
    document.body.classList.remove('home');
    document.body.classList.remove('fixedHeader');
    console.log(this.props.location);
    this.getSlotDetails(this.props.location.state.userId);
  }

  getSlotDetails(userId) {
    theRapidHireApiService('getTimeSlotByUser', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          console.log(response);
          let slotVideoData = response.data.result[0];
          let videoLinkInterviewer = slotVideoData.videoChatLinkInterviewer;
          let videoLinkUser = slotVideoData.videoChatLinkUser;
          console.log(response.data);
          let videoSkillTag = response.data.result[0].videoSkillTag;
          //     let bookedSlotData=[];
          //     bookedSlotData = response.data.result;
          this.setState({ videoLinkInterviewer, videoSkillTag });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  //   onPlayerReady(player){
  //     console.log("Player is ready: ", player);
  //     this.player = player;
  // }

  // onVideoPlay(duration){
  //     console.log("Video played at: ", duration);
  // }

  // onVideoPause(duration){
  //     console.log("Video paused at: ", duration);
  // }

  // onVideoTimeUpdate(duration){
  //     console.log("Time updated: ", duration);
  // }

  // onVideoSeeking(duration){
  //     console.log("Video seeking: ", duration);
  // }

  // onVideoSeeked(from, to){
  //     console.log(`Video seeked from ${from} to ${to}`);
  // }

  // onVideoEnd(){
  //     console.log("Video ended");
  // }

  seek(seconds) {
    return () => {
      this.player.seek(seconds);
    };
  }

  render() {
    const videoConstraints = {
      facingMode: 'user'
    };
    return (
      <div className="wrapper">
        <Header {...this.props} />
        <div className="main-panel">
          <div>
            {this.state.videoLinkInterviewer ? (
              // <VideoPlayer
              //             controls={true}
              //             src={this.state.videoLinkInterviewer}
              //      //       poster={this.state.video.poster}
              //             type="video/webm"
              //             currentTime="10.573812"
              //             width="720"
              //             height="420"
              //             onReady={this.onPlayerReady.bind(this)}
              //             onPlay={this.onVideoPlay.bind(this)}
              //             onPause={this.onVideoPause.bind(this)}
              //             onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
              //             onSeeking={this.onVideoSeeking.bind(this)}
              //             onSeeked={this.onVideoSeeked.bind(this)}
              //             onEnd={this.onVideoEnd.bind(this)}
              //         />
              <Player
                poster="/assets/poster.png"
                fluid={false}
                videoWidth="720"
                videoHeight="420"
                ref={player => {
                  this.player = player;
                }}
              >
                <source src={this.state.videoLinkInterviewer} />
                <source src={this.state.videoLinkInterviewer} />

                <ControlBar>
                  <ReplayControl seconds={10} order={1.1} />
                  <ForwardControl seconds={30} order={1.2} />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  <PlaybackRateMenuButton
                    rates={[5, 2, 1, 0.5, 0.1]}
                    order={7.1}
                  />
                  <VolumeMenuButton />
                </ControlBar>
              </Player>
            ) : (
              'Video is not available'
            )}
          </div>

          {this.state.videoSkillTag &&
            this.state.videoSkillTag.length > 0 &&
            this.state.videoSkillTag.map((data, index) => (
              <div>
                {data.skill}
                <Button onClick={this.seek(1)} className="mr-3">
                  currentTime = 50
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    student: state.Student
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetStudentPersonalInfo,
      actionGetAllCompetency,
      actionGetAchievementsByUser,
      actionGetRecommendationsByUser,
      actionUpdateUserInfo,
      actionGetAchievementsData
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoHistory);
