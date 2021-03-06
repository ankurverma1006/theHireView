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
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';

import _ from 'lodash';

import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  isValidURL,
  ZoomInAndOut,
  generateTimestamp
} from '../../common/commonFunctions';
import theRapidHireApiService from '../../common/core/api/apiService';

let validationMessages = CONSTANTS.validationMessages;

class addPatent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      promptRecommendation: false,
      userId: '',
      patentModal: true,
      skillId: '',
      rating: '',
      certificationList: [],
      availableSkills: [],
      accomplishmentData: {}
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        patentTitle: 'required',
        patentOffice: 'required',
        applicationNo: 'required'
      },
      {
        'required.patentTitle': validationMessages.patentTitle.required,
        'required.patentOffice': validationMessages.patentOffice.required,
        'required.applicationNo': validationMessages.applicationNo.required
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
    let userId = null;
    if (this.props.user) {
      userId = this.props.user.userId;
      this.setState({ userId: userId });
    }

    // this.getAssociatedListData(10);
    console.log(this.props.accomplishmentData);
    this.setState({ accomplishmentData: this.props.accomplishmentData });
    // this.addAccomplishment();
    this.setAccomplishmentData(this.props.accomplishmentDetail);
  }

  addAccomplishment(userId) {
    theRapidHireApiService('getAccomplishment')
      .then(response => {
        if (response.data.status === 'Success') {
          // let certificationList = this.state.certificationList;
          // let availableSkills =
          //   this.props.skillsDetail && this.props.skillsDetail.skills
          //     ? this.props.skillsDetail.skills
          //     : [];
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  setAccomplishmentData = data => {
    console.log(data);
    if (data) {
      this.setState({
        patentTitle: data.patentTitle,
        url: data.url,
        patentOffice: data.patentOffice,
        applicationNo: data.applicationNo,
        description: data.description
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

  validateData = () => {
    let self = this;
    this.props.validate(function(error) {
      if (!error) {
        self.setState({ isLoading: true });
        self.handleSubmit();
      }
    });
  };

  handleSubmit() {
    let accomplishmentData = this.state.accomplishmentData
      ? this.state.accomplishmentData
      : {};

    let userId = this.props.user.userId;
    let accomplishmentId =
      accomplishmentData && accomplishmentData.accomplishmentId
        ? accomplishmentData.accomplishmentId
        : '';

    let patentTitle = this.state.patentTitle;
    let url = this.state.url;
    let patentOffice = this.state.patentOffice;
    let applicationNo = this.state.applicationNo;
    let description = this.state.description;

    let patent = [];
    if (accomplishmentId) patent = accomplishmentData.patent;

    patent.push({
      patentTitle,
      url,
      patentOffice,
      applicationNo,
      description
    });

    accomplishmentData.patent = patent;

    accomplishmentData.userId = userId;

    console.log('userProfileId', accomplishmentId);
    // let data = {
    //   accomplishmentId,
    //   userId,
    //   certification
    // };

    let self = this;

    if (!accomplishmentId || accomplishmentId === '') {
      theRapidHireApiService('addAccomplishment', accomplishmentData)
        .then(response => {
          if (response.data.status === 'Success') {
            self.setState({ isLoading: false });
            self.closeAccomplishmentModal('save');
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editAccomplishment', accomplishmentData)
        .then(response => {
          if (response.data.status === 'Success') {
            self.closeAccomplishmentModal('save');
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    }
  }

  handleSkillsChange = newValue => {
    this.setState({
      skills: newValue
    });
  };

  closeAccomplishmentModal = status => {
    this.setState({
      patentModal: false
    });
    this.props.closeAccomplishmentComponent();
  };

  render() {
    const CalendarContainer = ({ children }) => {
      const el = document.getElementById('calendar-portal');
      return <Portal container={el}>{children}</Portal>;
    };

    return (
      <div>
        <Modal
          Size="lg"
          show={this.state.patentModal}
          onHide={this.closeAccomplishmentModal.bind(this, 'close')}
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
              {this.props.accomplishmentName === 'patent'
                ? 'Add Patent'
                : 'Edit Patent'}

              {this.state.accomplishmentName === 'onlineProfile'
                ? 'Online Profiles'
                : ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal className="lightBgForm">
              <Col sm={10}>
                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('patentTitle')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Patent Title</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Enter Patent Title"
                      name="patentTitle"
                      value={this.state.patentTitle}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('patentTitle')
                    )}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('url')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>URL</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Enter URL"
                      name="url"
                      value={this.state.url}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('url'))}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('patentOffice')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Patent Office</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Enter Patent Office"
                      name="patentOffice"
                      value={this.state.patentOffice}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('patentOffice')
                    )}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('applicationNo')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Application Number</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Enter Application No"
                      name="applicationNo"
                      value={this.state.applicationNo}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('applicationNo')
                    )}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('description')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Description</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Type Here"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('description')
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
              onClick={this.closeAccomplishmentModal.bind(this, 'close')}
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
addPatent = validation(strategy)(addPatent);
const mapStateToProps = state => {
  return {
    //  user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(addPatent);
