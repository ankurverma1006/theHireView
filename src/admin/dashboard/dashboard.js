import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import theRapidHireApiService from '../../common/core/api/apiService';
import {
  setLocalStorage,
  uploadToAzure,
  getThumbImage
} from '../../common/commonFunctions';
import CONSTANTS from '../../common/core/config/appConfig';
import Header from '../header/header';
import ImageCropper from '../../common/cropper/imageCropper';
import {
  actionSetStudentAsUser,
  actionGetStudentPersonalInfo,
  actionGetStudentUpdatedInfo,
  actionRemoveStudent,
  actionUpdateParentInfo
} from '../../common/core/redux/actions';

class Dashboard extends Component {
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
      addParentModel: false
    };    
  }

  componentWillMount() {
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({
        user: this.props.parent ? this.props.parent : this.props.user
      });

      let studentList =
        this.props.parent && this.props.parent.students
          ? this.props.parent.students
          : this.props.user.students || [];

   //   this.setParentProfileData(this.props.parent);
   //   this.setStudentData(studentList);
    }
  }

  componentWillReceiveProps(nextProps) {
  //  this.setParentProfileData(nextProps.parent);
  }

  

 

  render() {
    let self = this;
    return (
      <div className="innerWrapper">
        <Header {...this.props} />   
        <div className="profileBox">
          <div className="banner">
       
            <div className="loader">
              <img
            //    src="../assets/img/svg-loaders/three-dots.svg"
                width="50"
                alt="loader"
                // style={
                //   this.state.loader2 === true
                //     ? { visibility: 'visible' }
                //     : { visibility: 'hidden' }
                // }
              />
            </div>

           
              <img className="bannerImg" src="" alt="" />
            

            <div className="container">
              <div className="profile-pic--wrapper aboveBanner">
                <div className="profile-pic">
                  {this.state.profileImage ? (
                    <img
                    //  src={this.state.profileImage}
                      alt=""
                      className="img-responsive"
                    />
                  ) : (
                    <div className="pp-default">
                      <span className="icon-user_default2" />
                    </div>
                  )}

                  <div
                    className="loader"
                    // style={
                    //   this.state.loader1 === true
                    //     ? { visibility: 'visible' }
                    //     : { visibility: 'hidden' }
                    // }
                  >
                    {/* <img
                      src="../assets/img/svg-loaders/three-dots.svg"
                      width="50"
                      alt="loader"
                    /> */}
                  </div>

                  <div className="editProfile--wrapper">
                    <div className="editProfile">
                      <input
                        type="file"
                     //   onChange={this.handleImageChange.bind(this, 1)}
                        accept="image/*"
                        value=""
                      />
                      <span className="icon-camera icon" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-info--wrapper">
                <p className="pName">
                
                </p>
                {/* <Button className="btn btn-white with-icon ">
                  <span class="icon-connect" />Connect
                </Button> */}
              </div>

              <div className="custom-upload">
                <input
                  type="file"
                //  onChange={this.handleImageChange.bind(this, 2)}
                  accept="image/*"
                  value=""
                />
                <span className="icon-camera icon icon" /> Add Cover Photo
              </div>
            </div>
            </div>
      <div className="container main">
            <div className="flex align-center justify-between mb-1 fullWidth">
              <h3 className="hero-head flex-1 dashTxt">
                Welcome to The Rapid Hire! Please click Go To Profile to add
                information to your childs’ profile. We suggest you add as many
                relevant pictures and videos as possible to create a rich,
                compelling narrative.
              </h3>
            </div>

            <div className="button--wrapper mb-1 text-center flex flex-1 justify-center dashBtnCenter">
              <button
                className="btn btn-with-border with-icon smallBtn mr-1"
                onClick={this.addParentModel}
              >
                <span className="icon-plus" />
                add parent
              </button>
              <button
                className="btn btn-with-border with-icon smallBtn"
                onClick={this.addStudentModel}
              >
                <span className="icon-plus" />
                add student
              </button>
            </div>            
                  <div  className="suggestion-usd">
                    <div className="student-img deflt-icon centeredBox flex">
                     
                        <img                         
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
                           
                          </h3>
                          <p></p>
                        </div>

                        <div className="btn-group flex align-center">
                          {/*self.state.studentList &&
                          self.state.studentList.length > 1 ? (
                            <button
                              className="btn btn-red no-round"
                              onClick={self.removeStudent.bind(
                                self,
                                data,
                                index
                              )}
                            >
                              REMOVE
                            </button>
                              ) : null*/}
                          <div
                            className={
                               'toggleWrapper active'
                                
                            }
                          >
                            <label htmlFor="#">Active</label>
                            <div className="item">
                              <input
                                type="checkbox"
                              //  name={`isActive_${data.userId}_${index}`}
                               // onChange={self.handleChange}
                              //  checked={data.isActive ? true : false}
                              //  id={`toggle_today_summary${index}`}
                              />
                              <div className="toggle">
                                <label >
                                  <i />
                                </label>
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary no-round"
                            //Click={self.handleClickProfile.bind(self, data)}
                          >
                            Go to profile
                          </button>
                          &nbsp; &nbsp;
                          <button
                            className="btn btn-primary no-round"                           
                          >
                            Profile sharing log
                          </button>
                        </div>
                      </div>

                      <div className="flex align-center justify-content-space-bettween tag-wrap">
                        <div className="promo-tag br-light">
                        
                        </div>
                        <div className="promo-tag br-light">
                     
                        </div>
                        <div className="promo-tag">
                         
                        </div>
                      </div>
                    </div>
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
)(Dashboard);
