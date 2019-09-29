import React, { Component } from 'react';
import Header from '../header/header';
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
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import S3FileUpload from 'react-s3';

//import Summary from './summary/addSummary';
import AddJobDescription from '../jobDescription/addJobDescription';

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


const config = {
  bucketName: 'ankurself',
  dirName: 'photos', /* optional */
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
}


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

class JobDescription extends Component {
  constructor(props, context) {
    super(props);
    this.state = {      
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
      editTagLine: false
    };
   
  }

  componentWillMount() {
    let user= this.props.otherUser? this.props.otherUser: this.props.user;
    if(user){
      let userId =user.userId;       
      this.setState({userId: userId,user:user,roleId: user.roleId});
    }
    this.getJobDescriptionDetails(user.userId);   
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
    document.body.classList.remove('home');
    document.body.classList.remove('fixedHeader');
  }

  componentWillReceiveProps(res) {
    // this.setProfileData(res.user);
    // this.setAchievementData(res.student.achievementData);
    // this.renderRecommendationsByUserId();
  }

  componentDidMount() {  
    if (this.props.student.achievementData) {
      console.log(this.props.student.achievementData);
    }
  }

  getJobDescriptionDetails(userId){
    spikeViewApiService('getJobDescriptonListById',{userId})
    .then(response => {     
      if (response.data.status === "Success") {
         let jobDescriptionListData= this.state.jobDescriptionListData;
         jobDescriptionListData= response.data.result;
     
         this.setState({jobDescriptionListData: jobDescriptionListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }



  contentEditable = () => {
    window.scrollTo(500, 0);
    //console.log(!this.state.contentEditable);
    this.setState({ contentEditable: !this.state.contentEditable });
  };

  setProfileData = data => {
    //console.log(data);
    if (data) {
      let userId = data.userId;
      let summary = data.summary;
      let firstName = data.firstName;
      let lastName = data.lastName;
      // let tagline = data.tagline.trim();
      // let editTag = data.tagline.trim();
      let tagline = data.tagline ? data.tagline.trim() : null;
      let editTag = data.tagline ? data.tagline.trim() : null;

      let name =
        (data.firstName ? data.firstName : '') +
        ' ' +
        (data.lastName ? data.lastName : '');
      let profileImage = data.profilePicture;
      if (profileImage) {
        profileImage = getThumbImage('medium', profileImage);
      }
      let coverImage = data.coverImage;
      if (coverImage) {
        coverImage = getThumbImage('original', coverImage);
      }
      let isActive = data.isActive;
      this.setState({
        editTag,
        summary,
        firstName,
        lastName,
        userId,
        profileImage,
        coverImage,
        tagline,
        isActive,
        name
      });
    }
  };  

 
  showJobDescriptionComponent = event => {    
    this.setState({
      showJobDescriptionComponent: !this.state.showJobDescriptionComponent   
    });    
    
    if(!this.state.showJobDescriptionComponent){
       this.setState({jobDescriptionDetail :  null});
       this.getJobDescriptionDetails(this.state.userId);
    }
  };

  editJobDescriptionComponent = jobDescriptionDetail => {
    console.log(jobDescriptionDetail);
    this.setState({
      jobDescriptionDetail: jobDescriptionDetail ,
      showJobDescriptionComponent: !this.state.showJobDescriptionComponent    
    });
  }


 

  getProfileData = () => {
    let userId = this.state.userId;
    this.props.actionGetStudentPersonalInfo(userId);
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

  toggleDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };  


  tagUserForJob = data =>{
     this.props.history.push({
      pathname: '/recruiter/userMapping',
      state: {
        jobDetail: data                                        
      }
     })    
  }
 
 
  render() {
    return (
      <div className="wrapper">
       <Header {...this.props} />     
        <div className="main-panel">   
          <div className="w3-content main-panel1">         

                   <div style={{"margin-bottom": "10px",position: "absolute", right: "250px","padding-top": "10px"}}>
                    <a  onClick={this.showJobDescriptionComponent.bind(
                            this                            
                          )} 
                          className={                           
                              'btn btn-primary with-icon smallBtn mr-1 '                            
                          }
                          style={{ cursor: 'pointer' }}>
                          {' '}
                          <span className="icon-plus" /> Add Job Description
                        </a>
                   </div>  
                          {this.state.showJobDescriptionComponent ==
                              true ? (
                                <AddJobDescription
                                  closeJobDescriptionComponent={
                                    this.showJobDescriptionComponent
                                  }                                 
                                  jobDescriptionDetail={
                                    this.state.jobDescriptionDetail
                                  }
                                />
                              ) : (
                                '')}
                   
               

<div className="card">
        <div className="header">
          <h4 className="title">Job Description List</h4>
          <p className="category"></p>
        </div>
        <div className="content table-responsive table-full-width">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Role</th>
                <th>Location</th>
                <th className="text-right">No of Position</th>
                <th className="text-right">Experience</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
            {this.state.jobDescriptionListData && this.state.jobDescriptionListData.map((data, index) => (
                <tr >
                  <td>{data.title}</td>
                  <td>{data.location[0]}</td>
                  <td className="text-right">{data.noOfPosition}</td>
                  <td className="text-right">{data.maxExperience}</td>
                  <td className="text-right">
                  <Button onClick={this.tagUserForJob.bind(this,data)}>
                          {this.state.roleId==4 ? "Go For Map" : "View Student"}
                   </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
        </div>
      </div>  </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    otherUser: state.User.otherUserInfoData,
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
)(JobDescription);
