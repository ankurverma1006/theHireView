import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import socket from './socket';
import PeerConnection from './PeerConnection';
import MainWindow from './MainWindow';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import { captureUserMedia, S3Upload } from './AppUtils';
import {RecordRTC,MultiStreamRecorder} from 'recordrtc';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import MultiStreamsMixer from 'multistreamsmixer';
import $ from 'jquery'; 
import Header from '../header/header';
import theRapidHireApiService from '../../common/core/api/apiService';
//import {MediaStreamRecorder} from '/MediaStreamRecorder.js';
//import MediaStreamRecorder from '../../../node_modules/msr/MediaStreamRecorder.js';
const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);
                       
                        //loadScript('https://sdk.amazonaws.com/js/aws-sdk-2.2.32.min.js')
                      
var AWS = require('aws-sdk');
//var multiStreamRecorder;
const config = {
  bucketName: 'ankurself',
  dirName: 'photos', /* optional */
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
}

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
      recordVideo: null     
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
    this.multiStreamRecorder;
    this.player;
    this.localSource;
    //To use microphone it shud be {audio: true}
    this.audioConstraints = {
        audio: true,
        video: true
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.startCallByInterviewer = this.startCallInterviewer.bind(this);
    
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
    this.requestUserMedia = this.requestUserMedia.bind(this);
  }

  componentDidMount() {
    var script = document.createElement("script");

    script.src = "../dist/js/app.min.js";
    script.async = true;

    document.body.appendChild(script);

 
    if(!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }   
    
    console.log(this.props.location.state);

    this.setState({slotId: this.props.location.state.slotId});


    socket
      .on('init', data => this.setState({ clientId: this.props.location.state.videoKeySelf })) // to another user's id
      .on('request', data => {
        console.log(data);
       this.setState({ callModal: 'active', callFrom: data.from })
      })
      .on('call', (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on('end', this.endCall.bind(this, false))
      .emit('init',this.props.location.state.videoKeySelf);    // self id kept
    }

    componentWillMount(){
      this.requestUserMedia();
      this.audioStreamInitialize();
    }
  
    requestUserMedia() {      
      console.log('requestUserMedia')
      captureUserMedia((stream) => {
        this.setState({ localSrc: stream});
        this.setState({ peerSrc : stream});
        console.log('setting state', this.state)
      });
    }

    audioStreamInitialize() {
      /*
          Creates a new credentials object, which will allow us to communicate with the aws services.
      */
      var self = this;
      AWS.config.update({
           region: "ap-south-1",
               credentials: new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: 'ap-south-1:5075a328-2598-4e55-ba57-d4b60ed9548c',
                  RoleArn: 'arn:aws:iam::923146643705:role/Cognito_TestPoolUnauth_Role',
                  AccountId: '923146643705' // your AWS account ID
  
               })
          });
  
              AWS.config.credentials.get(function (err) {
      if (err) console.log(err);
      else console.log(AWS.config.credentials);
  });
      
      self.s3 = new AWS.S3({logger:console,
  //         AWSAccessKeyId=AKIAJRQYW4X2EL2WE6UQ
  // AWSSecretKey=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
       apiVersion: '2006-03-01',
          params: {Bucket: 'ankurself'}
  
  
  })
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
  }

  startRecording(id) {
    var self = this; 
    
    this.recorder.start(50000);
    console.log('recprdomg');
    this.setState({showVideo:true});
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
    this.setState({showVideo:false});
}

pauseRecording(id) {
    var self = this;
    self.recorder.pause();
   $("#pause_q1").addClass("hide");
    $("#resume_q1").removeClass("hide");
}
 

