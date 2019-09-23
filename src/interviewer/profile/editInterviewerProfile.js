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

import { Link } from 'react-router-dom';


import AddInterviewerSkills from '../profile/addInterviewerSkills';
import AddPersonalProfile from '../profile/addPersonalProfile';

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

class EditInterviewerProfile extends Component {
  constructor(props, context) {
    super(props);
    this.state = { 
      showSkillsComponent: false,     
      showVideoComponent:false,
      skillsDetail: {},     
      loader1: false,
      loader2: false,
      skillsListData:[],    
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
       
  }

  componentWillMount() {
    let userId = this.props.user.userId;
    this.getUserDetails(userId);  
    this.getSkillsData(userId);
    this.getProfileRoleList();
    this.getUserProfileData(userId);
    this.setProfileData(this.props.user);
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
   
    // this.setProfileData(this.props.user);
    // this.getUserCount();
    // this.skillCount();
    if (this.props.student.achievementData) {
      console.log(this.props.student.achievementData);
    }
  }

  getUserDetails(userId){
    spikeViewApiService('getUserDetails',{userId})
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

  getUserProfileData(userId){
    spikeViewApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);       
         let userProfile = response.data.result[0];       
         this.setState({userProfile:userProfile}); 
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  getSkillsData(userId){
    spikeViewApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);
         let skillsListData= this.state.skillsListData;
         let skillsDetail = response.data.result[0];
         console.log('skillsDetail',skillsDetail);
         skillsListData= skillsDetail.skills
         this.setState({skillsListData,skillsDetail});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  getProfileRoleList(){
    spikeViewApiService('getProfileRoleList')
    .then(response => {     
      if (response.data.status === 'Success') {
        let profileRoleList= this.state.profileRoleList;
        response.data.result.forEach(function(data){       
           profileRoleList.push({label: data.skillName,value:data.skillId })
        })    
        console.log(profileRoleList);    
        this.setState({profileRoleList: profileRoleList});
          }
        })
    .catch(err => {
      console.log(err);
    });
  }


  saveName = () => {
    let userId = this.props.user.userId;
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
        spikeViewApiService('updateName', data)
          .then(response => {
            if (response.data.status === 'Success') {
              this.setState({ editName: false });
            }
          })
          .catch(err => {
            this.setState({ editName: false });
            console.log(err);
          });
      }
    } else {
      this.setState({ editName: false });
    }
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
    spikeViewApiService('updateUserTagline', data)
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


  showSkillsComponent = event => {    
    this.setState({
      showSkillsComponent: !this.state.showSkillsComponent   
    });    
    
    if(!this.state.showSkillsComponent){
     //  this.setState({skillsDetail :  null});
       this.getSkillsData(this.props.user.userId);
    }
  }; 

  showPersonalProfileComponent = event => {    
    this.setState({
      showPersonalProfileComponent: !this.state.showPersonalProfileComponent   
    });    
    
    if(!this.state.showPersonalProfileComponent){
     //  this.setState({skillsDetail :  null});
       this.getSkillsData(this.props.user.userId);
    }
  }; 
  
  editSkillsComponent = skillsDetail => {    
    this.setState({
      skillsDetail: skillsDetail ,
      showSkillsComponent: !this.state.showSkillsComponent    
    });
  }

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

 
  makeTagLineEditable = () => {
    let editTag = this.state.tagline ? this.state.tagline : '';
    this.setState({
      editTagLine: !this.state.editTagLine,
      editTag: editTag
    });
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
        /> */}
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

            <div className="container">
              <div className="profile-info--wrapper">
                <div
                  className={
                    this.state.editName
                      ? 'content content--editable edit--me'
                      : 'content edit--me'
                  }
                >
                  <p className="pName hide--me">
                    {this.state.firstName} {this.state.lastName}
                    <span
                      className="icon-edit_pencil edit-icon"
                      onClick={this.makeNameEditable}
                    />
                  </p>
                  <div className="editableFormControl animated a--top">
                    <InputGroup>
                      <FormControl
                        placeholder="Enter Here"
                        className="custom-form--control"
                        onChange={this.handleChange}
                        name="name"
                        value={this.state.name}
                        autoFocus={true}
                        onBlur={this.saveName}
                        maxLength="71"
                      />
                      <InputGroup.Addon>
                        <span
                          className="icon-right_tick"
                          onClick={this.saveName}
                        />
                      </InputGroup.Addon>
                    </InputGroup>
                  </div>
                </div>

                {!this.state.tagline && this.state.editTagLine === false ? (
                  <div className="addTagLine--wrapper">
                    <div
                      className="btn btn-with-border with-icon smallBtn"
                      onClick={this.makeTagLineEditable}
                    >
                      <span className="icon-plus" />
                      Add Tagline
                    </div>
                  </div>
                ) : this.state.editTagLine === true ? (
                  <div className="content content--editable edit--me">
                    <div className="editableFormControl animated a--top">
                      <InputGroup>
                        <FormControl
                          componentClass="textarea"
                          placeholder="Enter Here"
                          className="custom-form--control"
                          onChange={this.handleChange}
                          name="editTag"
                          value={this.state.editTag}
                          onBlur={this.saveTagLine}
                          autoFocus={true}
                          maxLength="100"
                        />
                        <InputGroup.Addon>
                          <span
                            className="icon-right_tick"
                            onClick={this.saveTagLine}
                          />
                        </InputGroup.Addon>
                      </InputGroup>
                    </div>
                  </div>
                ) : this.state.tagline !== '' &&
                this.state.editTagLine === false ? (
                  <div className="content edit--me">
                    <p className="pDesc hide--me">
                      {this.state.tagline ? this.state.tagline : ''}
                      <span
                        className="icon-edit_pencil edit-icon"
                        onClick={this.makeTagLineEditable}
                      />
                    </p>
                  </div>
                ) : (
                  ''
                )}
               {this.state.userProfile && this.state.userProfile.profileRole && this.state.userProfile.profileRole[0] && 
                  this.state.userProfile.profileRole[0].profileRole?   <span
                  className="icon-edit_pencil edit-icon"
                  onClick={this.showPersonalProfileComponent.bind(
                    this                            
                  )}
                />: 
                 ""}



                {this.state.userProfile && this.state.userProfile.profileRole && this.state.userProfile.profileRole[0] && 
                  this.state.userProfile.profileRole[0].profileRole?this.state.userProfile.profileRole[0].profileRole:                
                (
                  <Button onClick={this.showPersonalProfileComponent.bind(
                    this                            
                  )}
                    className="btn btn-white with-icon"
                 //   onClick={this.shareProfile.bind(this)}
                  >
                    <span className="icon-share2" />
                    Share
                  </Button>
                )}
                   {this.state.showPersonalProfileComponent ==
                                true ? (
                                  <AddPersonalProfile
                                    closePersonalProfileComponent={
                                      this.showPersonalProfileComponent
                                    }                               
                                    userProfile={
                                      this.state.userProfile
                                    }
                                  />
                                ) : (
                                  '')}
              </div>
              
              <div className="custom-upload">
                {/* <input
                  type="file"
                //  onChange={this.handleImageChange.bind(this, 2)}
                  accept="image/*"
                  value=""
                /> */}
                <span className="icon-camera icon icon" />     
                              
                    
              </div>
            </div>
          </div>
          <Link to="/video">Add Video Introduction </Link> 
          <div className="container main">
            <div className="profile-sidebar">
              <div className="profile-pic--wrapper">
                <div className="profile-pic">
                  {!this.state.profileImage ? (
                    <div className="pp-default">
                      <span className="icon-user_default2" />
                    </div>
                  ) : (
                    // <Img
                    //   src={this.state.profileImage}
                    //   default="../../assets/img/svg-loaders/three-dots.svg"
                    // />
                    <img src={this.state.profileImage} alt="" />
                  )}

                  <div
                    className="loader"
                    style={
                      this.state.loader1 === true
                        ? { visibility: 'visible' }
                        : { visibility: 'hidden' }
                    }
                  >
                    <img
                      src="../../assets/img/svg-loaders/three-dots.svg"
                      width="50"
                      alt="loader"
                    />
                  </div>

                  <div className="editProfile--wrapper">
                    <div className="editProfile">
                      <input
                        type="file"
                    //    onChange={this.handleImageChange.bind(this, 1)}
                        accept="image/*"
                        value=""
                      />
                      <span className="icon-camera icon" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-analytical--data profile-sidebar--box">
                <div className="table-responsive  profile-analytical-table--wrapper">
                  <table className="table profile-analytical-table small mb-0">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Accomplishments</strong>
                        </td>
                        <td className="tableValue">
                          {this.state.accomplishments}
                        </td>
                      </tr>
                      {/* <tr>
                        <td>
                          <strong>Endorsements</strong>
                        </td>
                        <td className="tableValue">
                          {this.state.endorsements}
                        </td>
                      </tr> */}
                      <tr>
                        <td>
                          <strong>Recommendations</strong>
                        </td>
                        <td className="tableValue">
                          {this.state.recommendations}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <SpiderChart
                  userId={this.props.user.userId}
                  sharedId="0"
                  path="/student/profile"
                /> */}
              </div>             
            </div>

