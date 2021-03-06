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
import { connect } from 'react-redux';
//import DatePicker from 'react-datepicker';
//import DatePicker from '../../../../assets/react-datepicker/es/index';
import moment from 'moment';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import ImageCropper from '../../common/cropper/imageCropper';
import achievementDefaultImage from '../../assets/img/default_achievement.jpg';
import _ from 'lodash';

import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  isValidURL,
  ZoomInAndOut,
  generateTimestamp
} from '../../common/commonFunctions';
import theRapidHireApiService from '../../common/core/api/apiService';
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

const locationList = [
  { locationId: 1, name: 'Indore' },
  { locationId: 2, name: 'Bhopal' },
  { locationId: 3, name: 'Pune' }
];

class addPersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      startDate: '',
      endDate: '',
      promptRecommendation: false,
      userId: '',
      todaysDate: false,
      startYear: moment().format('YYYY'),
      startMonth: moment().format('M') - 1,
      startDay: moment().format('D'),
      endYear: moment().format('YYYY'),
      endMonth: moment().format('M') - 1,
      endDay: moment().format('D'),
      lwdYear: moment().format('YYYY'),
      lwdMonth: moment().format('M') - 1,
      lwdDay: moment().format('D'),
      designation: '',
      organisation: '',
      country: '',
      state: '',
      city: '',
      cities: '',
      profileRole: '',
      year: '',
      month: '',
      location: '',
      personalProfileModal: true,
      projectId: '',
      associateList: [],
      profileRoleList: []
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        profileRole: 'required',
        year: 'required',
        month: 'required',
        country: 'required',
        mobileNo: 'required'
      },
      {
        'required.profileRole': validationMessages.profileRole.required,
        'required.year': validationMessages.year.required,
        'required.month': validationMessages.month.required,
        'required.country': validationMessages.country.required,
        'required.state': validationMessages.state.required,
        'required.city': validationMessages.city.required,
        'required.mobileNo': validationMessages.mobileNo.required
      }
    );
  }

  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  componentDidMount() {
    // if(this.props.user){
    let userId = this.props.user.userId;
    // }
    console.log('this.props.employmentDetail ', this.props.userProfile);
    this.setProjectData(this.props.userProfile);
    this.getProfileRoleList();
    this.getCountryData();
  }

  getCountryData() {
    theRapidHireApiService('getCountryData')
      .then(response => {
        if (response.data.status === 'Success') {
          let countryList = this.state.countryList;
          console.log(response.data.result);
          countryList = response.data.result;
          this.setState({ countryList: countryList });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // getAssociatedListData(userId){
  //   theRapidHireApiService('getAssociatedListDataByUserId',{userId})
  //   .then(response => {
  //     if (response.data.statusCode === 200) {
  //        let associateList= this.state.associateList;
  //        associateList= response.data.resourceData[0];
  //        this.setState({associateList: associateList});
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // }

  getProfileRoleList() {
    theRapidHireApiService('getProfileRoleList')
      .then(response => {
        if (response.data.status === 'Success') {
          let profileRoleList = this.state.profileRoleList;
          // response.data.result.forEach(function(data){
          //    profileRoleList.push({label: data.profileRole,value:data.profileRoleId })
          // })
          profileRoleList = response.data.result;
          console.log(profileRoleList);
          this.setState({ profileRoleList: profileRoleList });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  setProjectData = data => {
    if (data) {
      this.setState({
        userId: data.userId,
        userProfileId: data.userProfileId,
        skills: data.skills,
        year: data.experienceInYear ? data.experienceInYear : '',
        month: data.experienceInMonth ? data.experienceInMonth : '',
        location: data.currentLocation ? data.currentLocation : '',
        mobileNo: data.mobileNo,
        profileRole:
          data.profileRole &&
          data.profileRole[0] &&
          data.profileRole[0].profileRoleId
            ? data.profileRole[0].profileRoleId
            : ''
      });
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

  validateData = () => {
    let self = this;
    this.props.validate(function(error) {
      let imageObject = {
        media: self.state.mediaImgArray || []
      };
      if (!error) {
        self.setState({ isLoading: true });
        self.handleSubmit();
      }
    });
  };

  handleCountry = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    this.getState(value);
  };

  getState(value) {
    let country = this.state.countryList;
    let index = country.findIndex(todo => todo.countryId == value);
    if (index !== -1) {
      let stateList = country[index].state;
      this.setState({ stateList: stateList });
    }
  }

  handleState = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    this.getCities(value);
  };

  getCities(value) {
    let countryId = parseInt(this.state.country);
    let stateId = parseInt(value);

    theRapidHireApiService('getCityData', { countryId, stateId })
      .then(response => {
        if (response.data.status === 'Success') {
          let cities = this.state.cities;
          console.log(response.data.result);
          cities = response.data.result;
          this.setState({ cities: cities });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleSubmit() {
    let profileRoleId = this.state.profileRole;
    let profileRole = [];
    let profileRoleList = this.state.profileRoleList;
    let index = profileRoleList.findIndex(
      todo => todo.profileRoleId == profileRoleId
    );

    profileRole.push(profileRoleList[index]);

    let experienceInYear = this.state.year;
    let experienceInMonth = this.state.month;
    let locationId = this.state.location;
    let currentLocation = '';
    let cities = this.state.cities;
    let cityIndex = cities.findIndex(todo => todo.cityId == locationId);

    if (cityIndex !== -1) {
      currentLocation = cities[index].cityName;
    }

    let mobileNo = this.state.mobileNo;
    let skills = this.state.skills;
    let userId = this.props.user.userId;
    let userProfileId = this.state.userProfileId;
    let roleId = this.props.user.roleId;
    let data = {
      userProfileId,
      userId,
      profileRole,
      experienceInYear,
      experienceInMonth,
      locationId,
      currentLocation,
      mobileNo,
      skills,
      roleId
    };

    let self = this;

    if (!this.state.userProfileId || this.state.userProfileId === '') {
      theRapidHireApiService('addUserSkills', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.setState({ isLoading: false });
            self.closePersonalProfileModal('save');
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editUserProfile', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.closePersonalProfileModal('save');
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    }
  }

  closeImageModal = () => {
    this.setState({
      imagesModal: !this.state.imagesModal
    });
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  closePersonalProfileModal = status => {
    this.setState({
      personalProfileModal: false
    });
    this.props.closePersonalProfileComponent();
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
          show={this.state.personalProfileModal}
          onHide={this.closePersonalProfileModal.bind(this, 'close')}
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
            <Modal.Title className="subtitle">
              {!this.state.userProfileId || this.state.userProfileId === ''
                ? 'Add Profile'
                : 'Edit Profile'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal className="lightBgForm clearfix">
              <Col sm={10}>
                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Profile Role
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <FormControl
                          componentClass="select"
                          placeholder="profileRole"
                          name="profileRole"
                          value={this.state.profileRole}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                          <option value="" disabled>
                            job role
                          </option>
                          {this.state.profileRoleList.map((ass, i) => (
                            <option value={ass.profileRoleId}>
                              {ass.profileRole}
                            </option>
                          ))}
                        </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('associatedWith')
                        )}
                      </div>
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>

                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Experience
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <FormControl
                          componentClass="select"
                          placeholder="year"
                          name="year"
                          value={this.state.year}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                          <option value="" disabled>
                            years
                          </option>
                          <option value={1}>1 years</option>
                          <option value={2}>2 years</option>
                          <option value={3}>3 years</option>
                          <option value={4}>4 years</option>
                          <option value={5}>5 years</option>
                          <option value={6}>6 years</option>
                          <option value={7}>7 years</option>
                          <option value={8}>8 years</option>
                          <option value={9}>9 years</option>
                          <option value={10}>10 years</option>
                          <option value={11}>11 years</option>
                          <option value={12}>12 years</option>
                        </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('year')
                        )}
                      </div>
                      <div className="form-group">
                        <FormControl
                          componentClass="select"
                          placeholder="month"
                          name="month"
                          value={this.state.month}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                          <option value="" disabled>
                            month
                          </option>
                          <option value={1}>1 month</option>
                          <option value={2}>2 month</option>
                          <option value={3}>3 month</option>
                          <option value={4}>4 month</option>
                          <option value={5}>5 month</option>
                          <option value={6}>6 month</option>
                          <option value={7}>7 month</option>
                          <option value={8}>8 month</option>
                          <option value={9}>9 month</option>
                          <option value={10}>10 month</option>
                          <option value={11}>11 month</option>
                          <option value={12}>12 month</option>
                        </FormControl>
                      </div>
                    </div>
                    {renderMessage(this.props.getValidationMessages('month'))}
                  </Col>
                </FormGroup>
                <div>
                  <FormGroup className="addDateInput">
                    <Col componentClass={ControlLabel} sm={3}>
                      Current Location - country
                    </Col>
                    <Col sm={9}>
                      <div className="dob">
                        <div className="form-group">
                          <FormControl
                            componentClass="select"
                            placeholder="country"
                            name="country"
                            value={this.state.country}
                            onChange={this.handleCountry}
                            autoComplete="off"
                            maxLength="1000"
                          >
                            <option value="" disabled>
                              country
                            </option>
                            {this.state.countryList &&
                              this.state.countryList.map((ass, i) => (
                                <option value={ass.countryId}>
                                  {ass.country}
                                </option>
                              ))}
                          </FormControl>
                          {renderMessage(
                            this.props.getValidationMessages('associatedWith')
                          )}
                        </div>
                      </div>
                      {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                    </Col>
                  </FormGroup>
                </div>

                <div>
                  <FormGroup className="addDateInput">
                    <Col componentClass={ControlLabel} sm={3}>
                      state
                    </Col>
                    <Col sm={9}>
                      <div className="dob">
                        <div className="form-group">
                          <FormControl
                            componentClass="select"
                            placeholder="state"
                            name="state"
                            value={this.state.state}
                            onChange={this.handleState}
                            autoComplete="off"
                            maxLength="1000"
                          >
                            <option value="" disabled>
                              state
                            </option>
                            {this.state.stateList &&
                              this.state.stateList.map((ass, i) => (
                                <option value={ass.id}>{ass.name}</option>
                              ))}
                          </FormControl>
                          {renderMessage(
                            this.props.getValidationMessages('associatedWith')
                          )}
                        </div>
                      </div>
                      {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                    </Col>
                  </FormGroup>
                </div>

                <div>
                  <FormGroup className="addDateInput">
                    <Col componentClass={ControlLabel} sm={3}>
                      city
                    </Col>
                    <Col sm={9}>
                      <div className="dob">
                        <div className="form-group">
                          <FormControl
                            componentClass="select"
                            placeholder="city"
                            name="location"
                            value={this.state.location}
                            onChange={this.handleChange}
                            autoComplete="off"
                            maxLength="1000"
                          >
                            <option value="" disabled>
                              city
                            </option>
                            {this.state.cities &&
                              this.state.cities.map((ass, i) => (
                                <option value={ass.cityId}>
                                  {ass.cityName}
                                </option>
                              ))}
                          </FormControl>
                          {renderMessage(
                            this.props.getValidationMessages('associatedWith')
                          )}
                        </div>
                      </div>
                      {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                    </Col>
                  </FormGroup>
                </div>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('description')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>MobileNo</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add mobileNo"
                      name="mobileNo"
                      value={this.state.mobileNo}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('mobileNo')
                    )}
                  </Col>
                </FormGroup>
              </Col>
              <div className="flex align-center justify-content-between fullWidth" />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="success"
              disabled={this.state.isLoading}
              onClick={!this.state.isLoading ? this.validateData : null}
            >
              {this.state.isLoading ? 'In Progress...' : 'Save'}
            </Button>
            <Button
              className="btn btn-secondary"
              onClick={this.closePersonalProfileModal.bind(this, 'close')}
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
          <Modal.Body></Modal.Body>
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
addPersonalProfile = validation(strategy)(addPersonalProfile);

const mapStateToProps = state => {
  return {
    //  user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(addPersonalProfile);
