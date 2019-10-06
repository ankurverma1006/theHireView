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
import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import S3FileUpload from 'react-s3';

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
  getThumbImage,
  ZoomInAndOut
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
//  nextArrow: <SampleNextArrow props={this.props} />,
//  prevArrow: <SamplePrevArrow props={this.props} />,
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

class UserMapping extends Component {
  constructor(props, context) {
    super(props);
    this.state = {      
      showJobDescriptionComponent: false,      
      jobDescriptionDetail: {},        
     
      loader1: false,
      loader2: false,      
      jobDescriptionListData: [],
      showVideoComponent: false,     
      userData:{},     
      showDropdown: false,     
      isActive: 'true',     
      contentEditable: false,
      editName: false,
      name: '',
      editTagLine: false
    };
   /// this.textInput = React.createRef();    
  }

  componentWillMount() {
    let user= this.props.otherUser? this.props.otherUser: this.props.user;
    if(user){
      let userId =user.userId;       
      this.setState({userId: userId,user:user,roleId:user.roleId});
    }    
    let jobDetail= this.props.location.state.jobDetail;
    console.log(jobDetail);
    if(jobDetail){
      if(this.props.user.roleId == 4){
        this.getUserListForMapping(jobDetail.jobDescId);  
      }else{
        this.getUserListForHR(jobDetail.jobDescId);  
      }  
      this.setJobDescriptionData(jobDetail);   
    } 
  }

  setJobDescriptionData(jobDescription){
     this.setState({
      jobDescription:jobDescription,
      description: jobDescription.description,
      title: jobDescription.title,
      jobId:jobDescription.jobDescId 

     });
  }

