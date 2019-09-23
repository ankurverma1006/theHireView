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
import { Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import S3FileUpload from 'react-s3';

import VideoPlayer from 'react-video-js-player';
//import Summary from './summary/addSummary';
import ShowVideo from '../jobDescription/showVideo';

//import CompetencyRecommendations from '../profile/competency/recommendations/competencyWiseRecommendations';
import ImageCropper from '../../common/cropper/imageCropper';
import DownloadLink from "react-download-link";
//import Img from '../../common/cropper/img';
import {
  showErrorToast,
  uploadToAzure,
  limitCharacter,
  SampleNextArrow,
  SamplePrevArrow,
  getThumbImage
} from '../../common/commonFunctions';
import spikeViewApiService from '../../common/core/api/apiService';
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
  nextArrow: <SampleNextArrow props={this.props} />,
  prevArrow: <SamplePrevArrow props={this.props} />,
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

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

class VideoHistory extends Component {
  constructor(props, context) {
    super(props);
   
    this.state = {  
        video: {
            src: "http://www.example.com/path/to/video.mp4",
            poster: "http://www.example.com/path/to/video_poster.jpg"
        },    
      showJobDescriptionComponent: false,      
      jobDescriptionDetail: {},        
     
      loader1: false,
      loader2: false,      
      jobDescriptionListData: [],     
      userData:{},     
      showDropdown: false,     
      isActive: 'true',     
      contentEditable: false,
      editName: false,
      name: '',
      editTagLine: false,
      showVideo:false
    };
    var wRegion = "ap-south-1";
    var poolid = 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c';
    var s3bucketName = "ankurself";
    var audioPath = "/audio-files";
    var s3bucketName = "ankurself";
    var audioPath = "/audio-files";
    var audioStoreWithBucket=s3bucketName+audioPath;
    //AudioStream = new AudioStream(wRegion,poolid,s3bucketName+audioPath)

    this.region = "ap-south-1"; //s3 region
    this.IdentityPoolId = 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c'; //identity pool id
    this.bucketName = audioStoreWithBucket; //audio file store
    this.s3; //variable defination for s3
    this.dateinfo = new Date();
    this.timestampData = this.dateinfo.getTime(); //timestamp used for file uniqueness
    this.etag = []; // etag is used to save the parts of the single upload file
    this.recordedChunks = []; //empty Array
    this.booleanStop = false; // this is for final multipart complete
    this.incr = 0; // multipart requires incremetal so that they can merge all parts by ascending order
    this.filename = this.timestampData.toString() + ".webm"; //unique filename
    this.uploadId = ""; // upload id is required in multipart
    this.recorder; //initializing recorder variable
    this.player;
    //To use microphone it shud be {audio: true}
    this.audioConstraints = {
      //  audio: true,
        video: true
    };

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


  getSlotDetails(userId){   
    spikeViewApiService('getTimeSlotByUser',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response);
        let slotVideoData = response.data.result[0];
        let videoLinkInterviewer= slotVideoData.videoChatLinkInterviewer;
        let videoLinkUser= slotVideoData.videoChatLinkUser;
    //     let bookedSlotData=[];
    //     bookedSlotData = response.data.result;
      this.setState({videoLinkInterviewer,videoLinkUser});
      }
     
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentWillReceiveProps(res) {
  
  }

  componentDidMount() {

     if(!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    const script = document.createElement("script");

    script.src = "https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js";
    script.async = true;

    document.body.appendChild(script)
    if (this.props.student.achievementData) {
      console.log(this.props.student.achievementData);
    }

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



  render() {
    const videoConstraints = {
        facingMode: "user"
      };
    return (
        <div className="wrapper">
        <Header {...this.props} />     
          <div className="main-panel">   
        <div>
                  <VideoPlayer
                    controls={true}
                    src={this.state.videoLinkInterviewer}
                    poster={this.state.video.poster}
                    width="720"
                    height="420"
                    onReady={this.onPlayerReady.bind(this)}
                    onPlay={this.onVideoPlay.bind(this)}
                    onPause={this.onVideoPause.bind(this)}
                    onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                    onSeeking={this.onVideoSeeking.bind(this)}
                    onSeeked={this.onVideoSeeked.bind(this)}
                    onEnd={this.onVideoEnd.bind(this)}
                />  

                  <VideoPlayer
                    controls={true}
                    src={this.state.videoChatLinkUser}
                    poster={this.state.video.poster}
                    width="720"
                    height="420"
                    onReady={this.onPlayerReady.bind(this)}
                    onPlay={this.onVideoPlay.bind(this)}
                    onPause={this.onVideoPause.bind(this)}
                    onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                    onSeeking={this.onVideoSeeking.bind(this)}
                    onSeeked={this.onVideoSeeked.bind(this)}
                    onEnd={this.onVideoEnd.bind(this)}
                />  
            
            </div>
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
