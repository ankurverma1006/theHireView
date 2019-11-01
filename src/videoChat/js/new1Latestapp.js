import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import socket from './socket';
import PeerConnection from './PeerConnection';
import MainWindow from './MainWindow';
import CallWindow from './CallWindow';
import classnames from 'classnames';
import CallModal from './CallModal';
//import { captureUserMedia, S3Upload } from './AppUtils';
import RecordRTC from 'recordrtc';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
//import MultiStreamsMixer from 'multistreamsmixer';
import $ from 'jquery';
import Header from '../header/header';
import theRapidHireApiService from '../../common/core/api/apiService';
//import {MediaStreamRecorder} from '/MediaStreamRecorder.js';
//import MediaStreamRecorder from '../../../node_modules/msr/MediaStreamRecorder.js';
const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

//loadScript('https://sdk.amazonaws.com/js/aws-sdk-2.2.32.min.js')

var AWS = require('aws-sdk');
//var multiStreamRecorder;
const config = {
  bucketName: 'ankurself',
  dirName: 'photos' /* optional */,
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '',
      callWindow: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null,
      recordVideo: null,
      skillTag: []
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
    this.s3 = ''; //variable defination for s3
    this.dateinfo = new Date();
    this.timestampData = this.dateinfo.getTime(); //timestamp used for file uniqueness
    this.etag = []; // etag is used to save the parts of the single upload file
    this.recordedChunks = []; //empty Array
    this.booleanStop = false; // this is for final multipart complete
    this.incr = 0; // multipart requires incremetal so that they can merge all parts by ascending order
    this.filename = this.timestampData.toString() + '.webm'; //unique filename
    this.uploadId = ''; // upload id is required in multipart
    this.recorder = ''; //initializing recorder variable
    this.multiStreamRecorder = '';
    this.player = '';
    this.localSource = '';
    this.dateStarted = '';
    //To use microphone it shud be {audio: true}
    this.audioConstraints = {
      video: true,
      audio: {
        mandatory: {
          echoCancellation: false,
          googAutoGainControl: false,
          googNoiseSuppression: false,
          googHighpassFilter: false
        },
        optional: [
          {
            googAudioMirroring: false
          }
        ]
      },
      overlay: {
        image: HTMLImageElement,
        src:
          'data:image/png;base64,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',

        text: 'string',
        fontSize: 'pixels',
        fontFamily: 'Arial',
        color: 'foreground-color-for-text',
        backgroundColor: 'for-text',
        pageX: 'position-x-of-the-text/logo',
        pageY: 'position-y-of-the-text/logo',
        etc: ''
      }
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.startCallByInterviewer = this.startCallInterviewer.bind(this);
    this.saveSkillTag = this.saveSkillTag.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
    this.requestUserMedia = this.requestUserMedia.bind(this);
  }

  componentDidMount() {
    var script = document.createElement('script');

    script.src = '../dist/js/app.min.js';
    script.async = true;

    document.body.appendChild(script);

    if (!hasGetUserMedia) {
      alert(
        'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
      );
      return;
    }

    console.log(this.props.location.state);

    this.setState({ slotId: this.props.location.state.slotId });

    socket
      .on('init', data =>
        this.setState({ clientId: this.props.location.state.videoKeySelf })
      ) // to another user's id
      .on('request', data => {
        console.log(data);
        this.setState({ callModal: 'active', callFrom: data.from });
      })
      .on('call', data => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on('end', this.endCall.bind(this, false))
      .emit('init', this.props.location.state.videoKeySelf); // self id kept
  }

  componentWillMount() {
    // this.requestUserMedia();
    this.audioStreamInitialize();
  }

  // componentDidUpdate() {
  //   this.setMediaStream();
  // }

  // setMediaStream() {
  //   if (this.peerVideo && peerSrc) this.peerVideo.srcObject = peerSrc;
  //   if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc;
  // }

  requestUserMedia() {
    console.log('requestUserMedia');
    //   captureUserMedia((stream) => {
    //     this.setState({ localSrc: stream});
    //     this.setState({ peerSrc : stream});
    //     console.log('setting state', this.state)
    //   });
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
    //   navigator.mediaDevices.getUserMedia(self.audioConstraints)
    //       .then(function(stream) {

    //           /*
    //               once we accept the prompt for the audio stream from user's mic we enable the record button.
    //           */
    //         //  $("#record_q1").removeAttr("disabled");
    //           /*
    //               Creates a new MediaRecorder object, given a MediaStream to record.
    //           */
    //           self.recorder = new MediaRecorder(stream);
    //                           self.setState({videosrc:stream});

    //           self.recorder.addEventListener('dataavailable', function(e) {
    //               var normalArr = [];
    //               /*
    //                   Here we push the stream data to an array for future use.
    //               */
    //               self.recordedChunks.push(e.data);
    //               normalArr.push(e.data);

    //               /*
    //                   here we create a blob from the stream data that we have received.
    //               */
    //               var blob = new Blob(normalArr, {
    //                   type: 'video/webm'
    //               });

    //               /*
    //                   if the length of recordedChunks is 1 then it means its the 1st part of our data.
    //                   So we createMultipartUpload which will return an upload id.
    //                   Upload id is used to upload the other parts of the stream
    //                   else.
    //                   It Uploads a part in a multipart upload.
    //               */
    //               if (self.recordedChunks.length == 1) {
    //                        console.log(blob.size);

    //                   self.startMultiUpload(blob, self.filename)
    //               } else {
    //                   /*
    //                       self.incr is basically a part number.
    //                       Part number of part being uploaded. This is a positive integer between 1 and 10,000.
    //                   */
    //                   self.incr = self.incr + 1
    //                   self.continueMultiUpload(blob, self.incr, self.uploadId, self.filename, self.bucketName);
    //               }
    //           })
    //       });

    //  this.startRecording(isCaller);
    //    navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then(async function(stream) {

    //     self.state.recordVideo = RecordRTC(stream, {

    //     // disable logs
    //     disableLogs: true,

    //     // disable logs
    //     disableLogs: true,

    //     // get intervals based blobs
    //     // value in milliseconds
    //     timeSlice: 150000,
    //     ondataavailable: function(e) {
    //     console.log('ondataavailable -- ');

    //       var normalArr = [];
    //       /*
    //           Here we push the stream data to an array for future use.
    //       */
    //       self.recordedChunks.push(e.data);
    //       normalArr.push(e.data);

    //       /*
    //           here we create a blob from the stream data that we have received.
    //       */
    //       var blob = new Blob(normalArr, {
    //           type: 'video/webm'
    //       });
    //   //    let size = bytesToSize(recorder.getBlob().size);

    //       if (self.recordedChunks.length == 1) {
    //                console.log(blob.size);

    //           self.startMultiUpload(blob, self.filename)
    //       } else {
    //           /*
    //               self.incr is basically a part number.
    //               Part number of part being uploaded. This is a positive integer between 1 and 10,000.
    //           */
    //           self.incr = self.incr + 1
    //           self.continueMultiUpload(blob, self.incr, self.uploadId, self.filename, self.bucketName);
    //       }}
    //   });

    //});

    this.startCall('', '', '');
  }

  startRecording(id) {
    var self = this;

    this.recorder.start(50000);
    console.log('recprdomg');
    this.setState({ showVideo: true });
  }

  stopRecording(id) {
    var self = this;
    self.recorder.stop();
    self.booleanStop = true;
    //disable self

    //  self.disableAllButton()
    //  $("#stop_q1").attr("disabled", "disabled");
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
        self.saveVideoURL(data.Location);
        // initialize variable back to normal
        self.etag = [];
        self.recordedChunks = [];
        self.uploadId = '';
        self.booleanStop = false;
        //  self.disableAllButton();
        //   self.removeLoader();
        alert('we have successfully saved the questionaire..');
      }
    });
  }

  saveVideoURL(videoLink) {
    let data = {
      slotId: this.state.slotId,
      userId: this.props.user.userId,
      videoChatLink: videoLink,
      videoSkillTag: this.state.skillTag
    };
    //facebook app secret --   appID --1928279157274431
    //8cfe05bdd0ecbdfa3d51460f2d9b21ae
    theRapidHireApiService('saveChatLink', data)
      .then(response => {
        if (response.data.status === 'Success') {
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  saveSkillTag(taskName) {
    let skillTag = this.state.skillTag;

    console.log('taskNametaskNametaskName ', taskName);
    console.log(
      this.calculateTimeDuration(new Date().getTime() - this.dateStarted)
    );
    skillTag.push({
      skill: taskName,
      time: this.calculateTimeDuration(new Date().getTime() - this.dateStarted)
    });
  }

  calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - hr * 3600) / 60);
    var sec = Math.floor(secs - hr * 3600 - min * 60);
    if (min < 10) {
      min = '0' + min;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    if (hr <= 0) {
      return min + ':' + sec;
    }
    return hr + ':' + min + ':' + sec;
  }

  startCallInterviewer() {
    console.log('startCallInterviewer');
    this.multiStreamRecorder.startRecording();
    this.dateStarted = new Date().getTime();
  }

  startCall(isCaller, friendID, config) {
    config = { audio: true, video: true };
    isCaller = false;
    this.config = config;
    let self = this;
    // try array format to record parallely ---
    let local, remote;

    //    if(this.props.user.roleId == 2){
    //     this.pc = new PeerConnection(this.props.location.state.videoKeyClient)
    //       .on('localStream', (src) => {
    //         const newState = { callWindow: 'active', localSrc: src };
    //         if (!isCaller) newState.callModal = '';

    //         this.multiStreamRecorder = new RecordRTC([src]);

    //         this.multiStreamRecorder.stream = src;
    //     //    multiStreamRecorder.mimeType = 'audio/webm';
    //     this.multiStreamRecorder.mimeType = 'video/webm';
    //     this.multiStreamRecorder.previewStream = function(stream) {
    //       //    video.srcObject = stream;
    //         //  video.play();
    //       };
    //       this.multiStreamRecorder.ondataavailable = function(e) {
    //          //   appendLink(blob);

    //          var normalArr = [];
    //          /*
    //              Here we push the stream data to an array for future use.
    //          */
    //          self.recordedChunks.push(e);
    //          normalArr.push(e);

    //                 // //   appendLink(blob);
    //                 // let MB = 5 * 1024 * 1024
    //                 // let size = self.bytesToSize(e.size);
    //                 // console.log(e.size >= MB);

    //                 // /*
    //                 //     Here we push the stream data to an array for future use.
    //                 // */
    //                 // vardata.push(e);
    //                 // // normalArr.push(e);
    //                 // let checkSize=0;
    //                 // vardata.forEach(function(data){
    //                 //     checkSize = checkSize + data.size;
    //                 // })
    //                 // console.log('checkSize -- ',checkSize);
    //                 // if(checkSize <= MB )
    //                 // return false;
    //                 // self.recordedChunks.push = [];

    //          /*
    //              here we create a blob from the stream data that we have received.
    //          */
    //          var blob = new Blob(normalArr, {
    //              type: 'video/webm'
    //          });
    //          let size = self.bytesToSize(e.size);
    //          console.log('size ',size);
    //         console.log('recordedChunks -- ',self.recordedChunks);

    //          if (self.recordedChunks.length == 1) {
    //                   console.log(blob.size);
    //                   console.log('startMultiUpload -- ',);

    //              self.startMultiUpload(e, self.filename)
    //          } else {
    //              /*
    //                  self.incr is basically a part number.
    //                  Part number of part being uploaded. This is a positive integer between 1 and 10,000.
    //              */
    //             console.log('continueMultiUpload -- ',);

    //              self.incr = self.incr + 1
    //              self.continueMultiUpload(e, self.incr, self.uploadId, self.filename, self.bucketName);
    //          }
    //         };

    //         local= src;
    //         this.setState(newState);

    //       })
    //       .on('peerStream', src =>{
    //         this.multiStreamRecorder.addStream( src );
    //         this.setState({ peerSrc: src });

    //       })
    //       .start(isCaller, config);
    //     }else{
    //         this.pc = new PeerConnection(this.props.location.state.videoKeyClient)
    //         .on('localStream', (src) => {
    //           const newState = { callWindow: 'active', localSrc: src };
    //           if (!isCaller) newState.callModal = '';
    //           this.setState(newState);
    //         })
    //         .on('peerStream', src =>{
    //           this.setState({ peerSrc: src });
    //         })
    //         .start(isCaller, config);
    //     }

    if (this.props.user.roleId == 2) {
      this.pc = new PeerConnection(this.props.location.state.videoKeyClient)
        .on('localStream', src => {
          const newState = { callWindow: 'active', localSrc: src };
          console.log(src);
          this.localSource = src;

          if (this.localVideo && src) this.localVideo.srcObject = src;

          if (!isCaller) newState.callModal = '';
          this.setState(newState);
        })
        .on('peerStream', src => {
          this.multiStreamRecorder = RecordRTC([this.localSource, src], {
            // audio, video, canvas, gif
            type: 'video',
            mimeType: 'video/mp4',

            recorderType: RecordRTC.MultiStreamRecorder,

            // disable logs
            disableLogs: true,

            // get intervals based blobs
            // value in milliseconds
            timeSlice: 180000,

            checkForInactiveTracks: false,
            // requires timeSlice above
            // returns blob via callback function
            ondataavailable: function(e) {
              var normalArr = [];
              /*
                 Here we push the stream data to an array for future use.
             */
              self.recordedChunks.push(e);
              normalArr.push(e);

              // //   appendLink(blob);
              // let MB = 5 * 1024 * 1024
              // let size = self.bytesToSize(e.size);
              // console.log(e.size >= MB);

              // /*
              //     Here we push the stream data to an array for future use.
              // */
              // vardata.push(e);
              // // normalArr.push(e);
              // let checkSize=0;
              // vardata.forEach(function(data){
              //     checkSize = checkSize + data.size;
              // })
              // console.log('checkSize -- ',checkSize);
              // if(checkSize <= MB )
              // return false;
              // self.recordedChunks.push = [];

              /*
                 here we create a blob from the stream data that we have received.
             */
              //  var blob = new Blob(normalArr, {
              //      type: 'video/webm'
              //  });
              let size = self.bytesToSize(e.size);
              console.log('size ', size);
              console.log('recordedChunks -- ', self.recordedChunks);

              if (self.recordedChunks.length == 1) {
                //     console.log(blob.size);
                console.log('startMultiUpload -- ');

                self.startMultiUpload(e, self.filename);
              } else {
                /*
                     self.incr is basically a part number.
                     Part number of part being uploaded. This is a positive integer between 1 and 10,000.
                 */
                console.log('continueMultiUpload -- ');

                self.incr = self.incr + 1;
                self.continueMultiUpload(
                  e,
                  self.incr,
                  self.uploadId,
                  self.filename,
                  self.bucketName
                );
              }
            },

            // auto stop recording if camera stops
            checkForInactiveTracks: false,

            // requires timeSlice above
            onTimeStamp: function(timestamp) {},

            // both for audio and video tracks
            bitsPerSecond: 128000,

            // if you are recording multiple streams into single file
            // this helps you see what is being recorded
            previewStream: function(stream) {
              console.log(stream);
            },

            // used by MultiStreamRecorder - to access HTMLCanvasElement
            elementClass: 'multi-streams-mixer'
          });

          var arrayOfWebPImages = [];
          arrayOfWebPImages.push({
            duration: 0,
            image:
              'data:image/png;base64,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'
          });
          arrayOfWebPImages.push({
            duration: 1,
            image:
              'data:image/jpeg;base64,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'
          });
          this.multiStreamRecorder.setAdvertisementArray(arrayOfWebPImages);
          if (this.peerVideo && src) this.peerVideo.srcObject = src;
          this.setState({ peerSrc: src });
        })
        .start(isCaller, config);
    } else {
      this.pc = new PeerConnection(this.props.location.state.videoKeyClient)
        .on('localStream', src => {
          const newState = { callWindow: 'active', localSrc: src };
          if (!isCaller) newState.callModal = '';
          if (this.localVideo && src) this.localVideo.srcObject = src;
          this.setState(newState);
        })
        .on('peerStream', src => {
          if (this.peerVideo && src) this.peerVideo.srcObject = src;
          this.setState({ peerSrc: src });
        })
        .start(isCaller, config);
    }
  }

  bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  }

  rejectCall() {
    const { callFrom } = this.state;
    socket.emit('end', { to: callFrom });
    this.setState({ callModal: '' });
  }

  endCall(isStarter) {
    if (this.props.user.roleId == 2) this.multiStreamRecorder.stopRecording();
    if (_.isFunction(this.pc.stop)) this.pc.stop(isStarter);
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: '',
      localSrc: null,
      peerSrc: null
    });

    // this.stopRecording(1);
    //  this.state.recordVideo.stopRecording();
    this.booleanStop = true;
    //     this.state.recordVideo.stopRecording(() => {
    //       let params = {
    //         type: 'video/webm',
    //         data: this.state.recordVideo.blob,
    //         id: Math.floor(Math.random()*90000) + 10000
    //       }

    //  console.log('enter then statement')
    //   //    this.setState({ uploading: true });

    //       S3Upload(params)
    //       .then((success) => {
    //         console.log('enter then statement')
    //         if(success) {
    //           console.log(success)
    //      //     this.setState({ uploadSuccess: true, uploading: false });
    //         }
    //       }, (error) => {
    //         alert(error, 'error occurred. check your aws settings and try again.')
    //       })
    //     });
  }

  render() {
    const {
      clientId,
      callFrom,
      callModal,
      callWindow,
      localSrc,
      peerSrc
    } = this.state;
    return (
      <div className={classnames('call-window', 'active')}>
        <Header {...this.props} />
        {/* <MainWindow
          clientId={clientId}
          startCall={this.startCallHandler}
        /> */}
        <video id="peerVideo" ref={el => (this.peerVideo = el)} autoPlay />
        <video
          id="localVideo"
          ref={el => (this.localVideo = el)}
          autoPlay
          muted
        />

        {/* <CallWindow
          status={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={this.config}
          mediaDevice={this.pc.mediaDevice}
          endCall={this.endCallHandler}
          user={this.props.user}
          startCallInterviewer={this.startCallByInterviewer}
          saveSkillTag={this.saveSkillTag}
        /> */}
        <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(App);
