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

class addPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      promptRecommendation: false,
      userId: '',
      presentationModal: true,
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
        publicationTitle: 'required',
        url: 'required',
        description: 'required'
      },
      {
        'required.publicationTitle':
          validationMessages.publicationTitle.required,
        'required.url': validationMessages.url.required,
        'required.description': validationMessages.description.required
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

  setSkillsData = data => {
    console.log(data);
    if (data) {
      this.setState({
        userId: data.userId,
        availableSkills: data.skills,
        userProfileId: data.userProfileId
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

    let presentationTitle = this.state.presentationTitle;
    let url = this.state.url;
    let description = this.state.description;

    let presentation = [];
    if (accomplishmentId) presentation = accomplishmentData.presentation;

    presentation.push({
      presentationTitle,
      url,
      description
    });

    accomplishmentData.presentation = presentation;

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
      presentationModal: false
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
          show={this.state.presentationModal}
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
              {this.props.accomplishmentName === 'publication'
                ? 'Add Publication'
                : 'Edit Publication'}

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
                  className={this.getClasses('presentationTitle')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Publication Title</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Enter Publication Title"
                      name="presentationTitle"
                      value={this.state.presentationTitle}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('publicationTitle')
                    )}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('url')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Certification Body</ControlLabel>
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
addPresentation = validation(strategy)(addPresentation);
const mapStateToProps = state => {
  return {
    //  user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(addPresentation);
