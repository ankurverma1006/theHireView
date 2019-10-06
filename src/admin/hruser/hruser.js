import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import theRapidHireApiService from '../../common/core/api/apiService';
import { Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import {
  setLocalStorage,
  uploadToAzure,
  getThumbImage
} from '../../common/commonFunctions';
import CONSTANTS from '../../common/core/config/appConfig';
import Header from '../header/header';
import ImageCropper from '../../common/cropper/imageCropper';
import AddMoreStudent from './addMoreStudent';
import {
  actionSetStudentAsUser,
  actionGetStudentPersonalInfo,
  actionGetStudentUpdatedInfo,
  actionRemoveStudent,
  actionUpdateParentInfo
} from '../../common/core/redux/actions';

import sampleProfile from '../../assets/img/sample-profile.jpg';

class Hruser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sasToken: '',
      loader1: false,
      loader2: false,
      imageSource: '',
      imageName: '',
      imageType: '',
      addStudentModel: false,
      addParentModel: false,
      studentId: ''
    };

    this.handleClickProfile = this.handleClickProfile.bind(this);
    this.uploadImageToAzure = this.uploadImageToAzure.bind(this);
    this.addStudentModel = this.addStudentModel.bind(this);
    this.addParentModel = this.addParentModel.bind(this);
    setLocalStorage(
      'userInfo',
      this.props.parent ? this.props.parent : this.props.user
    );
  }

  componentWillMount() {
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({
        user: this.props.user
      });

      let studentList =
        this.props.parent && this.props.parent.students
          ? this.props.parent.students
          : this.props.user.students || [];

      this.setProfileData(this.props.user);
      this.setStudentData(studentList);
    }
  }

  componentWillReceiveProps(nextProps) {
   // this.setParentProfileData(nextProps.parent);
  }

  setProfileData = data => {
    if (data) {
      let userId = data.userId;

      let firstName = data.firstName;
      let lastName = data.lastName;

      let profileImage = data.profilePicture;
      if (profileImage) {
        profileImage = profileImage;
      }
      let coverImage = data.coverImage;
      if (coverImage) {
        coverImage = getThumbImage('original', coverImage);
      }
      this.setState({
        firstName,
        lastName,
        userId,
        profileImage,
        coverImage
      });
    }
  };


  setStudentData(studentList) {  

      var userId = this.props.user.userId;

      theRapidHireApiService('getHrList', { userId })
        .then(response => {
            console.log(response);
          if (
            response &&
            response.data.status === 'Success' &&
            response.data.result.length > 0
          ) {
           console.log(response);
            let student = this.state.studentList;
           
            studentList = response.data.result;
            this.setState({ studentList: studentList });
          }
        })
        .catch(err => {
          console.log(err);
        });
    
  }

  handleClickProfile = otherUserInfoData => {
    otherUserInfoData['token'] = this.props.user['token'];
    let candidateAndHrDataJson = {     
        otherUserInfoData: otherUserInfoData
    };
    this.props.actionSetStudentAsUser(candidateAndHrDataJson);
    this.props.history.push('/recruiter/jobDesription');
  };

  handleChange = event => {
    let self = this;
    let studentList = self.state.studentList;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    var str_array = name.split('_');
    let id1 = str_array[1];
    let id2 = str_array[2];

    let userId = str_array[1];
    let data = {
      isActive: value,
      userId,
      index: id2
    };

    theRapidHireApiService('updateUserStatus', data)
      .then(response => {
        if (response && response.data.status === 'Success') {
          self.props.actionGetStudentUpdatedInfo(data);
        }
      })
      .catch(error => {});
    studentList[id2].isActive = !studentList[id2].isActive;
    self.setState({
      isActive: false,
      studentLis: studentList
    });
  };

  handleImageChange = (action, event) => {
    this.setState({ imageSource: '' });
    const file = event.target.files[0];
    const fileName = file.name;
    const fileType = file.type;
    if (file) {
      this.generateSASToken();
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = event => {
        this.setState({
          imageSource: event.target.result,
          imageName: fileName,
          imageType: fileType,
          action: action
        });
      };
    }
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

  uploadImageToAzure(file) {
    let userId = this.state.userId;
    let type = this.state.action;
    let sasToken = this.state.sasToken;

    if (file !== '') {
      type === 1
        ? this.setState({ loader1: true, profileImage: '' })
        : this.setState({ loader2: true, coverImage: '' });
      uploadToAzure(
        type,
        userId,
        file,
        sasToken,
        (error, result, uploadPath) => {
          if (error) {
            return;
          }
          if (result) {
            if (type === 1) {
              let profileImage = `${CONSTANTS.azureBlobURI}/${
                CONSTANTS.azureContainer
              }/${uploadPath}`;
              this.setState({ profileImage: profileImage, loader1: false });
            }

            if (type === 2) {
              let coverImage = `${CONSTANTS.azureBlobURI}/${
                CONSTANTS.azureContainer
              }/${uploadPath}`;

              this.setState({ coverImage: coverImage, loader2: false });
            }
            this.updateUserData(type, uploadPath, userId);
            console.log('upload is successful', uploadPath);
          }
        }
      );
    }
  }

  updateUserData = (type, uploadPath, userId) => {
    if (type === 1) {
      let profilePicture = uploadPath;
      let data = {
        userId,
        profilePicture
      };
      this.props.actionUpdateParentInfo({ profilePicture });
      theRapidHireApiService('updateProfileImage', data);
    }

    if (type === 2) {
      let coverImage = uploadPath;
      let data = {
        userId,
        coverImage
      };
      this.props.actionUpdateParentInfo({ coverImage });
      theRapidHireApiService('updateCoverImage', data);
    }
  };

  addStudentModel() {
    this.setState({ addStudentModel: !this.state.addStudentModel });
    let studentList =
      this.props.parent && this.props.parent.students
        ? this.props.parent.students
        : this.props.user.students || [];

    this.setStudentData(studentList);
  }

  addParentModel(studentId) {
    console.log(studentId);
    this.setState({
      addParentModel: !this.state.addParentModel,
      studentId
    });
  }

  removeStudent = (data, index) => {
    let _this = this;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this student?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                let userId = data.userId;
                let isArchived = true;
                let userData = {
                  userId,
                  isArchived
                };

                theRapidHireApiService('removeStudentUser', userData).then(response => {                                 
                  if(response && response.data && response.data.status == "Success"){                   
                    _this.props.actionRemoveStudent(userData);
                     onClose();
                    _this.resetStudentList(userId);
                  }else{
                    onClose();
                  }  
                }).catch(error => {               
                  console.log('err', error);
                });    
            }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  };

  resetStudentList(userId) {
    let studentList = this.state.studentList || [];
    studentList.splice(
      studentList.findIndex(todo => todo.userId === parseInt(userId, 10)),
      1
    );
    this.setState({ studentList: studentList });
  }

  viewSampleProfile = () => {
    this.setState({
      showProfile: !this.state.showProfile
    });
  };

  deleteStudent = (studentId, parentId) => {
    if (studentId && parentId) {
      let _this = this;
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <p>Are you sure you want to delete this student?</p>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  let userData = {
                    studentId,
                    parentId
                  };
                  theRapidHireApiService('removeStudentUser', userData).then(response => {                                 
                    if(response && response.data && response.data.status == "Success"){
                      let userData = {
                        userId: studentId,
                        parentId
                      }; 
                      _this.props.actionRemoveStudent(userData);
                       onClose();
                      _this.resetStudentList(studentId);
                    }else{
                      onClose();
                    }  
                  }).catch(error => {               
                    console.log('err', error);
                  });                 
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          );
        }
      });
    }
  };

  render() {
    let self = this;
    return (
      <div className="wrapper">
       <Header {...this.props} />     
        <div className="main-panel">   
          <div className="w3-content main-panel1">   
        
         
           
            <div className="button--wrapper mb-1 text-center flex flex-1 justify-center dashBtnCenter">            
              <button
                className="btn btn-with-border with-icon smallBtn"
                onClick={this.addStudentModel}
              >
                <span className="icon-plus" />
                add HR
              </button>
            </div>
            {this.state.studentList &&
              this.state.studentList.map(function(data, index) {
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
                        </div>

                        <div className="btn-group flex align-center">
                 
                          <div
                            className={
                              data.isActive
                                ? 'toggleWrapper active'
                                : 'toggleWrapper'
                            }
                          >
                            <label htmlFor="#">Active</label>
                            <div className="item">
                              <input
                                type="checkbox"
                                name={`isActive_${data.userId}_${index}`}
                                onChange={self.handleChange}
                                checked={data.isActive ? true : false}
                                id={`toggle_today_summary${index}`}
                              />
                              <div className="toggle">
                                <label htmlFor={`toggle_today_summary${index}`}>
                                  <i />
                                </label>
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary no-round"
                            onClick={self.handleClickProfile.bind(self, data)}
                          >
                            Go to profile
                          </button>
                          &nbsp; &nbsp;
                      
                          <DropdownButton
                            className="burger-trigger"
                            title={<span className="icon-burger" />}
                            id="1"
                          >
                            <MenuItem
                              onSelect={self.addParentModel.bind(
                                this,
                                data.userId
                              )}
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

                      <div className="flex align-center justify-content-space-bettween tag-wrap">
                        <div className="promo-tag br-light">
                          Accomplishments <span>{data.accomplishment}</span>
                        </div>
                        {/* <div className="promo-tag br-light">
                          Endorsement <span>{data.endorsement}</span>
                        </div> */}
                        <div className="promo-tag">
                          Recommendation <span>{data.recommendation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>         
          {this.state.addStudentModel ? (
            <AddMoreStudent
              addStudentModel={this.state.addStudentModel}
              closeAddStudentModel={this.addStudentModel}
            />
          ) : null}
          {/* <Modal
            show={this.state.showProfile}
            onHide={this.viewSampleProfile}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Sample Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <img src={sampleProfile} />
              </div>
            </Modal.Body>
          </Modal> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    headerCount: state.User.headerCount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionSetStudentAsUser,
      actionGetStudentPersonalInfo,
      actionGetStudentUpdatedInfo,
      actionRemoveStudent,  
      actionUpdateParentInfo
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hruser);
