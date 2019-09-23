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

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
//import DatePicker from 'react-datepicker';
//import DatePicker from '../../../../assets/react-datepicker/es/index';
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



class videoIntroduction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,         
      promptRecommendation: false,    
      userId: '',       
      videoModal:true,
      skillId:''  ,
      video: {
        src: "http://www.example.com/path/to/video.mp4",
        poster: "http://www.example.com/path/to/video_poster.jpg"
    },     
    };

  
  }


  componentDidMount() {  
 
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

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

 
  

  generateSASToken() {
    spikeViewApiService('getSASToken')
      .then(response => {
        if (response.data.status === 'Success') {
          let sasToken = response.data.result.sasToken;
          this.setState({ sasToken });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  validateData = () => {
    let self = this;
    this.props.validate(function(error) {
      let imageObject = {
        media: self.state.mediaImgArray || []
      };

      if (!error) {
        self.setState({ isLoading: true });       
            self.handleSubmit();        
        } else {
          self.handleSubmit();
        }      
    });
  };  

  handleSubmit() {
   
   let rating = this.state.rating;  
  
   let skills = [];     
   this.state.skills.forEach(function(item){
    skills.push(item.label);
   })
 
    let userId = 10;
    let skillId=  this.state.skillId;   

   
    let data = {
      rating,
      userId,
      skills,
      skillId
    };

    let self = this;
   
    if (!this.state.skillId || this.state.skillId === '') {
      spikeViewApiService('addUserSkills', data)
        .then(response => {
          if (response.data.statusCode === 200) {      
            self.setState({ isLoading: false });
            self.closeVideoModal('save');
          } 
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      spikeViewApiService('editUserSkills', data)
        .then(response => {
          if (response.data.statusCode === 200) {        
            self.closeVideoModal('save');
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    }
  }


  closeVideoModal = status => {   
    this.setState({
      skillsModal: false
      
    });   
    this.props.closeVideoComponent();
  };

  render() {  
    const CalendarContainer = ({ children }) => {
      const el = document.getElementById('calendar-portal');
      return <Portal container={el}>{children}</Portal>;
    };

    return (
      <div>
        {/* {this.state.imageSource ? (
          <ImageCropper
            imageSource={this.state.imageSource}
            imageName={this.state.imageName}
            imageType={this.state.imageType}
            aspectRatio={this.state.action === 1 ? 1 / 1 : 16 / 9}
            modalSize={'medium'}
            cropBoxWidth={this.state.action === 1 ? '300' : '700'}
            cropBoxHeight={this.state.action === 1 ? '300' : '700'}
            uploadImageToAzure={this.handleMediaChange.bind(this)}
            labelName={'ADD_MEDIA'}
          />
        ) : null} */}

        <Modal
          bsSize="large"
          show={this.state.videoModal}
          onHide={this.closeVideoModal.bind(this, 'close')}
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
              {/* {!this.state.profileId || this.state.profiletId === ''
                ? 'Add Career Profile'
                : 'Edit Career Profile'} */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>   
            
     


  <VideoPlayer
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
                />  
 














          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              className="no-bold no-round"
              disabled={this.state.isLoading}
              onClick={!this.state.isLoading ? this.validateData : null}
            >
              {this.state.isLoading ? 'In Progress...' : 'Save'}
            </Button>
            <Button
              bsStyle="default"
              className="no-bold no-round"
              onClick={this.closeVideoModal.bind(this, 'close')}              
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          //  bsSize="medium"
          show={this.state.imagesModal}
          onHide={this.closeImageModal}
        >
          <Modal.Header closeButton>
            <Modal.Title className="subtitle text-center">
              Photos Gallery
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>            
          </Modal.Body>
          <Modal.Footer>
            {/* <Button bsStyle="primary no-bold no-round">Save</Button> */}
            <Button bstyle="default no-round" onClick={this.closeImageModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
videoIntroduction = validation(strategy)(videoIntroduction);
export default videoIntroduction;
