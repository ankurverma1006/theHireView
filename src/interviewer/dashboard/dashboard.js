import React, { Component } from 'react';
import Header from '../header/header';

import {
  Modal,
  DropdownButton,
  MenuItem,
  Breadcrumb,
  Row,
  Col,
  Panel
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';
import S3FileUpload from 'react-s3';
import moment from 'moment';

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

class Dashboard extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      showJobDescriptionComponent: false,
      jobDescriptionDetail: {},

      loader1: false,
      loader2: false,
      jobDescriptionListData: [],
      showVideoComponent: false,
      userData: {},
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
    let user = this.props.otherUser ? this.props.otherUser : this.props.user;

    if (user) {
      this.getSlotDetails(user.userId);
    }
  }

  componentWillReceiveProps(res) {}

  componentDidMount() {}

  getSlotDetails(userId) {
    let interviewerId = userId;
    theRapidHireApiService('getTimeSlotByInterviewer', { interviewerId })
      .then(response => {
        if (response.data.status === 'Success') {
          console.log(response);
          let bookedSlotData = [];
          bookedSlotData = response.data.result;
          this.setState({ bookedSlotData: bookedSlotData });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getUserListForMapping(jobId) {
    theRapidHireApiService('getUserListForMapping', { jobId })
      .then(response => {
        if (response.data.status === 'Success') {
          let jobDescriptionListData = this.state.jobDescriptionListData;
          jobDescriptionListData = response.data.result;

          this.setState({ jobDescriptionListData: jobDescriptionListData });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleSubmit = (data, action) => {
    let jobMapId = data.jobMapId;
    let jobId = this.state.jobId;
    let candidateId = data.userId;
    let hrId = this.state.userId;
    let status = action;
    let createdBy = this.props.user.userId;

    let dataMap = {
      jobMapId,
      jobId,
      candidateId,
      hrId,
      status,
      createdBy
    };

    if (jobMapId !== '' || jobMapId !== null) {
      theRapidHireApiService('createJobMap', dataMap)
        .then(response => {
          if (response.data.status === 'Success') {
            this.getUserListForMapping(this.state.jobId);
            //  let jobDescriptionListData= this.state.jobDescriptionListData;
            //  jobDescriptionListData= response.data.result;

            //  this.setState({jobDescriptionListData: jobDescriptionListData});
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      theRapidHireApiService('updateJobMap', dataMap)
        .then(response => {
          if (response.data.status === 'Success') {
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

  joinVideoChat = data => {
    console.log(data);

    let videoKeyClient = data.videoKeyUser;

    let videoKeySelf = data.videoKeyInterviewer;

    this.props.history.push({
      pathname: '/interviewer/videoChat',
      state: {
        videoKeySelf: videoKeySelf,
        videoKeyClient: videoKeyClient,
        slotId: data.slotId
      }
    });
  };

  editJobDescriptionComponent = jobDescriptionDetail => {
    console.log(jobDescriptionDetail);
    this.setState({
      jobDescriptionDetail: jobDescriptionDetail,
      showJobDescriptionComponent: !this.state.showJobDescriptionComponent
    });
  };

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

  render() {
    let self = this;
    return (
      <div className="wrapper">
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <Header {...this.props} />
        <main className="inner_main">
          <section className="top-banner">
            <div className="banner_overlay"></div>
            <div className="container content_inner">
              <div className="banner-title">
                <h1 className="m-0">Dashboard</h1>
              </div>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </section>
          <section className="detail_content">
            <div className="container">
              <Row>
                <Col sm={6}></Col>
                <Col sm={6}>
                  <Panel bsStyle="primary">
                    <Panel.Heading>
                      <Panel.Title componentClass="h3">
                        Weekly report
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      <div className="panel_row">
                        <div className="row_head mb-2">
                          <b>Time Slots</b>
                        </div>
                        <Row>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                        </Row>
                      </div>
                      <div className="panel_row">
                        <div className="row_head mb-2">
                          <b>Interviews</b>
                        </div>
                        <Row>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                        </Row>
                      </div>
                      <div className="panel_row">
                        <div className="row_head mb-2">
                          <b>One Way Assessments</b>
                        </div>
                        <Row>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                          <Col sm={4}>
                            <div className="analytics_number">123</div>
                            <div className="analytics_name">lorem</div>
                          </Col>
                        </Row>
                      </div>
                    </Panel.Body>
                  </Panel>
                </Col>
              </Row>
            </div>
          </section>
          <div className="w3-content main-panel1">
            <div className="container main">
              <p>shivam</p>
              {this.state.bookedSlotData &&
                this.state.bookedSlotData.map(function(data, index) {
                  return (
                    <div key={index} className="suggestion-usd">
                      <div className="student-img deflt-icon centeredBox flex">
                        Your Slot has been booked with Rapid Hire Company
                      </div>
                      <div className="student-info flex justify-content-space-between">
                        <div className="flex align-center justify-content-space-bettween p-20-30 stuBgWhite">
                          <div className="flex-1">
                            <h3>
                              {/* {data.firstName
                              ? data.firstName +
                                ' ' +
                                (data.lastName ? data.lastName : '')
                              : null} */}
                            </h3>
                            <p></p>
                            <p></p>
                          </div>

                          <div className="flex-1">
                            <h6>
                              {moment(parseInt(data.startTimeStamp, 10)).format(
                                'hh:mm:ss'
                              )}
                            </h6>
                            {moment(parseInt(data.endTimeStamp, 10)).format(
                              'hh:mm:ss'
                            )}
                          </div>

                          <div className="btn-group flex align-center">
                            <button
                              onClick={self.joinVideoChat.bind(self, data)}
                              className="btn btn-primary no-round"
                              //  onClick={self.handleClickProfile.bind(self, data)}
                            >
                              Join Video
                            </button>
                            {/* {self.state.showVideoComponent ==
                              true ? (
                                <ShowVideo
                                  closeShowVideoComponent={
                                    self.showVideoComponent
                                  }                                 
                                  videoLink={
                                    data.videoLink
                                  }
                                />
                              ) : (
                                '')} */}
                            &nbsp; &nbsp;
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
          </div>
        </main>
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
)(Dashboard);