  getUserListForMapping(jobId){
    theRapidHireApiService('getUserListForMapping',{jobId})
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

  getUserListForHR(jobId){
    theRapidHireApiService('getUserListForHR',{jobId})
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

  handleSubmit = (data,action) => {
    let jobMapId=data.jobMapId;
    let jobId=this.state.jobId;
    let candidateId=data.userId;
    let hrId=this.state.userId;
    let status= action;
    let createdBy= this.props.user.userId;

    let dataMap={
      jobMapId,
      jobId,
      candidateId,
      hrId,
      status,
      createdBy        
    }
    
    if(jobMapId!=="" || jobMapId!==null){
        theRapidHireApiService('createJobMap',dataMap)
        .then(response => {     
          if (response.data.status === "Success") {
            this.getUserListForMapping(this.state.jobId);   
            //  let jobDescriptionListData= this.state.jobDescriptionListData;
            //  jobDescriptionListData= response.data.result;
        
            //  this.setState({jobDescriptionListData: jobDescriptionListData});
          }
        })
        .catch(err => {
          console.log(err);
        });
    }else{
      theRapidHireApiService('updateJobMap',dataMap)
      .then(response => {     
        if (response.data.status === "Success") {
          this.getUserListForMapping(this.state.jobId);   
          //  let jobDescriptionListData= this.state.jobDescriptionListData;
          //  jobDescriptionListData= response.data.result;
      
          //  this.setState({jobDescriptionListData: jobDescriptionListData});
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
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

 
  showVideoComponent = index => {   
    let jobDescriptionListData= this.state.jobDescriptionListData;
    if(jobDescriptionListData[index])
     jobDescriptionListData[index]['showVideoComponent']= jobDescriptionListData[index]['showVideoComponent'] ? !jobDescriptionListData[index]['showVideoComponent']: true;
    this.setState({
      jobDescriptionListData: this.state.jobDescriptionListData   
    }); 
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
    theRapidHireApiService('getSASToken')
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


  showVideoHistory = data =>{
    this.props.history.push({
      pathname: '/recruiter/videoHistory',
      state: {
        userId: data.userId
      }
    });
  }
 
 
  render() {let self= this;
    return (
    //  <div className="wrapper">
   
       /* <SideBar jobDescription={this.state.jobDescription} /> */
      //  <Header {...this.props} />     
        // <div className="main-panel">   
        // <div className="w3-content main-panel1">    
          /* <div className="">
            <div className="">
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
          

          <div className="">                      
            <div className="">
              <ul className="">     
                  <li className="">
                    <div className="">
                      <p>Desired Career Profile</p>
                    </div>

                    <div className="">
                    <div className="">
                    <a  onClick={this.showJobDescriptionComponent.bind(
                            this                            
                          )}
                          className={                           
                              'btn btn-primary with-icon smallBtn mr-1'                            
                          }
                          style={{ cursor: 'pointer' }}>
                          {' '}
                          <span className="icon-plus" /> {this.state.title}
                        </a>
                                       
    

                             {this.state.jobDescriptionListData && this.state.jobDescriptionListData.map((data, index) => (
                                  <div key={index} className="relative--box">
                                  <ul>
                                      <li>{data.title}</li>
                                </ul>
                                  <div className="content-box--edit text-left">
                                    <a
                                      onClick={this.editJobDescriptionComponent.bind(
                                        this,
                                        data
                                      )}
                                    >
                                      <span className="icon-edit_pencil icon" />
                                    </a>
                                  </div>  
                                  </div>                               
                                ))
                            }                    
                    </div></div>
                  </li>
        
              </ul>
            </div>
            </div>
      
             
          </div>
          <ul>
        {this.state.jobDescriptionListData && this.state.jobDescriptionListData.map((data, index) => (
           
           <li>   <div className="ankurNewBox">
                <div key={index} className="relative--box">
                                  <ul>
                                      <li>{data.firstName}</li>
                                </ul>
                                  <div className="content-box--edit text-left">
                                    <a
                                      onClick={this.editJobDescriptionComponent.bind(
                                        this,
                                        data,
                                        null
                                      )}
                                    >
                                      <span className="icon-edit_pencil icon" />
                                    </a>
                                  </div>  
                                  </div>  
                                {this.props.user.userId !== this.state.userId ?      
                                 <div className="buttonAnkur">
                                   <a
                                      onClick={this.handleSubmit.bind(
                                        this,
                                        data,
                                        null
                                      )}
                                    >
                                     Go For Map
                                    </a>
                  </div> : 
                  <div>
                                <div className="buttonAnkur">
                                  <a
                                    onClick={this.handleSubmit.bind(
                                      this,
                                      data,
                                      'Shortlist'
                                    )}
                                  >
                                  Shortlist
                                  </a>
                                  </div>
                                  
                                  <div className="buttonAnkur">
                                  <a
                                    onClick={this.handleSubmit.bind(
                                      this,
                                      data,
                                      'Rejected'
                                    )}
                                  >
                                  Rejected
                                  </a>
                                  </div>
                      </div>
                      }    
              </div>  
              </li>
            ))}  </ul>
        </div> */


/* <div className="card">
    <div className="content table-responsive table-full-width">
      <table className="table table-bigboy">
        <thead>
          <tr>          
          </tr>
        </thead>
        <tbody>
          {this.state.jobDescriptionListData && this.state.jobDescriptionListData.map(item => (
            <tr>
              <td style={{float:""}}>
                <div className="img-container" style={{width:"100px"}}>
                  <img src={item.profilePicture}  />
                </div>
              </td>
              <td className="text-left td-name">
                {item.firstName} {item.lastName}
              </td>
              <td className="td-name">
                {item.firstName} {item.lastName}
              </td>
               <td>
               <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
               
                
                >    Watch
              </Button>
              </td>
             
              <td className="td-actions">
               
              </td>
            </tr>
          ))}


           
          


        </tbody>
      </table>
    </div></div> */
    
    
    
    
    
    <div className="wrapper">
     <ToastContainer
        autoClose={5000}
        className="custom-toaster-main-cls"
        toastClassName="custom-toaster-bg"
        transition={ZoomInAndOut}
      />
        <Header {...this.props} />     
          <div className="main-panel">          
        

        <div className="w3-content main-panel1">
        
          <div className="container main">
           

            {/* <div className="button--wrapper mb-1 text-center flex flex-1 justify-center dashBtnCenter">
              <button
                className="btn btn-with-border with-icon smallBtn mr-1"
                onClick={this.viewSampleProfile}
              >
                View Sample Profile
              </button>              
              <button
                className="btn btn-with-border with-icon smallBtn"
                onClick={this.addStudentModel}
              >
                <span className="icon-plus" />
                add student
              </button>
            </div> */}
            {this.state.jobDescriptionListData && this.state.jobDescriptionListData.map(function(data, index) {
                return (
                  <div
                    key={index}
                    className="suggestion-usd"
                    id={'student_' + data.userId}
                  >
                    <div className="student-img deflt-icon centeredBox flex">
                      {data.profilePicture ? (
                        <img
                          src={data.profilePicture}
                          alt=""
                          className="img-responsive"
                        />
                      ) : (
                        <div className="pp-default">
                          <span className="icon-user_default2" />
                        </div>
                      )}
                    </div>
                    <div className="student-info flex justify-content-space-between">
                      <div className="flex align-center justify-content-space-bettween p-20-30 stuBgWhite">
                        <div className="flex-1">
                          <h3>
                            {data.firstName
                              ? data.firstName +
                                ' ' +
                                (data.lastName ? data.lastName : '')
                              : null}
                          </h3>
                          <p>{data.email}</p>
                          <p>{data.experience}</p>
                        </div>

                         <div className="flex-1">
                          <h6>
                            {data.profileRole[0] && data.profileRole[0].profileRole ? data.profileRole[0].profileRole :null}                            
                          </h6>
                          {data.skills && data.skills.map(item => ( <p className="p--name wrap-long-words">{
                                                                                    limitCharacter(item.skillName,8)}</p>))}
                        </div>

                        <div className="btn-group flex align-center">                 
                        {self.props.user.roleId == 4 ?
                            <button onClick={self.handleSubmit.bind(
                                    self,
                                    data,
                                    null                          
                                  )} 
                              className="btn btn-primary no-round"
                            //  onClick={self.handleClickProfile.bind(self, data)}
                            >
                              Map
                            </button>                       
                          :
                          <button onClick={self.showVideoComponent.bind(
                            self,
                            index                            
                          )} 
                            className="btn btn-primary no-round"
                          //  onClick={self.handleClickProfile.bind(self, data)}
                          >
                           Watch
                          </button>}
                          {data.showVideoComponent ==
                              true ? (
                                <ShowVideo
                                  closeShowVideoComponent={
                                    self.showVideoComponent
                                  }                                 
                                  chatLink={
                                    data.chatLink
                                  }
                                  userId={data.userId}
                                />
                              ) : (
                                '')}
                          &nbsp; &nbsp;

                          
                          <button onClick={self.showVideoHistory.bind(
                            self,
                            data                            
                          )} 
                            className="btn btn-primary no-round"
                          //  onClick={self.handleClickProfile.bind(self, data)}
                          >
                           History
                          </button>
                                              
                          <DropdownButton
                            className="burger-trigger"
                            title={<span className="icon-burger" />}
                            id="1"
                          >
                            <MenuItem
                              // onSelect={self.addParentModel.bind(
                              //   this,
                              //   data.userId
                              // )}
                            >
                              <i className="m-ico icon-plus" />
                              Add Parent
                            </MenuItem>
                            <MenuItem
                              onSelect={() =>
                                self.props.history.push({
                                  pathname: '/parent/list',
                                  state: { studentData: data }
                                })
                              }
                            >
                              <i className="m-ico icon-parent" /> Parent List
                            </MenuItem>
                            <MenuItem
                              onSelect={() =>
                                self.props.history.push({
                                  pathname: '/student/profilelog',
                                  state: { profileOwner: data.userId }
                                })
                              }
                            >
                              <i className="m-ico icon-profile-sharing" />{' '}
                              Profile Sharing Log
                            </MenuItem>

                            <MenuItem
                            //   onSelect={self.deleteStudent.bind(
                            //     this,
                            //     data.userId,
                            //     self.props.parent.userId
                            //   )}
                            >
                              <i className="m-ico icon-delete" /> Delete
                            </MenuItem>
                          </DropdownButton>
                        </div>
                      </div>

                      {/* <div className="flex align-center justify-content-space-bettween tag-wrap">
                        <div className="promo-tag br-light">
                          Skills <span>{data.accomplishment}</span>
                        </div>
                       
                        <div className="promo-tag">
                          Location <span>{data.recommendation}</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                );
              })}
          </div>         
          {/* {this.state.addStudentModel ? (
            <AddMoreStudent
              addStudentModel={this.state.addStudentModel}
              closeAddStudentModel={this.addStudentModel}
            />
          ) : null} */}
        </div></div>
      </div>
    
    
    
    
    
    
    // </div></div>
    //   </div>
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
)(UserMapping);
