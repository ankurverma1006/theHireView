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

class addCareerProfile extends Component {
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
      careerProfileModal: true,
      profileId: '',
      associateList: [],
      locationList: [
        {
          value: 1,
          label: 'Indore'
        },
        {
          value: 2,
          label: 'Bhopal'
        },
        {
          value: 2,
          label: 'Dewas'
        }
      ],
      desiredIndustryList: [
        {
          value: 1,
          label: 'Agriculture'
        },
        {
          value: 2,
          label: 'IT'
        },
        {
          value: 2,
          label: 'Admin'
        }
      ]
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        industry: 'required',
        functionalArea: 'required',
        role: 'required',
        desiredLocation: 'required',
        desiredIndustry: 'required'
      },
      {
        'required.industry': validationMessages.industry.required,
        'required.functionalArea': validationMessages.functionalArea.required,
        'required.role': validationMessages.role.required,
        'required.desiredLocation': validationMessages.desiredLocation.required,
        'required.desiredIndustry': validationMessages.desiredIndustry.required
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
    //  let userId = this.props.user.userId;
    // }
    console.log('this.props.employmentDetail ', this.props.careerProfileDetail);
    this.setCareerProfileData(this.props.careerProfileDetail);
    // this.getAssociatedListData(10);
  }

  setCareerProfileData = data => {
    if (data) {
      this.setState({
        userId: data.userId,
        industry: data.industry,
        functionalArea: data.functionalArea,
        role: data.role,
        jobType: data.jobType,
        profileId: data.profileId,
        employmentType: data.employmentType,
        desiredShift: data.desiredShift,
        expectedSalary: data.expectedSalary,
        expectedSalaryInLakh: data.expectedSalaryInLakh,
        expectedSalaryInThousand: data.expectedSalaryInThousand,
        desiredLocation: data.desiredLocation,
        desiredIndustry: data.desiredIndustry
      });
    }
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleChangeStart = startDate => {
    this.handleDateChange({ startDate });
  };

  handleChangeEnd = endDate => {
    this.handleDateChange({ endDate });
  };

  handleDateChange = ({ startDate, endDate }) => {
    console.log(endDate);
    startDate = startDate || this.state.startDate;
    endDate = endDate || this.state.endDate;
    if (startDate && endDate) {
      if (startDate.isAfter(endDate)) {
        endDate = startDate;
      }
    }
    this.setState({ startDate, endDate });
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

  handleSubmit() {
    let industry = this.state.industry;
    let functionalArea = this.state.functionalArea;
    let role = this.state.role;
    let jobType = this.state.jobType;

    let employmentType = this.state.employmentType;
    let desiredShift = this.state.desiredShift;
    let expectedSalary = this.state.expectedSalary;
    let expectedSalaryInLakh = this.state.expectedSalaryInLakh;
    let expectedSalaryInThousand = this.state.expectedSalaryInThousand;
    let desiredLocation = [];
    this.state.desiredLocation.forEach(function(item) {
      desiredLocation.push(item.label);
    });
    let desiredIndustry = [];
    this.state.desiredIndustry.forEach(function(item) {
      desiredIndustry.push(item.label);
    });

    let userId = this.props.user.userId;
    let profileId = this.state.profileId;

    let data = {
      profileId,
      userId,
      industry,
      functionalArea,
      role,
      jobType,
      employmentType,
      desiredShift,
      expectedSalary,
      expectedSalaryInLakh,
      expectedSalaryInThousand,
      desiredLocation,
      desiredIndustry
    };

    let self = this;

    if (!this.state.profileId || this.state.profileId === '') {
      theRapidHireApiService('addCareerProfile', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.setState({ isLoading: false });
            self.closeCareerProfileModal('save');
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editDesiredProfileData', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.closeCareerProfileModal('save');
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

  handleLocationChange = newValue => {
    this.setState({
      desiredLocation: newValue
    });
  };

  handleDesiredIndustryChange = newValue => {
    this.setState({
      desiredIndustry: newValue
    });
  };

  closeCareerProfileModal = status => {
    this.setState({
      careerProfileModal: false
    });
    this.props.closeCareerProfileComponent();
  };

  render() {
    console.log('this.props.employmentDetail ', this.props.careerProfileDetail);
    const CalendarContainer = ({ children }) => {
      const el = document.getElementById('calendar-portal');
      return <Portal container={el}>{children}</Portal>;
    };

    return (
      <div>
        <Modal
          bsSize="large"
          show={this.state.careerProfileModal}
          onHide={this.closeCareerProfileModal.bind(this, 'close')}
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
              {!this.state.profileId || this.state.profiletId === ''
                ? 'Add Career Profile'
                : 'Edit Career Profile'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal className="lightBgForm">
              <Col sm={10}>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Industry
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <FormControl
                        componentClass="select"
                        placeholder="industry"
                        name="industry"
                        value={this.state.industry}
                        onChange={this.handleChange}
                        autoComplete="off"
                        maxLength="1000"
                      >
                        <option value="">industry</option>
                        <option value={1}>IT</option>
                      </FormControl>
                      {renderMessage(
                        this.props.getValidationMessages('industry')
                      )}
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Functional Area
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <FormControl
                        componentClass="select"
                        placeholder="functionalArea"
                        name="functionalArea"
                        value={this.state.functionalArea}
                        onChange={this.handleChange}
                        autoComplete="off"
                        maxLength="1000"
                      >
                        <option value="">functionalArea</option>
                        <option value={1}>IT Specialization</option>
                      </FormControl>
                      {renderMessage(
                        this.props.getValidationMessages('functionalArea')
                      )}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Role
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <FormControl
                        componentClass="select"
                        placeholder="role"
                        name="role"
                        value={this.state.role}
                        onChange={this.handleChange}
                        autoComplete="off"
                        maxLength="1000"
                      >
                        <option value="">role</option>
                        <option value={1}>Software Developer</option>
                        <option value={2}>Team Lead</option>
                        <option value={3}>IT Analyst</option>
                        <option value={4}>Recruiter</option>
                      </FormControl>
                      {renderMessage(this.props.getValidationMessages('role'))}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={3}>
                    JOB Type
                  </Col>
                  <Col sm={9}>
                    <div className="flex">
                      <Radio
                        name="jobType"
                        className="radio_primary"
                        value="permanent"
                        checked={
                          this.state.jobType === 'permanent' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Permanet
                        <div className="check" />
                      </Radio>{' '}
                      <Radio
                        name="jobType"
                        className="radio_primary"
                        value="dollar"
                        checked={
                          this.state.jobType === 'contractual' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Contractual
                        <div className="check" />
                      </Radio>{' '}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={3}>
                    Employment Type
                  </Col>
                  <Col sm={9}>
                    <div className="flex">
                      <Radio
                        name="employmentType"
                        className="radio_primary"
                        value="full"
                        checked={
                          this.state.employmentType === 'full' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Full Time
                        <div className="check" />
                      </Radio>{' '}
                      <Radio
                        name="employmentType"
                        className="radio_primary"
                        value="part"
                        checked={
                          this.state.employmentType === 'part' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Part Time
                        <div className="check" />
                      </Radio>{' '}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={3}>
                    Preffered Shift
                  </Col>
                  <Col sm={9}>
                    <div className="flex">
                      <Radio
                        name="desiredShift"
                        className="radio_primary"
                        value="day"
                        checked={
                          this.state.desiredShift === 'day' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Day
                        <div className="check" />
                      </Radio>{' '}
                      <Radio
                        name="desiredShift"
                        className="radio_primary"
                        value="night"
                        checked={
                          this.state.desiredShift === 'night' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Night
                        <div className="check" />
                      </Radio>{' '}
                      <Radio
                        name="desiredShift"
                        className="radio_primary"
                        value="flexible"
                        checked={
                          this.state.desiredShift === 'flexible' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Flexible
                        <div className="check" />
                      </Radio>{' '}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={3}>
                    Expected Salary
                  </Col>
                  <Col sm={9}>
                    <div className="flex">
                      <Radio
                        name="expectedSalary"
                        className="radio_primary"
                        value="indian"
                        checked={
                          this.state.expectedSalary === 'indian' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Indian
                        <div className="check" />
                      </Radio>{' '}
                      <Radio
                        name="expectedSalary"
                        className="radio_primary"
                        value="dollar"
                        checked={
                          this.state.expectedSalary === 'dollar' ? true : false
                        }
                        onChange={this.handleChange}
                      >
                        Dollar
                        <div className="check" />
                      </Radio>{' '}
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup className={this.getClasses('desiredLocation')}>
                  <Col componentClass={ControlLabel} sm={3}>
                    Desired Location
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"
                        multi
                        name="desiredLocation"
                        value={this.state.desiredLocation}
                        onChange={this.handleLocationChange}
                        options={this.state.locationList}
                        placeholder="Select all the location that you used along the way"
                      />
                    </div>
                    {renderMessage(
                      this.props.getValidationMessages('desiredLocation')
                    )}
                  </Col>
                </FormGroup>

                <FormGroup className={this.getClasses('skills')}>
                  <Col componentClass={ControlLabel} sm={3}>
                    Desired Industry
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"
                        multi
                        name="desiredIndustry"
                        value={this.state.desiredIndustry}
                        onChange={this.handleDesiredIndustryChange}
                        options={this.state.desiredIndustryList}
                        placeholder="Select all the industry that you used along the way"
                      />
                    </div>
                    {renderMessage(
                      this.props.getValidationMessages('desiredIndustry')
                    )}
                  </Col>
                </FormGroup>
              </Col>
              <div className="flex align-center justify-content-between fullWidth" />
            </Form>
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
              onClick={this.closeCareerProfileModal.bind(this, 'close')}
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
addCareerProfile = validation(strategy)(addCareerProfile);

const mapStateToProps = state => {
  return {
    //  user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(addCareerProfile);