resumeRecording(id) {
    var self = this;
    self.recorder.resume();
   $("#resume_q1").addClass("hide");
    $("#pause_q1").removeClass("hide");
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
            self.uploadId = data.UploadId
            self.incr = 1;
            self.continueMultiUpload(audioBlob, self.incr, self.uploadId, self.filename, self.bucketName);
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
            console.log(err, err.stack)
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
        Bucket:'ankurself', // required
        Key: self.filename, // required
        UploadId: self.uploadId, // required
        MultipartUpload: {
            Parts: outputTag
        }
    };

    self.s3.completeMultipartUpload(params, function(err, data) {
        if (err) {
            console.log(err, err.stack)
        } // an error occurred
        else {
            self.saveVideoURL(data.Location);
            // initialize variable back to normal
            self.etag = [], self.recordedChunks = [];
            self.uploadId = "";
            self.booleanStop = false;
          //  self.disableAllButton();
         //   self.removeLoader();
            alert("we have successfully saved the questionaire..");
        }
    });
}

saveVideoURL(videoLink){
  let data={
        slotId: this.state.slotId ,
        userId: this.props.user.userId,
        videoChatLink: videoLink
  };

  theRapidHireApiService('saveChatLink',data)
  .then(response => {     
    if (response.data.status === 'Success') {
      
    }
  })
  .catch(err => {
    console.log(err);
  });
}

startCallInterviewer(){
    console.log('cllaldjflsadjf');
    this.multiStreamRecorder.record();
}

  startCall(isCaller, friendID, config) {
    this.config = config;let self=this;
// try array format to record parallely ---    
   let local,remote;
 
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

this.pc = new PeerConnection(this.props.location.state.videoKeyClient)
        .on('localStream', (src) => {
          const newState = { callWindow: 'active', localSrc: src }; 
          this.localSource =src;

          if (!isCaller) newState.callModal = '';        
          this.setState(newState);   
             
        })
        .on('peerStream', src =>{   
            //  var internalRecorder = this.multiStreamRecorder.getInternalRecorder();
            //  console.log(internalRecorder);
            //  if(internalRecorder instanceof RecordRTC.MultiStreamRecorder) {
            //      console.log('teak mafljsdfa');
            //      internalRecorder.addStreams([src]);
            //     // internalRecorder.resetVideoStreams([screenStream]);
            //  }
            
          //   this.multiStreamRecorder.addStreams(src);
             
console.log(this.localSource);

             this.multiStreamRecorder = new MultiStreamRecorder([this.localSource,src], {
                // audio, video, canvas, gif
               type: 'video',   
               mimeType: 'video/webm', 
             
            //   recorderType: MultiStreamRecorder,
           
               // disable logs
               disableLogs: true,
           
               // get intervals based blobs
               // value in milliseconds
               timeSlice: 180000,
           
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
             var blob = new Blob(normalArr, {
                 type: 'video/webm'
             });                   
             let size = self.bytesToSize(e.size);
             console.log('size ',size);
            console.log('recordedChunks -- ',self.recordedChunks);
            
             if (self.recordedChunks.length == 1) {
                      console.log(blob.size);
                      console.log('startMultiUpload -- ',);
       
                 self.startMultiUpload(e, self.filename)
             } else {
                 /*
                     self.incr is basically a part number.
                     Part number of part being uploaded. This is a positive integer between 1 and 10,000.
                 */
                console.log('continueMultiUpload -- ',);
       
                 self.incr = self.incr + 1
                 self.continueMultiUpload(e, self.incr, self.uploadId, self.filename, self.bucketName);
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

















          this.setState({ peerSrc: src });        
        })
        .start(isCaller, config);






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
  if(this.props.user.roleId == 2)
    this.multiStreamRecorder.stop();
    if (_.isFunction(this.pc.stop)) this.pc.stop(isStarter);
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: '',
      localSrc: null,
      peerSrc: null
    });

  
   // this.stopRecording(1);
   // this.state.recordVideo.stopRecording();
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
    const { clientId, callFrom, callModal, callWindow, localSrc, peerSrc } = this.state;
    return (
      <div>
        <Header {...this.props} />      
        <MainWindow
          clientId={clientId}
          startCall={this.startCallHandler}
        />

        <CallWindow
          status={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={this.config}
          mediaDevice={this.pc.mediaDevice}
          endCall={this.endCallHandler}
          user={this.props.user}
          startCallInterviewer={this.startCallByInterviewer}
        />
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
