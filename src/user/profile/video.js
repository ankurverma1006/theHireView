import React, { Component } from 'react';
import Header from './header/header';
import {
  Button,
  Media,
  Row,
  Col,
  FormControl,
  InputGroup
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { captureUserMedia } from './AppUtils';
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import S3FileUpload from 'react-s3';
//import Webcam from './Webcam.react';
//import Webcam from "react-webcam";
//import  "https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js";
//import * as AWS from "https://sdk.amazonaws.com/js/aws-sdk-2.2.32.min.js";
//import Summary from './summary/addSummary';

import VideoPlayer from 'react-video-js-player';
//import CompetencyRecommendations from '../profile/competency/recommendations/competencyWiseRecommendations';
import ImageCropper from './../common/cropper/imageCropper';
import DownloadLink from 'react-download-link';
//import Img from '../../common/cropper/img';
import {
  showErrorToast,
  uploadToAzure,
  limitCharacter,
  SampleNextArrow,
  SamplePrevArrow,
  getThumbImage
} from './../common/commonFunctions';
import theRapidHireApiService from './../common/core/api/apiService';
import CONSTANTS from './../common/core/config/appConfig';

//import videojs from 'video.js'

import {
  actionGetStudentPersonalInfo,
  actionGetAllCompetency,
  actionGetAchievementsByUser,
  actionGetRecommendationsByUser,
  actionUpdateUserInfo,
  actionGetAchievementsData
} from './../common/core/redux/actions';
import $ from 'jquery';
import SpiderChart from './../common/spiderChart/spiderChart';
var AWS = require('aws-sdk');

//loadScript('https://sdk.amazonaws.com/js/aws-sdk-2.2.32.min.js')

const config = {
  bucketName: 'ankurself',
  dirName: 'photos' /* optional */,
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
};

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

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

class Video extends Component {
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
      showVideo: false
    };
    var wRegion = 'ap-south-1';
    var poolid = 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c';
    var s3bucketName = 'ankurself';
    var audioPath = '/audio-files';
    var s3bucketName = 'ankurself';
    var audioPath = '/audio-files';
    var audioStoreWithBucket = s3bucketName + audioPath;
    //AudioStream = new AudioStream(wRegion,poolid,s3bucketName+audioPath)

    this.region = 'ap-south-1'; //s3 region
    this.IdentityPoolId = 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c'; //identity pool id
    this.bucketName = audioStoreWithBucket; //audio file store
    this.s3; //variable defination for s3
    this.dateinfo = new Date();
    this.timestampData = this.dateinfo.getTime(); //timestamp used for file uniqueness
    this.etag = []; // etag is used to save the parts of the single upload file
    this.recordedChunks = []; //empty Array
    this.booleanStop = false; // this is for final multipart complete
    this.incr = 0; // multipart requires incremetal so that they can merge all parts by ascending order
    this.filename = this.timestampData.toString() + '.webm'; //unique filename
    this.uploadId = ''; // upload id is required in multipart
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
    this.audioStreamInitialize();
  }

  componentWillReceiveProps(res) {
    // this.setProfileData(res.user);
    // this.setAchievementData(res.student.achievementData);
    // this.renderRecommendationsByUserId();
  }

  componentDidMount() {
    if (!hasGetUserMedia) {
      alert(
        'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
      );
      return;
    }
    const script = document.createElement('script');

    script.src =
      'https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js';
    script.async = true;

    document.body.appendChild(script);
    if (this.props.student.achievementData) {
      console.log(this.props.student.achievementData);
    }
  }

  onPlayerReady(player) {
    console.log('Player is ready: ', player);
    this.player = player;
  }

  onVideoPlay(duration) {
    console.log('Video played at: ', duration);
  }

  onVideoPause(duration) {
    console.log('Video paused at: ', duration);
  }

  onVideoTimeUpdate(duration) {
    console.log('Time updated: ', duration);
  }

  onVideoSeeking(duration) {
    console.log('Video seeking: ', duration);
  }

  onVideoSeeked(from, to) {
    console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd() {
    console.log('Video ended');
  }

  audioStreamInitialize() {
    /*
        Creates a new credentials object, which will allow us to communicate with the aws services.
    */
    var self = this;
    AWS.config.update({
      region: 'ap-south-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c',
        RoleArn: 'arn:aws:iam::923146643705:role/Cognito_TestPoolUnauth_Role',
        AccountId: '923146643705' // your AWS account ID
      })
    });

    AWS.config.credentials.get(function(err) {
      if (err) console.log(err);
      else console.log(AWS.config.credentials);
    });
    /*
        Constructs a service object.
    */
    // self.s3 = new AWS.S3({apiVersion: '2006-03-01',
    //                     params: {Bucket: 'ankurself'},

    // }
    // );
    self.s3 = new AWS.S3({
      logger: console,
      //         AWSAccessKeyId=AKIAJRQYW4X2EL2WE6UQ
      // AWSSecretKey=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
      apiVersion: '2006-03-01',
      params: { Bucket: 'ankurself' }
    });
    /*
        Feature detecting is a simple check for the existence of "navigator.mediaDevices.getUserMedia"
        To use the microphone. we need to request permission.
        The parameter to getUserMedia() is an object specifying the details and requirements for each type of media you want to access.
        To use microphone it shud be {audio: true}
    */
    navigator.mediaDevices
      .getUserMedia(self.audioConstraints)
      .then(function(stream) {
        /*
                once we accept the prompt for the audio stream from user's mic we enable the record button.
            */
        $('#record_q1').removeAttr('disabled');
        /*
                Creates a new MediaRecorder object, given a MediaStream to record.
            */
        self.recorder = new MediaRecorder(stream);
        self.setState({ videosrc: stream });

        /*
                Called to handle the dataavailable event, which is periodically triggered each time timeslice milliseconds of media have been recorded
                (or when the entire media has been recorded, if timeslice wasn't specified).
                The event, of type BlobEvent, contains the recorded media in its data property.
                You can then collect and act upon that recorded media data using this event handler.
            */
        self.recorder.addEventListener('dataavailable', function(e) {
          var normalArr = [];
          /*
                    Here we push the stream data to an array for future use.
                */
          self.recordedChunks.push(e.data);
          normalArr.push(e.data);

          /*
                    here we create a blob from the stream data that we have received.
                */
          var blob = new Blob(normalArr, {
            type: 'video/webm'
          });

          /*
                    if the length of recordedChunks is 1 then it means its the 1st part of our data.
                    So we createMultipartUpload which will return an upload id.
                    Upload id is used to upload the other parts of the stream
                    else.
                    It Uploads a part in a multipart upload.
                */
          if (self.recordedChunks.length == 1) {
            console.log(blob.size);

            self.startMultiUpload(blob, self.filename);
          } else {
            /*
                        self.incr is basically a part number.
                        Part number of part being uploaded. This is a positive integer between 1 and 10,000.
                    */
            self.incr = self.incr + 1;
            self.continueMultiUpload(
              blob,
              self.incr,
              self.uploadId,
              self.filename,
              self.bucketName
            );
          }
        });
      });
  }

  startRecording(id) {
    var self = this;

    // self.enableAllButton();
    //  $("#record_q1").attr("disabled", "disabled");
    /*
        1800000 is the number of milliseconds to record into each Blob.
        If this parameter isn't included, the entire media duration is recorded into a single Blob unless the requestData()
        method is called to obtain the Blob and trigger the creation of a new Blob into which the media continues to be recorded.
    */
    /*
    PLEASE NOTE YOU CAN CHANGE THIS PARAM OF 1800000 but the size should be greater then or equal to 5MB.
    As for multipart upload the minimum breakdown of the file should be 5MB
    */
    //this.recorder.start(1800000);

    this.recorder.start(50000);
    console.log('recprdomg');
    this.setState({ showVideo: true });
  }

  stopRecording(id) {
    var self = this;
    self.recorder.stop();
    /*
        Once the recording is stop we change the flag of self.booleanStop to true.
        which means we have completed the recording and now we can
        Completes a multipart upload by assembling previously uploaded parts.
    */
    self.booleanStop = true;
    //disable self
    self.disableAllButton();
    $('#stop_q1').attr('disabled', 'disabled');
    // add loader
    //  self.setLoader();
    this.setState({ showVideo: false });
  }

  pauseRecording(id) {
    var self = this;
    self.recorder.pause();
    $('#pause_q1').addClass('hide');
    $('#resume_q1').removeClass('hide');
  }

  resumeRecording(id) {
    var self = this;
    self.recorder.resume();
    $('#resume_q1').addClass('hide');
    $('#pause_q1').removeClass('hide');
  }

  startMultiUpload(blob, filename) {
    var self = this;
    var audioBlob = blob;
    var params = {
      Bucket: 'ankurself',
      Key: filename,
      ContentType: 'video/webm',
      ACL: 'public-read'
    };

    // self.s3.getSignedUrl('postObject', params, function (err, url) {
    //       if(err){
    //         console.log(err);
    //       }
    //       console.log(url);
    //          });

    self.s3.createMultipartUpload(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        self.uploadId = data.UploadId;
        self.incr = 1;
        self.continueMultiUpload(
          audioBlob,
          self.incr,
          self.uploadId,
          self.filename,
          self.bucketName
        );
      }
    });
  }

  /*
       Uploads a part in a multipart upload.
       The following code uploads part of a multipart upload.
       it specifies a file name for the part data. The Upload ID is same that is returned by the initiate multipart upload.
   */
  continueMultiUpload(audioBlob, PartNumber, uploadId, key, bucketName) {
    var self = this;

    var params = {
      Body: audioBlob,
      Bucket: 'ankurself',
      Key: key,
      PartNumber: PartNumber,
      UploadId: uploadId
    };
    console.log(params);
    self.s3.uploadPart(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } // an error occurred
      else {
        /*
                Once the part of data is uploaded we get an Entity tag for the uploaded object(ETag).
                which is used later when we complete our multipart upload.
            */
        self.etag.push(data.ETag);
        if (self.booleanStop == true) {
          self.completeMultiUpload();
        }
      }
    });
  }

  /*
       Completes a multipart upload by assembling previously uploaded parts.
   */
  completeMultiUpload() {
    var self = this;
    var outputTag = [];
    /*
        here we are constructing the Etag data in the required format.
    */
    self.etag.forEach((data, index) => {
      const obj = {
        ETag: data,
        PartNumber: ++index
      };
      outputTag.push(obj);
    });

    var params = {
      Bucket: 'ankurself', // required
      Key: self.filename, // required
      UploadId: self.uploadId, // required
      MultipartUpload: {
        Parts: outputTag
      }
    };

    self.s3.completeMultipartUpload(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } // an error occurred
      else {
        // initialize variable back to normal
        (self.etag = []), (self.recordedChunks = []);
        self.uploadId = '';
        self.booleanStop = false;
        self.disableAllButton();
        //   self.removeLoader();
        alert('we have successfully saved the questionaire..');
      }
    });
  }

  disableAllButton() {
    $('#formdata button[type=button]').attr('disabled', 'disabled');
  }

  enableAllButton() {
    $('#formdata button[type=button]').removeAttr('disabled');
  }

  render() {
    const videoConstraints = {
      facingMode: 'user'
    };
    return (
      <div className="innerWrapper">
        <Header {...this.props} />

        <div className="profileBox">
          <div className="banner">
            <div className="loader">
              <img
                src="../../assets/img/svg-loaders/three-dots.svg"
                width="50"
                alt="loader"
                style={
                  this.state.loader2 === true
                    ? { visibility: 'visible' }
                    : { visibility: 'hidden' }
                }
              />
            </div>
            {!this.state.coverImage ? (
              <img className="bannerImg" src="" alt="" />
            ) : (
              <img className="bannerImg" src={this.state.coverImage} alt="" />
            )}

            <div className="container main">
              <div className="profileBox--mainContent">
                <ul className="myProfileInfo--wrapper">
                  <div>
                    <button onClick={this.startRecording.bind(this)}>
                      Start Record
                    </button>
                  </div>
                  <div>
                    <button onClick={this.stopRecording.bind(this)}>
                      stop Record
                    </button>
                  </div>
                  {this.state.uploading ? <div>Uploading...</div> : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            {/* will work when we will show video to user <VideoPlayer
                    controls={true}
                    src="http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4"
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
                />  */}
            {this.state.showVideo ? (
              <Webcam videoConstraints={videoConstraints} />
            ) : null}
          </div>
        </div>
        <div id="formdata" class="btn-section">
          {/* <video id='video' autoplay muted src={this.state.videosrc}/> */}
          <button
            type="button"
            class="btn kc record"
            id="record_q1"
            disabled="disabled"
            onClick={this.startRecording.bind(this)}
          >
            Record
          </button>
          <button
            type="button"
            class="btn kc pause"
            id="pause_q1"
            disabled="disabled"
            onClick={this.pauseRecording.bind(this.id)}
          >
            Pause
          </button>
          <button
            type="button"
            class="btn kc resume hide"
            id="resume_q1"
            disabled="disabled"
            onclick={this.resumeRecording.bind(this.id)}
          >
            Resume
          </button>
          <button
            type="button"
            class="btn kc stop"
            id="stop_q1"
            disabled="disabled"
            onclick={this.stopRecording.bind(this.id)}
          >
            Stop
          </button>
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
)(Video);
