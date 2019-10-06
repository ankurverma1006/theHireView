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
import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
//import SideBar from '../../components/SideBar';
import _ from 'lodash';
import S3FileUpload from 'react-s3';
import { Link } from 'react-router-dom';
//import Summary from './summary/addSummary';
import Education from '../profile/addEducation';
import AddEmployment from '../profile/addEmployment';
import AddProject from '../profile/addProject';
import AddCareerProfile from '../profile/addCareerProfile';
import AddPersonalProfile from '../profile/addPersonalProfile';
import AddSkills from '../profile/addSkills';
import VideoIntroduction from '../profile/videoIntroduction';
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
import theRapidHireApiService from '../../common/core/api/apiService';
import CONSTANTS from '../../common/core/config/appConfig';
import moment from 'moment';
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
import Select from 'react-select';

const config = {
  bucketName: 'ankurself',
  dirName: 'photos', /* optional */
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
}
var settings=null;

const skills1=[
  {label:'Developer',value:1 },
  {label:'React Developer',value:2 }
  ]

class EditProfile extends Component {
  constructor(props, context) {
    super(props);
    this.state = {      
      showEmploymentComponent: false,
      showSkillsComponent: false,
      showProjectComponent: false,
      showPCareerProfileComponent: false,
      showVideoComponent:false,
      showEducationComponent:false,
      educationDetail: {}, 
      employmentDetail: {},            
      skillsDetail: {},     
      projectDetail: {},    
      careerProfileDetail: {}, 
      loader1: false,
      loader2: false,
      imageSource: '',      
      employmentListData: [],
      skillsListData:[],
      projectListData:[],
      userData:{},    
      showDropdown: false,     
      isActive: 'true',     
      contentEditable: false,
      editName: false,
      name: '',
      editTagLine: false,
      profileRoleList:[],
      userProfile:{}
    };
   // this.textInput = React.createRef();    
  }

  componentWillMount() {
    let user= this.props.otherUser? this.props.otherUser: this.props.user;
    
    if(user){
      let userId =user.userId; 
      this.getEmploymentData(userId);
      this.getUserDetails(userId);  
      this.getSkillsData(userId);
      this.getProjectsData(userId);
      this.getCareerProfileData(userId);
      this.getUserProfileData(userId);
      this.setProfileData(user);
      this.setState({userId: userId,user:user});
    }    
    this.uploadImageToAzure = this.uploadImageToAzure.bind(this);
  }

  componentWillReceiveProps(res) {
     this.setProfileData(res.user);   
  }

  componentDidMount() { 
  
  }