            <div className="profileBox--mainContent">
              <ul className="myProfileInfo--wrapper">
                {/* SUMMARY SECTION START */}
                {this.state.achievementData &&
                this.state.achievementData.length > 0 ? (
                  <li className="myProfileInfo--item">
                    <div className="title--with--border">
                      <p>Resume Headline</p>
                    </div>

                    <div className="myProfileInfo--item--box">
                      {!this.state.summary &&
                      this.state.contentEditable === false ? (
                        <div className="centeredBox content p-2">
                          <Button
                            bsStyle="primary"
                            className="animated animated-top"
                            onClick={this.contentEditable}
                          >
                            Add Headline
                          </Button>
                        </div>
                      ) : this.state.contentEditable === true ? (
                        <div className="centeredBox content content--editable p-2">
                          <div className="editableFormControl animated a--top">
                            <FormControl
                              componentClass="textarea"
                              placeholder="Enter Here"
                              name="summary"
                              value={this.state.summary}
                              onChange={this.handleChange}
                              onBlur={this.submitData}
                              autoFocus={true}
                              maxLength="500"
                            />
                          </div>
                        </div>
                      ) : this.state.summary !== '' &&
                      this.state.contentEditable === false ? (
                        <div>
                          <div className="content-box--edit text-right">
                            <a
                              onClick={this.contentEditable}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="icon-edit_pencil icon" />
                            </a>
                          </div>
                          <p>{this.state.summary.trim()}</p>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </li>
                ) : (
                  ''
                )}


 



                   {/* Employment SECTION START */}

                  <li className="myProfileInfo--item">
                    <div className="title--with--border">
                      <p>IT Skills</p>
                    </div>

                  <div className="myProfileInfo--item--box">
                    <div className="centeredBox content p-2">
                    <a  onClick={this.showSkillsComponent.bind(
                            this                            
                          )}
                          className={                           
                              'btn btn-primary with-icon smallBtn mr-1'                            
                          }
                          style={{ cursor: 'pointer' }}>
                          {' '}
                          <span className="icon-plus" /> Add Skills
                        </a>
                       
                          {this.state.showSkillsComponent ==

                              true ? (
                                <AddInterviewerSkills
                                  closeSkillsComponent={
                                    this.showSkillsComponent
                                  }                               
                                  skillsDetail={
                                    this.state.skillsDetail
                                  }
                                />
                              ) : (
                                '')}
                                  </div>
                            
                             {this.state.skillsListData && this.state.skillsListData.map((data, index) => (
                                  <div key={index} className="relative--box">
                                  <ul>
                                 <li> {data.rating}</li>                                
                                </ul>
                                  <div className="content-box--edit text-left">
                                    <a
                                      onClick={this.editSkillsComponent.bind(
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
                    </div>
                  </li>
                 
                              

         
              </ul>
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
)(EditInterviewerProfile);
