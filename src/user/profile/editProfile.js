import React, { Component } from 'react';
import Header from '../header/header';
import {
  Breadcrumb,
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
import DownloadLink from 'react-download-link';
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
  dirName: 'photos' /* optional */,
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: 'AKIAJHHM3PCJ25PK6OWQ',
  secretAccessKey: 'fTo0CpSivV7OWo2TrFGNUaA5E6ST1pB9Pwnsp5HB'
};
var settings = null;

const skills1 = [
  { label: 'Developer', value: 1 },
  { label: 'React Developer', value: 2 }
];

class EditProfile extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      showEmploymentComponent: false,
      showSkillsComponent: false,
      showProjectComponent: false,
      showPCareerProfileComponent: false,
      showVideoComponent: false,
      showEducationComponent: false,
      educationDetail: {},
      employmentDetail: {},
      skillsDetail: {},
      projectDetail: {},
      careerProfileDetail: {},
      loader1: false,
      loader2: false,
      imageSource: '',
      employmentListData: [],
      skillsListData: [],
      projectListData: [],
      userData: {},
      showDropdown: false,
      isActive: 'true',
      contentEditable: false,
      editName: false,
      name: '',
      editTagLine: false,
      profileRoleList: [],
      userProfile: {}
    };
    // this.textInput = React.createRef();
  }

  componentWillMount() {
    let user = this.props.otherUser ? this.props.otherUser : this.props.user;

    if (user) {
      let userId = user.userId;
      this.getEmploymentData(userId);
      this.getUserDetails(userId);
      this.getSkillsData(userId);
      this.getProjectsData(userId);
      this.getCareerProfileData(userId);
      this.getUserProfileData(userId);
      this.setProfileData(user);
      this.setState({ userId: userId, user: user });
    }
    this.uploadImageToAzure = this.uploadImageToAzure.bind(this);
  }

  componentWillReceiveProps(res) {
    this.setProfileData(res.user);
  }

  componentDidMount() {}

  setProfileData = data => {
    //console.log(data);
    if (data) {
      let userId = data.userId;
      let summary = data.summary;
      let firstName = data.firstName;
      let lastName = data.lastName;
      // let tagline = data.tagline.trim();
      // let editTag = data.tagline.trim();
      let email = data.email;
      let tagline = data.tagline ? data.tagline.trim() : null;
      let editTag = data.tagline ? data.tagline.trim() : null;

      let name =
        (data.firstName ? data.firstName : '') +
        ' ' +
        (data.lastName ? data.lastName : '');
      let profileImage = data.profilePicture;
      if (profileImage) {
        profileImage = profileImage; //getThumbImage('medium', profileImage);
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
  getUserDetails(userId) {
    theRapidHireApiService('getUserDetails', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          let userData = this.state.userData;
          userData = response.data.result[0];
          this.setState({ userData: userData });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getEmploymentData(userId) {
    theRapidHireApiService('getEmploymentListById', { userId })
      .then(response => {
        console.log(response);
        if (response.data.status === 'Success') {
          let employmentListData = this.state.employmentListData;
          employmentListData = response.data.result;
          this.setState({ employmentListData: employmentListData });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getSkillsData(userId) {
    theRapidHireApiService('getUserSkillsById', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          console.log(response.data);
          let skillsListData = this.state.skillsListData;
          let skillsDetail = response.data.result[0];
          skillsListData = skillsDetail ? skillsDetail.skills : [];
          this.setState({ skillsListData, skillsDetail });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getProjectsData(userId) {
    theRapidHireApiService('getProjectListById', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          let projectListData = this.state.projectListData;
          projectListData = response.data.result;
          this.setState({ projectListData: projectListData });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCareerProfileData(userId) {
    theRapidHireApiService('getDesiredProfileListById', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          let careerProfileListData = this.state.careerProfileListData;
          careerProfileListData = response.data.result[0];
          this.setState({ careerProfileListData: careerProfileListData });
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

  getUserProfileData(userId) {
    theRapidHireApiService('getUserSkillsById', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          let userProfile = response.data.result[0];
          if (userProfile) {
            let profileRole =
              userProfile.profileRole &&
              userProfile.profileRole[0] &&
              userProfile.profileRole[0].profileRole
                ? userProfile.profileRole[0].profileRole
                : [];
            let experience = userProfile.experienceInYear;
            let mobileNo = userProfile.mobileNo;
            let currentLocation = userProfile.currentLocation;
            let videoLink = userProfile.videoLink;
            this.setState({
              userProfile: userProfile,
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
    console.log('data ', data);
    if (data) {
      this.setState({
        userProfileId: data.userProfileId,
        skills: data.skills,
        year: data.experienceInYear,
        month: data.experienceInMonth,
        location: data.currentLocation,
        mobileNo: data.mobileNo,
        resumeURL: data.resumeURL,
        resumeName: data.resumeName,
        profileRole: data.profileRole[0].profileRoleId
      });
    }
  };

  //Show Component Section
  showEducationComponent = event => {
    this.setState({
      showEducationComponent: !this.state.showEducationComponent
    });
    if (!this.state.showEducationComponent) {
      this.setState({ educationDetail: null });
      //this.getEducationData(this.state.userId);
    }
  };

  //Show Component Section
  showEmploymentComponent = event => {
    this.setState({
      showEmploymentComponent: !this.state.showEmploymentComponent
    });
    if (!this.state.showEmploymentComponent) {
      this.setState({ employmentDetail: null });
      this.getEmploymentData(this.state.userId);
    }
  };

  showSkillsComponent = event => {
    this.setState({
      showSkillsComponent: !this.state.showSkillsComponent
    });

    if (!this.state.showSkillsComponent) {
      //  this.setState({skillsDetail :  null});
      this.getSkillsData(this.state.userId);
    }
  };

  showSkillsComponent = event => {
    this.setState({
      showSkillsComponent: !this.state.showSkillsComponent
    });

    if (!this.state.showSkillsComponent) {
      //  this.setState({skillsDetail :  null});
      this.getSkillsData(this.state.userId);
    }
  };

  showPersonalProfileComponent = event => {
    this.setState({
      showPersonalProfileComponent: !this.state.showPersonalProfileComponent
    });

    if (!this.state.showPersonalProfileComponent) {
      //  this.setState({skillsDetail :  null});
      this.getSkillsData(this.state.userId);
    }
  };

  showProjectComponent = event => {
    this.setState({
      showProjectComponent: !this.state.showProjectComponent
    });

    if (!this.state.showProjectComponent) {
      this.setState({ projectDetail: null });
      this.getProjectsData(this.state.userId);
    }
  };

  showCareerProfileComponent = event => {
    this.setState({
      showCareerProfileComponent: !this.state.showCareerProfileComponent
    });

    if (!this.state.showCareerProfileComponent) {
      this.setState({ careerProfileDetail: null });
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
      educationDetail: educationDetail,
      showEducationComponent: !this.state.showEducationComponent
    });
  };

  editEmploymentComponent = employmentDetail => {
    console.log(employmentDetail);
    this.setState({
      employmentDetail: employmentDetail,
      showEmploymentComponent: !this.state.showEmploymentComponent
    });
  };

  editSkillsComponent = skillsDetail => {
    this.setState({
      skillsDetail: skillsDetail,
      showSkillsComponent: !this.state.showSkillsComponent
    });
  };

  editProjectComponent = projectDetail => {
    console.log(projectDetail);
    this.setState({
      projectDetail: projectDetail,
      showProjectComponent: !this.state.showProjectComponent
    });
  };

  editCareerProfileComponent = careerProfileDetail => {
    console.log(careerProfileDetail);
    this.setState({
      careerProfileDetail: careerProfileDetail,
      showCareerProfileComponent: !this.state.showCareerProfileComponent
    });
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
      S3FileUpload.uploadFile(file, config)
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
    S3FileUpload.uploadFile(event.target.files[0], config).then(data => {
      let userId = this.state.userId;
      let profilePicture = data.location;
      let profileData = {
        userId,
        profilePicture
      };
      this.props.actionUpdateUserInfo({ profilePicture });
      theRapidHireApiService('updateProfileImage', profileData);
    });
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
  uploadFiles = event => {
    console.log(event.target.files[0]);
    let fileName = event.target.files[0].name;
    S3FileUpload.uploadFile(event.target.files[0], config)
      .then(data => {
        let sendData = {
          userProfileId: this.state.userProfileId,
          userId: this.state.userId,
          resumeURL: data.location,
          resumeName: fileName
        };
        console.log(data);
        theRapidHireApiService('addResume', sendData)
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
  };

  DeleteFile = event => {
    S3FileUpload.deleteFile(this.state.resumeName, config)
      .then(response => {
        console.log(response);
        let sendData = {
          userProfileId: this.state.userProfileId,
          userId: this.state.userId,
          resumeURL: null,
          resumeName: null
        };

        theRapidHireApiService('addResume', sendData)
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
  };

  render() {
    return (
      <div className="wrapper">
        <Header {...this.props} />
        <main>
          {/* <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />  */}
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Profile</Breadcrumb.Item>
            </Breadcrumb>
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

            <div className="">
              <div className="row">
                <div className="col-sm-4">
                  <div className="card">
                    <div className="card_head pb-0 border-bottom-0 text-center">
                      <div className="img_viewer">
                        <img
                          className="img-responsive"
                          src={this.state.profileImage}
                          alt="Avatar"
                        />
                        <div className="edit_icon">
                          <input
                            type="file"
                            onChange={this.handleImageChange.bind(this, 1)}
                            accept="image/*"
                            value=""
                          />
                          <span className="icon-camera icon" />
                        </div>
                      </div>
                    </div>
                    <div className="card_body">
                      <p>
                        <i className="fa fa-user fa-fw mr-3"></i>
                        {this.state.firstName} {this.state.lastName}
                      </p>
                      <p>
                        <i className="fa fa-briefcase fa-fw mr-3"></i>
                        {this.state.profileRole}
                      </p>
                      <p>
                        <i className="fa fa-home fa-fw mr-3"></i>
                        London, UK
                      </p>
                      <p>
                        <i className="fa fa-envelope fa-fw mr-3"></i>
                        {this.state.email}
                      </p>
                      <p>
                        <i className="fa fa-phone fa-fw mr-3"></i>
                        {this.state.mobileNo}
                      </p>
                      <p>
                        {this.state.profileRole ? (
                          <Button
                            bsStyle="primary no-bold no-round mr-1"
                            onClick={this.showPersonalProfileComponent.bind(
                              this
                            )}
                          >
                            <span className="icon-share2" />
                            Add Information
                          </Button>
                        ) : (
                          <Button
                            onClick={this.showPersonalProfileComponent.bind(
                              this
                            )}
                            className="btn btn-white with-icon"
                          >
                            <span className="icon-share2" />
                            Add Information
                          </Button>
                        )}

                        {this.state.showPersonalProfileComponent == true ? (
                          <AddPersonalProfile
                            closePersonalProfileComponent={
                              this.showPersonalProfileComponent
                            }
                            user={this.state.user}
                            userProfile={this.state.userProfile}
                          />
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-sm-8">
                  {this.state.videoLink ? null : (
                    <div className="w3-container w3-card w3-white w3-margin-bottom">
                      <div className="centerButton">
                        <Link
                          target="_blank"
                          style={{ color: 'blue' }}
                          to="/video"
                        >
                          Add Video Introduction{' '}
                        </Link>
                      </div>
                      <div className="w3-container">
                        <h5 className="w3">
                          <b></b>
                        </h5>
                        <p></p>
                      </div>
                    </div>
                  )}

                  <div className="card">
                    <div className="card_head">
                      <h4>Resume</h4>
                    </div>
                    <div className="card_body">
                      <div className="upload_file">
                        <div className="upload_icon">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={this.uploadFiles.bind(this)}
                          />
                          <i className="fa fa-cloud-upload"></i>
                        </div>
                        <div>
                          <a>{this.state.resumeName}</a>
                        </div>
                      </div>
                    </div>
                    <div className="card_footer">
                      {this.state.resumeURL ? (
                        <DownloadLink
                          className="btn btn-success"
                          filename={this.state.resumeURL}
                          exportFile={() => 'My cached data'}
                        >
                          Link to download
                        </DownloadLink>
                      ) : null}{' '}
                      {this.state.resumeURL ? (
                        <a
                          className="btn btn-danger"
                          onClick={this.DeleteFile.bind(this)}
                        >
                          Delete Resume
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="card">
                    <div className="card_head">
                      <div className="clearfix">
                        <h4 className="pull-left">Education</h4>
                        <div className="pull-right">
                          <Button
                            bsStyle="primary no-bold no-round mr-1"
                            className="no-bold no-round"
                            // disabled={isLoading}
                            onClick={this.showEducationComponent.bind(this)}
                          >
                            {' '}
                            Add Education
                          </Button>
                          {this.state.showEducationComponent == true ? (
                            <Education
                              closeEducationComponent={
                                this.showEducationComponent
                              }
                              user={this.state.user}
                              educationMode={this.state.educationDetail}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card_body">
                      <ul className="list-unstyled mb-0">
                        {this.state.employmentListDeducationListData &&
                          this.state.educationListData.map((data, index) => (
                            <li className="w3-container">
                              <h5 className="w3-opacity">
                                <b></b>
                                <a
                                  onClick={this.editEducationComponent.bind(
                                    this,
                                    data
                                  )}
                                >
                                  <span className="pe-7s-pen" />
                                </a>
                              </h5>
                              <h6 className="w3-text-teal">
                                <i className="fa fa-calendar fa-fw w3-margin-right"></i>
                                {moment(parseInt(data.startDate, 10)).format(
                                  'DD-MMM-YYYY'
                                ) + ' '}{' '}
                                to
                                {data.endDate ? (
                                  ' ' +
                                  moment(parseInt(data.endDate, 10)).format(
                                    'DD-MMM-YYYY'
                                  )
                                ) : (
                                  <span className="w3-tag w3-teal w3-round">
                                    Present
                                  </span>
                                )}
                              </h6>
                              <p>Lorem ipsum dolor sit amet.</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="card">
                    <div className="card_head">
                      <div className="clearfix">
                        <h4 className="pull-left">Work Experience</h4>
                        <div className="pull-right">
                          <Button
                            bsStyle="primary"
                            // disabled={isLoading}
                            onClick={this.showEmploymentComponent.bind(this)}
                          >
                            {' '}
                            Add Experience
                          </Button>
                          {this.state.showEmploymentComponent == true ? (
                            <AddEmployment
                              closeEmploymentComponent={
                                this.showEmploymentComponent
                              }
                              user={this.state.user}
                              employmentDetail={this.state.employmentDetail}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card_body">
                      <ul className="features_listing list-unstyled mb-0">
                        {this.state.employmentListData &&
                          this.state.employmentListData.map((data, index) => (
                            <li className="w3-container">
                              <h5 className="w3-opacity">
                                <b>
                                  {data.designation} / {data.organisation}
                                </b>
                                <a
                                  onClick={this.editEmploymentComponent.bind(
                                    this,
                                    data
                                  )}
                                >
                                  <span className="pe-7s-pen" />
                                </a>
                              </h5>
                              <h6 className="w3-text-teal">
                                <i className="fa fa-calendar fa-fw w3-margin-right"></i>
                                {moment(parseInt(data.startDate, 10)).format(
                                  'DD-MMM-YYYY'
                                ) + ' '}{' '}
                                to
                                {data.endDate ? (
                                  ' ' +
                                  moment(parseInt(data.endDate, 10)).format(
                                    'DD-MMM-YYYY'
                                  )
                                ) : (
                                  <span className="w3-tag w3-teal w3-round">
                                    Present
                                  </span>
                                )}
                              </h6>
                              <p></p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="card">
                    <div className="card_head">
                      <div className="clearfix">
                        <h4 className="pull-left">Skills</h4>
                        <div className="pull-right">
                          <Button
                            bsStyle="primary"
                            // disabled={isLoading}
                            onClick={this.showSkillsComponent.bind(this)}
                          >
                            {' '}
                            Add Skills
                          </Button>
                          {this.state.showSkillsComponent == true ? (
                            <AddSkills
                              closeSkillsComponent={this.showSkillsComponent}
                              user={this.state.user}
                              skillsDetail={this.state.skillsDetail}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card_body">
                      <ul className="list-unstyled mb-0">
                        {this.state.skillsListData &&
                          this.state.skillsListData.map((data, index) => (
                            <li className="w3-container">
                              <h5 className="w3-opacity">
                                <b>
                                  {data.skillName} / {data.rating}
                                </b>
                                <a
                                  onClick={this.editSkillsComponent.bind(
                                    this,
                                    data
                                  )}
                                >
                                  <span className="pe-7s-pen" />
                                </a>
                              </h5>
                              <p>Lorem ipsum dolor sit amet.</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Project */}
                  <div className="card">
                    <div className="card_head">
                      <div className="clearfix">
                        <h4 className="pull-left">Project</h4>
                        <div className="pull-right">
                          <Button
                            bsStyle="primary"
                            // disabled={isLoading}
                            onClick={this.showProjectComponent.bind(this)}
                          >
                            {' '}
                            Add Project
                          </Button>
                          {this.state.showProjectComponent == true ? (
                            <AddProject
                              closeProjectComponent={this.showProjectComponent}
                              user={this.state.user}
                              projectDetail={this.state.projectDetail}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card_body">
                      <ul className="list-unstyled">
                        {this.state.projectListData &&
                          this.state.projectListData.map((data, index) => (
                            <li className="w3-container">
                              <h5 className="w3-opacity">
                                <b>
                                  {data.projectName} / {data.associatedWith}
                                </b>
                                <a
                                  onClick={this.editProjectComponent.bind(
                                    this,
                                    data
                                  )}
                                >
                                  <span className="pe-7s-pen" />
                                </a>
                              </h5>
                              <h6 className="w3-text-teal">
                                <i className="fa fa-calendar fa-fw w3-margin-right"></i>
                                {moment(parseInt(data.startDate, 10)).format(
                                  'DD-MMM-YYYY'
                                ) + ' '}{' '}
                                to
                                {data.endDate ? (
                                  ' ' +
                                  moment(parseInt(data.endDate, 10)).format(
                                    'DD-MMM-YYYY'
                                  )
                                ) : (
                                  <span className="w3-tag w3-teal w3-round">
                                    Present
                                  </span>
                                )}
                              </h6>
                              <p>Lorem ipsum dolor sit amet.</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Desired Career Profile */}
                  <div
                    className="w3-container w3-card w3-white"
                    style={{ 'margin-bottom': '200px' }}
                  >
                    <div className="centerButton">
                      {this.state.careerProfileListData ? null : (
                        <Button
                          bsStyle="primary no-bold no-round mr-1"
                          className="no-bold no-round"
                          // disabled={isLoading}
                          onClick={this.showCareerProfileComponent.bind(this)}
                        >
                          {' '}
                          Add Career
                        </Button>
                      )}
                      {this.state.showCareerProfileComponent == true ? (
                        <AddCareerProfile
                          closeCareerProfileComponent={
                            this.showCareerProfileComponent
                          }
                          user={this.state.user}
                          careerProfileDetail={this.state.careerProfileDetail}
                        />
                      ) : (
                        ''
                      )}
                    </div>

                    <div>
                      <span
                        style={{
                          'font-weight': 600,
                          'font-size': '20px',
                          color: '#333'
                        }}
                      >
                        <i className="fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>
                      </span>

                      <span class="edit icon" tabindex="0">
                        <a
                          onClick={this.editCareerProfileComponent.bind(
                            this,
                            this.state.careerProfileListData
                          )}
                        >
                          <span className="pe-7s-pen" />
                        </a>
                      </span>
                    </div>

                    <div className="w3-container">
                      <h5 className="w3-opacity">
                        <b>
                          {this.state.careerProfileListData &&
                            this.state.careerProfileListData.desiredLocation}
                        </b>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      /* // <div>

// <div class="banner-section">
//          <div class="container">
//             <div class="row">
//                <div class="col-md-12">
//                   <div class="profile-img-desc">
//                      <div class="row">
//                         <div class="col-md-2 text-center">
//                            <div class="profile-img">
//                               <img src="img/profile-img.png"/>
//                               <div class="camera">
//                                  <a href="#"><i class="fas fa-camera-retro"></i></a>
//                               </div>
//                            </div>
//                            <div class="profile-name">
//                               <h2>Profile Name <span><a href="#"><i class="fas fa-pencil-alt"></i></a></span></h2>
//                               <p>profile and company name</p>
//                            </div>
//                         </div>
//                         <div class="col-md-6">
//                            <div class="row">
//                               <div class="col-sm-6">
//                                  <div class="profile-dtls">
//                                     <span><i class="fas fa-map-marker-alt"></i></span>
//                                     <span class="pr-txt">Indore India</span>
//                                  </div>
//                                  <div class="profile-dtls">
//                                     <span><i class="fas fa-briefcase"></i></span>
//                                     <span class="pr-txt">2 Years</span>
//                                  </div>
//                                  <div class="profile-dtls">
//                                     <span><i class="fas fa-money-check"></i></span>
//                                     <span class="pr-txt">2.5 Lac per anuum</span>
//                                  </div>
//                               </div>
//                               <div class="col-sm-6">
//                                  <div class="profile-dtls">
//                                     <span><i class="fas fa-phone"></i></span>
//                                     <span class="pr-txt">0123-456-789</span>
//                                  </div>
//                                  <div class="profile-dtls">
//                                     <span><i class="far fa-envelope"></i></span>
//                                     <span class="pr-txt">info@gmail.com</span>
//                                  </div>
//                               </div>
//                            </div>
//                            <div class="progres-bar">
//                               <span>profile streanth</span>
//                               <span class="percent">50%</span>
//                               <div class="progress-line">
//                                  <div class="top-line"></div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                </div>
//             </div>
//          </div>
//       </div>
//       <div class="main-area">
//          <div class="container">
//             <div class="row">
//                <div class="col-md-3">
//                   <div class="left-side-bar">
//                     <div class="side-heading">
//                        <a href="#one" class="nav-link scroll">Attached Resume</a>
//                     </div>
//                     <div class="side-heading">
//                        <a href="#two" class="nav-link scroll">Attached Resume</a>
//                     </div>
//                     <div class="side-heading">
//                        <a href="#three" class="nav-link scroll">Attached Resume</a>
//                     </div>
//                   </div>
//                </div>
//                <div class="col-md-9">
//                   <div class="resumee-att" id="one">
//                      <h3>Attach Resume</h3>
//                      <p>Resume is the most important document recruiters look for. Recruiters generally do not look at profiles without resumes.</p>
//                      <div class="add-resume">
//                         <div class="row">
//                            <div class="col-sm-8">
//                               <div class="res-doc">
//                                  <strong>my resume.doc -</strong>  Uploaded on May 20, 2019
//                                  <div class="download">
//                                     <a href="#">
//                                     <i class="fas fa-download"></i>
//                                     </a>
//                                     <div class="del-opt">
//                                        <a href="#">DELETE RESUME</a>
//                                     </div>
//                                  </div>
//                               </div>
//                            </div>
//                            <div class="col-sm-4">
//                               <div class="upload-opt">
//                                  <button type="button" class="btn btn-primary">Update Resume</button>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                   <div class="resumee-att" id="two">
//                      <div class="head-text">
//                         <h3>Resume Heading</h3>
//                         <p>Resume is the most important document recruiters look for. Recruiters generally...</p>
//                      </div>
//                      <div class="right-edit-opt"><a href="#"  data-toggle="modal" data-target="#myModal"><i class="fas fa-pencil-alt"></i></a></div>
//                   </div>
//                   <div class="resumee-att" id="three">
//                      <div class="head-text">
//                         <h3>Key Skills</h3>
//                      </div>
//                      <div class="right-edit-opt"><a href="#" data-toggle="modal" data-target="#myModal2"><i class="fas fa-pencil-alt"></i></a></div>
//                      <div class="sub-list">
//                         <ul>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                            <li>Corel Draw</li>
//                         </ul>
//                      </div>
//                      <div class="modal fade" id="myModal2">
//                         <div class="modal-dialog modal-dialog-centered">
//                            <div class="modal-content">
                             
//                               <div class="modal-header">
//                                  <h4 class="modal-title">Add Skills</h4>
//                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
//                               </div>
                            
//                               <div class="modal-body">
//                                  <div class="form area">
//                                     <form class="form-inline" action="/action_page.php">
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="email2" class="mb-2 mr-sm-2">Add Skills:</label>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Enter email" name="email"/>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="pwd2" class="mb-2 mr-sm-2">Roll:</label>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="pwd2" placeholder="Enter password" name="pswd"/>
//                                           </div>
//                                        </div>
//                                     </form>
//                                  </div>
                              
//                                  <div class="modal-footer">
//                                     <button type="button" class="btn btn-secondary save-btn">Save</button>
//                                     <button type="button" class="btn btn-primary close-btn" data-dismiss="modal">Close</button>
//                                  </div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                   <div class="resumee-att">
//                      <div class="head-text">
//                         <h3>Employement</h3>
//                      </div>
//                      <div class="right-edit-opt"><a href="#">Add Employement</a></div>
//                      <div class="head-text">
//                         <h5>Web Developer</h5>
//                         <p>Resume is the most important document recruiters look for. Recruiters generally...</p>
//                      </div>
//                      <div class="right-edit-opt"><a href="#" data-toggle="modal" data-target="#myModal1"><i class="fas fa-pencil-alt"></i></a></div>
//                      <div class="modal fade" id="myModal1">
//                         <div class="modal-dialog modal-dialog-centered">
//                            <div class="modal-content">                             
//                               <div class="modal-header">
//                                  <h4 class="modal-title">Add Employement</h4>
//                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
//                               </div>                             
//                               <div class="modal-body">
//                                  <div class="form area">
//                                     <form class="form-inline" action="/action_page.php">
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="email2" class="mb-2 mr-sm-2">Designation:</label>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Enter email" name="email"/>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="pwd2" class="mb-2 mr-sm-2">Add Organisation:</label>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="pwd2" placeholder="Enter password" name="pswd"/>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <p>Is this your current company ?</p>
//                                              <div class="form-check-inline">
//                                                 <label class="form-check-label" for="check1">
//                                                 <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                 </label>
//                                                 <span>Yes</span>
//                                              </div>
//                                              <div class="form-check-inline">
//                                                 <label class="form-check-label" for="check2">
//                                                 <input type="checkbox" class="form-check-input" id="check2" name="vehicle2" value="something"/>
//                                                 </label>
//                                                 <span>No</span>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <label for="sel1">Date:</label><br></br>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                 </select>
//                                              </div>
//                                           </div>
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1">to</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1">From to Date</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1">to</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="exampleFormControlTextarea1">Discription</label><br></br>
//                                              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Here"></textarea>
//                                           </div>
//                                        </div>
                                      
//                                        <div class="modal-footer">
//                                           <button type="button" class="btn btn-secondary save-btn">Save</button>
//                                           <button type="button" class="btn btn-primary close-btn" data-dismiss="modal">Close</button>
//                                        </div>
//                                     </form>
//                                  </div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                   <div class="resumee-att">
//                      <div class="head-text">
//                         <h3>Education</h3>
//                      </div>
//                      <div class="right-edit-opt"><a href="#" data-toggle="modal" data-target="#myModal3">Add Education</a></div>
//                      <div class="resume-text-inn">
//                         <div class="head-text">
//                            <h5>B.Tech/B.E.- Branch</h5>
//                            <p>Education details here...</p>
//                         </div>
//                         <div class="right-edit-opt"><a href="#"><i class="fas fa-pencil-alt"></i></a></div>
//                      </div>
//                      <div class="resume-text-inn">
//                         <div class="head-text">
//                            <h5>B.Tech/B.E.- Branch</h5>
//                            <p>Education details here...</p>
//                         </div>
//                         <div class="right-edit-opt"><a href="#"><i class="fas fa-pencil-alt"></i></a></div>
//                      </div>
//                      <div class="resume-text-inn">
//                         <div class="head-text">
//                            <h5>Madhy Pradesh - English</h5>
//                            <p>Year of passing</p>
//                         </div>
//                         <div class="right-edit-opt"><a href="#"><i class="fas fa-pencil-alt"></i></a></div>
//                      </div>
//                   </div>
//                   <div class="resumee-att">
//                      <div class="head-text">
//                         <h3>Projects</h3>
//                      </div>
//                      <div class="right-edit-opt"><a href="#" data-toggle="modal" data-target="#myModal4">Add Projects</a></div>
//                      <div class="resume-text-inn">
//                         <div class="head-text">
//                            <h5>projects</h5>
//                            <p>projects details here...</p>
//                         </div>
//                         <div class="right-edit-opt"><a href="#"><i class="fas fa-pencil-alt"></i></a></div>
//                      </div>
//                      <div class="modal fade" id="myModal4">
//                         <div class="modal-dialog modal-dialog-centered">
//                            <div class="modal-content">
                             
//                               <div class="modal-header">
//                                  <h4 class="modal-title">Add Prjects</h4>
//                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
//                               </div>
                            
//                               <div class="modal-body">
//                                  <div class="form area">
//                                     <form class="form-inline" action="/action_page.php">
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="email2" class="mb-2 mr-sm-2">Project Name:</label>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Enter email" name="email"/>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <label for="sel1">From Date:</label><br></br>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                    <option>Grade</option>
//                                                 </select>
//                                              </div>
//                                           </div>
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1"></label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1">Date To</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                           <div class="col-sm-6">
//                                              <div class="select-area">
//                                                 <div class="select-area">
//                                                    <label for="sel1">to</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Year Of Passing</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                       <option>2019</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <div class="form-check-inline">
//                                                 <label class="form-check-label" for="check1">
//                                                 <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                 </label>
//                                                 <span>Is this your current company ?</span>
//                                              </div>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="exampleFormControlTextarea1">Discription</label><br></br>
//                                              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Here"></textarea>
//                                           </div>
//                                        </div>
//                                        <div class="row">
//                                           <div class="col-sm-12">
//                                              <label for="exampleFormControlTextarea1">Project URL</label><br></br>
//                                              <input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Project URL" name="email"/>
//                                           </div>
//                                        </div>                                      
//                                        <div class="modal-footer">
//                                           <button type="button" class="btn btn-secondary save-btn">Save</button>
//                                           <button type="button" class="btn btn-primary close-btn" data-dismiss="modal">Close</button>
//                                        </div>
//                                     </form>
//                                  </div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                   <div class="resumee-att">
//                      <div class="head-text">
//                         <h3>Desire Career</h3>
//                      </div>
//                      <div class="right-edit-opt"><a href="#" data-toggle="modal" data-target="#myModal5">Add Career</a></div>
//                      <div class="career-dtls">
//                         <div class="row">
//                            <div class="col-sm-6">
//                               <div class="des-carr">
//                                  <div class="carr-head">Industry</div>
//                                  <p>Add Industry</p>
//                               </div>
//                            </div>
//                            <div class="col-sm-6">
//                               <div class="des-carr">
//                                  <div class="carr-head">Industry</div>
//                                  <p>Add Industry</p>
//                               </div>
//                            </div>
//                            <div class="col-sm-6">
//                               <div class="des-carr">
//                                  <div class="carr-head">Industry</div>
//                                  <p>Add Industry</p>
//                               </div>
//                            </div>
//                            <div class="col-sm-6">
//                               <div class="des-carr">
//                                  <div class="carr-head">Industry</div>
//                                  <p>Add Industry</p>
//                               </div>
//                            </div>
//                         </div>
//                         <div class="modal fade" id="myModal5">
//                            <div class="modal-dialog modal-dialog-centered">
//                               <div class="modal-content">
                                
//                                  <div class="modal-header">
//                                     <h4 class="modal-title">Add Career Details</h4>
//                                     <button type="button" class="close" data-dismiss="modal">&times;</button>
//                                  </div>
                               
//                                  <div class="modal-body">
//                                     <div class="form area">
//                                        <form class="form-inline" action="/action_page.php">
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <label for="email2" class="mb-2 mr-sm-2">Industry:</label>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Industry</option>
//                                                    <option>Industry</option>
//                                                 </select>
//                                              </div>
//                                           </div>
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <label for="pwd2" class="mb-2 mr-sm-2">Functional Area:</label>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Functional Area</option>
//                                                    <option>Functional Area</option>
//                                                 </select>
//                                              </div>
//                                           </div>
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <div class="select-area">
//                                                    <label for="sel1">Roll:</label><br></br>
//                                                    <select class="form-control" id="sel1" name="sellist1">
//                                                       <option>Roll</option>
//                                                       <option>Roll</option>
//                                                       <option>Roll</option>
//                                                       <option>Roll</option>
//                                                    </select>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <p>Job Title</p>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check1">
//                                                    <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                    </label>
//                                                    <span>Permanent</span>
//                                                 </div>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check2">
//                                                    <input type="checkbox" class="form-check-input" id="check2" name="vehicle2" value="something"/>
//                                                    </label>
//                                                    <span>Contractual</span>
//                                                 </div>
//                                                 <p>Employment Type</p>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check1">
//                                                    <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                    </label>
//                                                    <span>Full Time</span>
//                                                 </div>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check2">
//                                                    <input type="checkbox" class="form-check-input" id="check2" name="vehicle2" value="something"/>
//                                                    </label>
//                                                    <span>Part Time</span>
//                                                 </div>
//                                                 <p>Preffered Shift</p>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check1">
//                                                    <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                    </label>
//                                                    <span>Day</span>
//                                                 </div>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check2">
//                                                    <input type="checkbox" class="form-check-input" id="check2" name="vehicle2" value="something"/>
//                                                    </label>
//                                                    <span>Night</span>
//                                                 </div>
//                                                 <p>Salery</p>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check1">
//                                                    <input type="checkbox" class="form-check-input" id="check1" name="vehicle1" value="something" checked/>
//                                                    </label>
//                                                    <span>Indian</span>
//                                                 </div>
//                                                 <div class="form-check-inline">
//                                                    <label class="form-check-label" for="check2">
//                                                    <input type="checkbox" class="form-check-input" id="check2" name="vehicle2" value="something"/>
//                                                    </label>
//                                                    <span>Doller</span>
//                                                 </div>
//                                              </div>
//                                           </div>
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <label for="pwd2" class="mb-2 mr-sm-2">Desired Location:</label>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Desired Location</option>
//                                                    <option>Desired Location</option>
//                                                 </select>
//                                              </div>
//                                           </div>
//                                           <div class="row">
//                                              <div class="col-sm-12">
//                                                 <label for="pwd2" class="mb-2 mr-sm-2">Desired Industry:</label>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Desired Industry</option>
//                                                    <option>Desired Industry</option>
//                                                 </select>
//                                              </div>
//                                           </div>
                                        
//                                           <div class="modal-footer">
//                                              <button type="button" class="btn btn-secondary save-btn">Save</button>
//                                              <button type="button" class="btn btn-primary close-btn" data-dismiss="modal">Close</button>
//                                           </div>
//                                        </form>
//                                     </div>
//                                  </div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                      <div class="modal fade" id="myModal3">
//                         <div class="modal-dialog modal-dialog-centered">
//                            <div class="modal-content">
                             
//                               <div class="modal-header">
//                                  <h4 class="modal-title">Educational Info</h4>
//                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
//                               </div>
                             
//                               <div class="modal-body">
//                                  <div class="form area">
//                                     <form class="form-inline" action="/action_page.php">
//                                        <label for="email2" class="mb-2 mr-sm-2">Insitute:</label>
//                                        <input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Enter email" name="email"/>
//                                        <label for="pwd2" class="mb-2 mr-sm-2">City:</label>
//                                        <input type="text" class="form-control mb-2 mr-sm-2" id="pwd2" placeholder="Enter password" name="pswd"/>
//                                        <div class="select-area">
//                                           <label for="sel1">Grade:</label><br></br>
//                                           <select class="form-control" id="sel1" name="sellist1">
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                           </select>
//                                        </div>
//                                        <div class="select-area">
//                                           <label for="sel1">to</label><br></br>
//                                           <select class="form-control" id="sel1" name="sellist1">
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                              <option>Grade</option>
//                                           </select>
//                                           <div class="select-area">
//                                              <div class="select-area">
//                                                 <label for="sel1">From to Date</label><br></br>
//                                                 <select class="form-control" id="sel1" name="sellist1">
//                                                    <option>Year Of Passing</option>
//                                                    <option>2019</option>
//                                                    <option>2019</option>
//                                                    <option>2019</option>
//                                                 </select>
//                                              </div>
//                                              <label for="exampleFormControlTextarea1">Discription</label><br></br>
//                                              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Here"></textarea>
//                                           </div>
//                                        </div>
                                    
//                                        <div class="modal-footer">
//                                           <button type="button" class="btn btn-secondary save-btn">Save</button>
//                                           <button type="button" class="btn btn-primary close-btn" data-dismiss="modal">Close</button>
//                                        </div>
//                                     </form>
//                                  </div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                </div>
//             </div>
//          </div>
//       </div>


// </div> */
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