  setProfileData = data => {
    //console.log(data);
    if (data) {
      let userId = data.userId;
      let summary = data.summary;
      let firstName = data.firstName;
      let lastName = data.lastName;
      // let tagline = data.tagline.trim();
      // let editTag = data.tagline.trim();
      let email= data.email;
      let tagline = data.tagline ? data.tagline.trim() : null;
      let editTag = data.tagline ? data.tagline.trim() : null;

      let name =
        (data.firstName ? data.firstName : '') +
        ' ' +
        (data.lastName ? data.lastName : '');
      let profileImage = data.profilePicture;
      if (profileImage) {
        profileImage = profileImage //getThumbImage('medium', profileImage);
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
        email,
        profileImage,
        coverImage,
        tagline,
        isActive,
        name
      });
    }
  }; 

  //Get Section
  getUserDetails(userId){
    theRapidHireApiService('getUserDetails',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
         let userData= this.state.userData;
         userData= response.data.result[0];     
         this.setState({userData: userData});        
      }
    })
    .catch(err => {
      console.log(err);
    });
  } 

  getEmploymentData(userId){
    theRapidHireApiService('getEmploymentListById',{userId})
    .then(response => { 
      console.log(response);    
      if (response.data.status === 'Success') {
         let employmentListData= this.state.employmentListData;
         employmentListData= response.data.result;
         this.setState({employmentListData: employmentListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  getSkillsData(userId){
    theRapidHireApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);
         let skillsListData= this.state.skillsListData;
         let skillsDetail = response.data.result[0];        
         skillsListData=skillsDetail ? skillsDetail.skills: []
         this.setState({skillsListData,skillsDetail});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  getProjectsData(userId){
    theRapidHireApiService('getProjectListById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
         let projectListData= this.state.projectListData;
         projectListData= response.data.result;
         this.setState({projectListData: projectListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  getCareerProfileData(userId){
    theRapidHireApiService('getDesiredProfileListById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
         let careerProfileListData= this.state.careerProfileListData;
         careerProfileListData= response.data.result[0];
         this.setState({careerProfileListData: careerProfileListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  } 

  getProfileData = () => {
    let userId = this.state.userId;
    this.props.actionGetStudentPersonalInfo(userId);
  };

  getUserProfileData(userId){
    theRapidHireApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
            
         let userProfile = response.data.result[0];       
        if(userProfile){
          let profileRole= userProfile.profileRole && userProfile.profileRole[0] && userProfile.profileRole[0].profileRole ?
                                                          userProfile.profileRole[0].profileRole : [] ;
          let experience= userProfile.experienceInYear;
          let mobileNo= userProfile.mobileNo;
          let currentLocation= userProfile.currentLocation;
          let videoLink = userProfile.videoLink;
          this.setState({userProfile:userProfile,
                      profileRole,
                      experience,
                      mobileNo,
                      currentLocation,
                      videoLink
          }); 
          this.setUserProfileData(userProfile);
        }         
      }
    })
    .catch(err => {
      console.log(err);
    });
  } 

  setUserProfileData = data => {    
    console.log('data ',data);
    if (data) { 
      this.setState({     
          userProfileId : data.userProfileId,
          skills:data.skills,
          year: data.experienceInYear,
          month: data.experienceInMonth,
          location: data.currentLocation,
          mobileNo: data.mobileNo,
          resumeURL: data.resumeURL,
          resumeName:data.resumeName,
          profileRole: data.profileRole[0].profileRoleId          
        });    
    }
  };

   //Show Component Section
   showEducationComponent = event => {    
    this.setState({
      showEducationComponent: !this.state.showEducationComponent   
    });
    if(!this.state.showEducationComponent){
       this.setState({educationDetail :  null});
       //this.getEducationData(this.state.userId);
    }
  };

  //Show Component Section
  showEmploymentComponent = event => {    
    this.setState({
      showEmploymentComponent: !this.state.showEmploymentComponent   
    });
    if(!this.state.showEmploymentComponent){
       this.setState({employmentDetail :  null});
       this.getEmploymentData(this.state.userId);
    }
  };

  showSkillsComponent = event => {    
    this.setState({
      showSkillsComponent: !this.state.showSkillsComponent   
    });    
    
    if(!this.state.showSkillsComponent){
     //  this.setState({skillsDetail :  null});
       this.getSkillsData(this.state.userId);
    }
  };

  showSkillsComponent = event => {    
    this.setState({
      showSkillsComponent: !this.state.showSkillsComponent   
    });    
    
    if(!this.state.showSkillsComponent){
     //  this.setState({skillsDetail :  null});
       this.getSkillsData(this.state.userId);
    }
  }; 

  showPersonalProfileComponent = event => {    
    this.setState({
      showPersonalProfileComponent: !this.state.showPersonalProfileComponent   
    });    
    
    if(!this.state.showPersonalProfileComponent){
     //  this.setState({skillsDetail :  null});
       this.getSkillsData(this.state.userId);
    }
  }; 

  showProjectComponent = event => {    
    this.setState({
      showProjectComponent: !this.state.showProjectComponent   
    });    
    
    if(!this.state.showProjectComponent){
       this.setState({projectDetail :  null});
       this.getProjectsData(this.state.userId);
    }
  };

  showCareerProfileComponent = event => {    
    this.setState({
      showCareerProfileComponent: !this.state.showCareerProfileComponent   
    });    
    
    if(!this.state.showCareerProfileComponent){
       this.setState({careerProfileDetail :  null});
       this.getCareerProfileData(this.state.userId);
    }
  };

  showVideoComponent = event => {    
    this.setState({
      showVideoComponent: !this.state.showVideoComponent   
    });     
  };

  editEducationComponent = educationDetail => {
    console.log(educationDetail);
    this.setState({
      educationDetail: educationDetail ,
      showEducationComponent: !this.state.showEducationComponent    
    });
  }

  editEmploymentComponent = employmentDetail => {
    console.log(employmentDetail);
    this.setState({
      employmentDetail: employmentDetail ,
      showEmploymentComponent: !this.state.showEmploymentComponent    
    });
  }

  editSkillsComponent = skillsDetail => {    
    this.setState({
      skillsDetail: skillsDetail ,
      showSkillsComponent: !this.state.showSkillsComponent    
    });
  }

  editProjectComponent = projectDetail => {
    console.log(projectDetail);
    this.setState({
      projectDetail: projectDetail ,
      showProjectComponent: !this.state.showProjectComponent    
    });
  }

  editCareerProfileComponent = careerProfileDetail => {
    console.log(careerProfileDetail);
    this.setState({
      careerProfileDetail: careerProfileDetail ,
      showCareerProfileComponent: !this.state.showCareerProfileComponent    
    });
  }  
  
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


  // Change name by making editable
  contentEditable = () => {
    window.scrollTo(500, 0);
    //console.log(!this.state.contentEditable);
    this.setState({ contentEditable: !this.state.contentEditable });
  };
 
  makeTagLineEditable = () => {
    let editTag = this.state.tagline ? this.state.tagline : '';
    this.setState({
      editTagLine: !this.state.editTagLine,
      editTag: editTag
    });
  };


  saveTagLine = () => {
    let userId = this.state.userId;
    let tagline = this.state.editTag;
    let data = {
      userId,
      tagline
    };
    //if (tagline) {
    this.props.actionUpdateUserInfo({ tagline });
    theRapidHireApiService('updateUserTagline', data)
      .then(response => {
        if (response.data.status === 'Success') {
          this.setState({ editTagLine: false });
        }
      })
      .catch(err => {
        this.setState({ editTagLine: false });
        console.log(err);
      });
    // } else {
    //   this.setState({ editTagLine: false });
    // }
  };

  saveName = () => {
    let userId = this.state.userId;
    let name = this.state.name.trim();
    if (name) {
      var newArray = name.split(' ').map(function(item, index) {
        if (item.length > 0) {
          return item;
        }
      });

      let firstName = newArray.length > 0 ? newArray[0] : '';
      if (newArray.length > 1) {
        var lastName = newArray.slice(1).join(' ');
      }

      if (firstName && firstName.length > 35) {
        showErrorToast(
          'Your first name should not be more than 35 characters.'
        );
      } else if (lastName && lastName.length > 35) {
        showErrorToast('Your last name should not be more than 35 characters.');
      } else {
        let data = {
          userId,
          firstName,
          lastName
        };
        this.props.actionUpdateUserInfo({ firstName, lastName });
        // theRapidHireApiService('updateName', data)
        //   .then(response => {
        //     if (response.data.status === 'Success') {
        //       this.setState({ editName: false });
        //     }
        //   })
        //   .catch(err => {
        //     this.setState({ editName: false });
        //     console.log(err);
        //   });
      }
    } else {
      this.setState({ editName: false });
    }
  };

  makeNameEditable = () => {
    let name =
      (this.state.firstName ? this.state.firstName : '') +
      ' ' +
      (this.state.lastName ? this.state.lastName : '');
    this.setState({
      editName: true,
      name: name
    });
  };


  //Profile Change 
  uploadImageToAzure(file) {
    let userId = this.state.userId;

    if (file !== '') {
        S3FileUpload
        .uploadFile(file, config)
        .then(data => {
          let profileImage = getThumbImage('medium', this.state.imageName);
              this.setState({ profileImage: profileImage, loader1: false });             
              this.updateUserData(data.location, userId);
        })    
        .catch(err => console.error(err));     
    }
  }

  updateUserData = (uploadPath, userId) => {  
      let profilePicture = uploadPath;
      let data = {
        userId,
        profilePicture
      };
      this.props.actionUpdateUserInfo({ profilePicture });
      theRapidHireApiService('updateProfileImage', data);    
  };
  
  handleImageChange = (action, event) => {
    let fileName = event.target.files[0].name;
    S3FileUpload
    .uploadFile(event.target.files[0], config)
    .then(data => {
      
      let userId= this.state.userId;
      let profilePicture = data.location;
      let profileData = {
        userId,
        profilePicture
      };
      this.props.actionUpdateUserInfo({ profilePicture });
      theRapidHireApiService('updateProfileImage', profileData);    

    })
    // this.setState({ imageSource: '' });
    // const file = event.target.files[0];
    // const fileName = file.name;
    // const fileType = file.type;
    // if (file) {      
    //   let reader = new FileReader();
    //   reader.readAsDataURL(event.target.files[0]);
    //   reader.onload = event => {
    //     this.setState({
    //       imageSource: event.target.result,
    //       imageName: fileName,
    //       imageType: fileType,
    //       action: action
    //     });
    //   };
    // }
  };

  // Upload file to Azure
  uploadFiles= event => {
    console.log(event.target.files[0]);
    let fileName = event.target.files[0].name;
    S3FileUpload
    .uploadFile(event.target.files[0], config)
    .then(data => {
      let sendData ={
         userProfileId: this.state.userProfileId,
         userId: this.state.userId,
         resumeURL:data.location,
         resumeName: fileName
      };     
      console.log(data);
      theRapidHireApiService('addResume',sendData)
      .then(response => {     
        if (response.data.status === 'Success') {
          this.getUserProfileData(this.state.userId);
        }
      })
      .catch(err => {
        console.log(err);
      });
    })    
    .catch(err => console.error(err));
  }

  DeleteFile = event => {
    S3FileUpload
    .deleteFile(this.state.resumeName, config)
    .then(response =>{ console.log(response);
      let sendData ={
        userProfileId: this.state.userProfileId,
        userId: this.state.userId,
        resumeURL:null,
        resumeName: null
     };     
     
     theRapidHireApiService('addResume',sendData)
     .then(response => {     
       if (response.data.status === 'Success') {
         this.getUserProfileData(this.state.userId);
       }
     })
     .catch(err => {
       console.log(err);
     });
    })
    .catch(err => console.error(err));
  }
 
  render() {
    return (
      <div className="wrapper">
      <Header {...this.props} />     
      <div className="main-panel">   
        
      {/* <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />  */}
        <div className="">   
       {this.state.imageSource ? (
          <ImageCropper
            imageSource={this.state.imageSource}
            imageName={this.state.imageName}
            imageType={this.state.imageType}
            aspectRatio={this.state.action === 1 ? 1 / 1 : 16 / 9}
            modalSize={this.state.action === 1 ? 'medium' : 'large'}
            cropBoxWidth={this.state.action === 1 ? '200' : '700'}
            cropBoxHeight={this.state.action === 1 ? '200' : '700'}
            uploadImageToAzure={this.uploadImageToAzure}
          />
        ) : null} 

        

  <div className="w3-content main-panel1">
 
 
 <div className="w3-row-padding">
  
   <div className="w3-third">
     <div className="w3-white w3-text-grey w3-card-4">
      <div className="w3-display-container " style={{overflow:"hidden"}}>
      <img  src={this.state.profileImage} style={{width:"100%","padding-right": "132px"}} alt="Avatar" />          
            
      <div className="">
      <div className="">
                    <div className="">    
         <input  type="file"
                        onChange={this.handleImageChange.bind(this, 1)}
                        accept="image/*"
                        value=""
                      />
                      <span className="icon-camera icon" />  
        </div>  </div>  </div>   
      </div>      
      <div className="w3-container">
      <p><i className="fa fa-user fa-fw w3-margin-right w3-large w3-text-teal"></i>{this.state.firstName} {this.state.lastName}</p>
        <p><i className="fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal"></i>{this.state.profileRole}</p>
        <p><i className="fa fa-home fa-fw w3-margin-right w3-large w3-text-teal"></i>London, UK</p>
        <p><i className="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>{this.state.email}</p>
        <p><i className="fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal"></i>{this.state.mobileNo}</p>
        <p><i className="fa-fw w3-margin-right w3-large w3-text-teal"></i>
                    {this.state.profileRole ?         
                                      <Button
                                      bsStyle="primary no-bold no-round mr-1"
                                        onClick={this.showPersonalProfileComponent.bind(
                                          this                            
                                        )}
                                       >
                                       <span className="icon-share2" />
                                        Add Information
                                       </Button>
                                       :
                                        <Button onClick={this.showPersonalProfileComponent.bind(
                                           this                            
                                              )}
                                                className="btn btn-white with-icon">
                                          <span className="icon-share2" />
                                          Add Information
                                        </Button>}

                          {this.state.showPersonalProfileComponent ==
                            true ? (
                              <AddPersonalProfile
                                closePersonalProfileComponent={
                                  this.showPersonalProfileComponent
                                }           
                                user={
                                  this.state.user
                                }                    
                                userProfile={
                                  this.state.userProfile
                                }
                              />
                            ) : (
                              '')}    
        </p>
        {/* <p className="w3-large"><b><i className="fa fa-asterisk fa-fw w3-margin-right w3-text-teal"></i>Skills</b></p>
        <p>Adobe Photoshop</p>
        <div className="w3-light-grey w3-round-xlarge w3-small">
          <div className="w3-container w3-center w3-round-xlarge w3-teal" style={{width:"90%"}}>90%</div>
        </div>
        <p>Photography</p>
        <div className="w3-light-grey w3-round-xlarge w3-small">
          <div className="w3-container w3-center w3-round-xlarge w3-teal" style={{width:"80%"}}>
            <div className="w3-center w3-text-white">80%</div>
          </div>
        </div>
        <p>Illustrator</p>
        <div className="w3-light-grey w3-round-xlarge w3-small">
          <div className="w3-container w3-center w3-round-xlarge w3-teal" style={{width:"75%"}}>75%</div>
        </div>
        <p>Media</p>
        <div className="w3-light-grey w3-round-xlarge w3-small">
          <div className="w3-container w3-center w3-round-xlarge w3-teal" style={{width:"50%"}}>50%</div>
        </div>
        className
  
        <p className="w3-large w3-text-theme"><b><i className="fa fa-globe fa-fw w3-margin-right w3-text-teal"></i>Languages</b></p>
        <p>English</p>
        <div className="w3-light-grey w3-round-xlarge">
          <div className="w3-round-xlarge w3-teal" style={{height:"24px",width:"100%"}}></div>
        </div>
        <p>Spanish</p>
        <div className="w3-light-grey w3-round-xlarge">
          <div className="w3-round-xlarge w3-teal" style={{height:"24px",width:"55%"}}></div>
        </div>
        <p>German</p>
        <div className="w3-light-grey w3-round-xlarge">
          <div className="w3-round-xlarge w3-teal" style={{height:"24px",width:"25%"}}></div>
        </div>
        className
      </div> */}
       </div>
    </div>  
  </div>

<div className="w3-twothird">
 {this.state.videoLink ? null : 
    
      <div className="w3-container w3-card w3-white w3-margin-bottom">    
        <div className="centerButton">
            <Link target="_blank" style={{color:"blue"}} to="/video">Add Video Introduction </Link>                     
        </div>
        <div className="w3-container">
        <h5 className="w3"><b>           
            </b></h5>
         <p></p>    
      </div>     
    </div>
  }


  <div className="w3-container w3-card w3-white w3-margin-bottom">
             
      <h2 className="w3-text-grey">
               Resume        
      </h2>
       <div className="centerButton">   
        <ul style={{"list-style": "none"}}><li>
       <p>   <div style={{"padding-left": "150px"}}> <input type="file" onChange={this.uploadFiles.bind(this)} />
         <i className="fa fa-cloud-upload fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i></div> </p></li>
         <li>
            <p><a>{this.state.resumeName}</a></p> </li>  </ul>                    
      </div> 
      {/* <div className="centerButton">
      <input type="file" onChange={this.uploadFiles.bind(this)} /> </div> */}
      <div className="w3-container">
        <h5 className="w3-opacity"><b>
        { this.state.resumeURL ?  <DownloadLink
                          filename={this.state.resumeURL}
                          exportFile={() => "My cached data"}
                      >
                              Link to download
                      </DownloadLink> : null}       </b></h5>    
                      <p>             
         { this.state.resumeURL ? 
                        <a onClick={this.DeleteFile.bind(this)}>Delete Resume</a>: null}
                        <br></br>         
                       </p>       
       
      </div>     
    </div>

    {/* Education */}
    <div className="w3-container w3-card w3-white w3-margin-bottom">

    <div className="centerButton">                        
                <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
                 // disabled={isLoading}
                  onClick={this.showEducationComponent.bind(this)}
                >  Add Education
              </Button>
              {this.state.showEducationComponent ==
                              true ? (
                                <Education
                                  closeEducationComponent={
                                    this.showEducationComponent
                                  }     
                                  user={
                                    this.state.user
                                  }                           
                                  educationMode={
                                    this.state.educationDetail
                                  }
                                />
                              ) : (
              '')}
              </div>
     
              <h2 className="w3-text-grey"><i className="fa-fw w3-margin-right w3-text-teal"></i></h2> 
              
         {this.state.employmentListDeducationListDataata && this.state.educationListData.map((data, index) => (                          
              <div className="w3-container">                        
                            <h5 className="w3-opacity"><b></b>
                              <a onClick={this.editEducationComponent.bind(this,data)}>
                                      <span className="pe-7s-pen" />
                                    </a>
                            </h5>
                            <h6 className="w3-text-teal"><i className="fa fa-calendar fa-fw w3-margin-right"></i>
                              {moment(parseInt(data.startDate,10)).format("DD-MMM-YYYY")+' ' } to 
                                        {data.endDate ?' '+moment(parseInt(data.endDate,10)).format("DD-MMM-YYYY"):<span className="w3-tag w3-teal w3-round">Present</span>}
                            </h6>
                            <p>Lorem ipsum dolor sit amet.</p>                          
              </div>))}                 
  </div>

   {/* Experience */}
     <div className="w3-container w3-card w3-white w3-margin-bottom">
              <div className="centerButton">                        
                <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
                 // disabled={isLoading}
                  onClick={this.showEmploymentComponent.bind(this)}
                >  Add Experience
              </Button>
              {this.state.showEmploymentComponent ==
                              true ? (
                                <AddEmployment
                                  closeEmploymentComponent={
                                    this.showEmploymentComponent
                                  }     
                                  user={
                                    this.state.user
                                  }                           
                                  employmentDetail={
                                    this.state.employmentDetail
                                  }
                                />
                              ) : (
              '')}
              </div>    
       <h2 className="w3-text-grey"><i className="fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i></h2> 
         {this.state.employmentListData && this.state.employmentListData.map((data, index) => (                          
              <div className="w3-container">                        
                            <h5 className="w3-opacity"><b>{data.designation} / {data.organisation}</b>
                              <a onClick={this.editEmploymentComponent.bind(this,data)}>
                                      <span className="pe-7s-pen" />
                                    </a>
                            </h5>
                            <h6 className="w3-text-teal"><i className="fa fa-calendar fa-fw w3-margin-right"></i>
                              {moment(parseInt(data.startDate,10)).format("DD-MMM-YYYY")+' ' } to 
                                        {data.endDate ?' '+moment(parseInt(data.endDate,10)).format("DD-MMM-YYYY"):<span className="w3-tag w3-teal w3-round">Present</span>}
                            </h6>
                            <p></p>                          
              </div>))}                 
  </div>

   {/* Skills */}
   <div className="w3-container w3-card w3-white w3-margin-bottom">
              <div className="centerButton">                        
                <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
                 // disabled={isLoading}
                  onClick={this.showSkillsComponent.bind(this)}
                >     Add Skills
              </Button>
              {this.state.showSkillsComponent ==true ? (
                          <AddSkills
                            closeSkillsComponent={
                              this.showSkillsComponent
                            }   
                            user={
                              this.state.user
                            }                            
                            skillsDetail={
                              this.state.skillsDetail
                            }
                          />
                        ) : (
                          '')}
              </div>                      

       <h2 className="w3-text-grey"><i className="fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i></h2> 
         {this.state.skillsListData && this.state.skillsListData.map((data, index) => (                          
              <div className="w3-container">                        
                            <h5 className="w3-opacity"><b>{data.skillName} / {data.rating}</b>
                              <a onClick={this.editSkillsComponent.bind(this,data)}>
                                      <span className="pe-7s-pen" />
                                    </a>
                            </h5>                           
                            <p>Lorem ipsum dolor sit amet.</p>                          
              </div>))}                 
  </div>
    


 {/* Project */}  
 <div className="w3-container w3-card w3-white w3-margin-bottom">
              <div className="centerButton">                        
                <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
                 // disabled={isLoading}
                  onClick={this.showProjectComponent.bind(this)}
                >     Add Project
              </Button>
              {this.state.showProjectComponent ==true ? (
                        <AddProject
                          closeProjectComponent={
                            this.showProjectComponent
                          }
                          user={
                            this.state.user
                          }                        
                          projectDetail={
                            this.state.projectDetail
                          }
                        />
                      ) : (
                        '')}
              </div>                      

       <h2 className="w3-text-grey">
      <i className="fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i></h2>
         {this.state.projectListData && this.state.projectListData.map((data, index) => (                          
              <div className="w3-container">                        
                            <h5 className="w3-opacity"><b>{data.projectName} / {data.associatedWith}</b>
                              <a onClick={this.editProjectComponent.bind(this,data)}>
                                      <span className="pe-7s-pen" />
                                    </a>
                            </h5>
                            <h6 className="w3-text-teal"><i className="fa fa-calendar fa-fw w3-margin-right"></i>
                              {moment(parseInt(data.startDate,10)).format("DD-MMM-YYYY")+' ' } to 
                                        {data.endDate ?' '+moment(parseInt(data.endDate,10)).format("DD-MMM-YYYY"):<span className="w3-tag w3-teal w3-round">Present</span>}
                            </h6>                           
                            <p>Lorem ipsum dolor sit amet.</p>                          
              </div>))}                 
  </div>
    



  {/* Desired Career Profile */}  
 <div className="w3-container w3-card w3-white" style={{"margin-bottom": "200px"}}>
              <div className="centerButton">                        
              {this.state.careerProfileListData?null:  <Button
                  bsStyle="primary no-bold no-round mr-1"
                  className="no-bold no-round"
                 // disabled={isLoading}
                  onClick={this.showCareerProfileComponent.bind(this)}
                >     Add Career 
              </Button>}
              {this.state.showCareerProfileComponent ==
                                true ? (
                                  <AddCareerProfile
                                    closeCareerProfileComponent={
                                      this.showCareerProfileComponent
                                    }
                                    user={
                                      this.state.user
                                    }                                   
                                    careerProfileDetail={
                                      this.state.careerProfileDetail
                                    }
                                  />
                                ) : (
                                  '')}                           
              </div>                    

      
            <div>
              <span style={{"font-weight": 600,"font-size": "20px",color: "#333"}}><i className="fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i></span>
                                      
                                      <span class="edit icon" tabindex="0"><a onClick={this.editCareerProfileComponent.bind(this,this.state.careerProfileListData)}>
                                      <span className="pe-7s-pen" />
                                          </a></span>
            </div>
     
            <div className="w3-container">                        
              <h5 className="w3-opacity"><b>{this.state.careerProfileListData && this.state.careerProfileListData.desiredLocation}</b>                
              </h5>                                     
            </div>              
  </div>
  
  </div>  
 </div>  
 </div>

    


        
        
      </div></div></div>
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
)(EditProfile);
