import React, { Component } from 'react';
import Header from './header/header';
import {
  Button,
  Media,
  Row,
  Col,
  FormControl,
  Container,
  Form,
  FormGroup,
  ControlLabel,
  Radio,

  InputGroup
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { captureUserMedia } from './AppUtils';
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import { decrypt } from '../common/commonFunctions';
//import Webcam from './Webcam.react';
import Webcam from 'react-webcam';
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
  //nextArrow: <SampleNextArrow props={this.props} />,
  //prevArrow: <SamplePrevArrow props={this.props} />,
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
    var poolid = '';
    var s3bucketName = 'ankurself';
    var audioPath = '/audio-files';
    var s3bucketName = 'ankurself';
    var audioPath = '/audio-files';
    var audioStoreWithBucket = s3bucketName + audioPath;
    //AudioStream = new AudioStream(wRegion,poolid,s3bucketName+audioPath)

    this.region = 'ap-south-1'; //s3 region
    this.IdentityPoolId = ''; //identity pool id
    this.bucketName = audioStoreWithBucket; //audio file store
    this.s3 = null; //variable defination for s3
    this.dateinfo = new Date();
    this.timestampData = this.dateinfo.getTime(); //timestamp used for file uniqueness
    this.etag = []; // etag is used to save the parts of the single upload file
    this.recordedChunks = []; //empty Array
    this.booleanStop = false; // this is for final multipart complete
    this.incr = 0; // multipart requires incremetal so that they can merge all parts by ascending order
    this.filename = this.timestampData.toString() + '.webm'; //unique filename
    this.uploadId = ''; // upload id is required in multipart
    this.recorder = null; //initializing recorder variable
    this.player = null;
    //To use microphone it shud be {audio: true}
    this.audioConstraints = {
      //  audio: true,
      video: true
    };
  }

  componentWillMount() {
    this.getPreSignedURL();
  }

  componentDidMount() {
    let user = this.props.user.userId;
    console.log(user);
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

  audioStreamInitialize(result) {
    var self = this;
    AWS.config.update({
      region: decrypt(result.region),
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: decrypt(result.IdentityPoolId),
        RoleArn: decrypt(result.RoleArn),
        AccountId: decrypt(result.AccountId) // your AWS account ID
      })
    });

    AWS.config.credentials.get(function(err) {
      if (err) console.log(err);
      else console.log(AWS.config.credentials);
    });
    AWS = self.s3 = new AWS.S3({
      logger: console,
      apiVersion: decrypt(result.apiVersion),
      params: { Bucket: decrypt(result.bucket) }
    });

    navigator.mediaDevices
      .getUserMedia(self.audioConstraints)
      .then(function(stream) {
        self.recorder = new MediaRecorder(stream);

        self.recorder.addEventListener('dataavailable', function(e) {
          var normalArr = [];

          self.recordedChunks.push(e.data);
          normalArr.push(e.data);
          var blob = new Blob(normalArr, {
            type: 'video/webm'
          });

          if (self.recordedChunks.length == 1) {
            console.log(blob.size);

            self.startMultiUpload(blob, self.filename);
          } else {
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
    self.recorder.start(60000);
    console.log('sdfasdf');
    this.setState({ showVideo: true });
    setTimeout(function() {
      self.stopRecording();
    }, 60000);
  }

  stopRecording(id) {
    var self = this;
    self.recorder.stop();
    self.booleanStop = true;
    self.disableAllButton();
    this.setState({ showVideo: false });
  }

  pauseRecording(id) {
    var self = this;
    self.recorder.pause();
  }

  resumeRecording(id) {
    var self = this;
    self.recorder.resume();
  }

  getPreSignedURL(videoLink) {
    theRapidHireApiService('getPreSignedURL')
      .then(response => {
        console.log(response);
        if (response.data.status === 'SUCCESS') {
          console.log('audioStreamInitialize -- ');
          this.audioStreamInitialize(response.data.result);
        }
      })
      .catch(err => {
        console.log(err);
      });
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
        console.log(data.Location);
        self.saveVideoURL(data.Location);
        // initialize variable back to normal
        self.etag = [];
        self.recordedChunks = [];
        self.uploadId = '';
        self.booleanStop = false;
        self.disableAllButton();
        //   self.removeLoader();
        console.log('we have successfully saved the questionaire..');
      }
    });
  }

  saveVideoURL(videoLink) {
    let data = {
      userId: this.props.user.userId,
      videoLink
    };

    theRapidHireApiService('addVideo', data)
      .then(response => {
        if (response.data.statusCode === 200) {
          let userData = this.state.userData;
          userData = response.data.resourceData[0];
          console.log(response.data.resourceData[0]);
          this.setState({ userData: userData });
        }
      })
      .catch(err => {
        console.log(err);
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
      <div className="wrapper">
        <Header {...this.props} />


        


        <div className="main-panel mt-4">
          <div className="w3-content main-panel1">
          <div class="container">
            <div className="row">
              <div className="col-md-6">
                <div className="video-info-btn">
                <button type="button" class="btn btn-primary"><i className="fa fa-chevron-left mr-2" aria-hidden="true"></i>Back</button>
                <button onClick={this.startRecording.bind(this)} className="no-bold no-round btn btn-primary no-bold no-round ml-3">
                        <i className="fa fa-video-camera mr-2" aria-hidden="true"></i>Start Record 
                </button>
                <button type="button" class="btn btn-danger ml-3">  <i className="fa fa-video-camera mr-2" aria-hidden="true"></i>Stop Record</button>
                </div>
                
              </div>
              <div className="panel-group clearfix" id="accordion">
                        
                        {this.state.uploading ? <div>Uploading...</div> : null}

                        {this.state.showVideo ? (
                          <Webcam videoConstraints={videoConstraints} />
                        ) : null}

                        {/* <video id='video' autoplay muted src={this.state.videosrc}/> */}
                        {/* <button type="button" class="btn kc record" id="record_q1" disabled="disabled" onClick={this.startRecording.bind(this)}>Record</button>
           <button type="button" class="btn kc pause" id="pause_q1" disabled="disabled" onClick={this.pauseRecording.bind(this.id)}>Pause</button>
           <button type="button" class="btn kc resume hide" id="resume_q1" disabled="disabled" onclick={this.resumeRecording.bind(this.id)}>Resume</button>
           <button type="button" class="btn kc stop" id="stop_q1" disabled="disabled" onclick={this.stopRecording.bind(this.id)}>Stop</button> */}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="record-video"> 
                                    <video className="video-fluid z-depth-1" autoplay loop controls muted>
                                    <source src="https://mdbootstrap.com/img/video/Sail-Away.mp4" type="video/mp4" />
                                  </video>
                          </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="answer-video"> 
                      <div className="card">
                    <div className="card_head">
                      <h4>Interview Questionsn</h4>
                    </div>
                    <div className="card_body pt-1 quction">
                      <div className="">

                        <div className="multipal-quction">
                        <div className="quction-select">
                       
                     
                              <FormGroup> 
                                  <Radio
                                    name="currentCompany"
                                    className="radio_primary"
                                    
                                  >
                                  
                                    <div className="check" />
                                    Submit
                                  </Radio>{' '}
                                
                           
                            
                                 </FormGroup>

                           <button type="button" class="closeName" data-dismiss="modal">&times;</button>
                       </div>
                      <strong className="mb-2"> Q: 1 What is the Difference between JDK and JRE?</strong><br></br>
                      
                      

                     
                        <span className="bg-warnin btn-behance"> <strong>Answer: </strong> When asked typical Java Interview Questions most startup Java developers get confused with JDK and JRE. And eventually, they settle for ‘anything would do man, as long as my program runs!!’ Not quite right if you aspire to make a living and career out of Programming.
                        The “JDK” is the Java Development Kit. I.e., the JDK is bundle of software that you can use to develop Java based software.</span>
                       </div>
                       <div className="multipal-quction">
                        <div className="quction-select">
                       
                     
                              <FormGroup> 
                                  <Radio
                                    name="currentCompany"
                                    className="radio_primary"  
                                  >
                                    <div className="check" />
                                    Submit
                                  </Radio>{' '}
                                 </FormGroup>

                           <button type="button" class="closeName" data-dismiss="modal">&times;</button>
                       </div>
                      <strong className="mb-2"> Q: 1 What is the Difference between JDK and JRE?</strong><br></br>
                      
                      

                     
                        <span className="bg-warnin btn-behance"> <strong>Answer: </strong> When asked typical Java Interview Questions most startup Java developers get confused with JDK and JRE. And eventually, they settle for ‘anything would do man, as long as my program runs!!’ Not quite right if you aspire to make a living and career out of Programming.
                        The “JDK” is the Java Development Kit. I.e., the JDK is bundle of software that you can use to develop Java based software.</span>
                       </div>

                      </div>
                      
                      
                    </div>
                    <div className="card_footer"> 
                        <a className="btn btn-danger"> Delete Quction </a>
                    </div>
                  </div>
                        </div>
                      </div>
    
            </div>
          </div>
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
)(Video);
