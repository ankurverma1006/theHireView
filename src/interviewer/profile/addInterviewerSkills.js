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
import Select from 'react-select';
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
//import MediaList from '../mediaList';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;

class addInterviewerSkills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      promptRecommendation: false,
      userId: '',
      skillsModal: true,
      skillId: '',
      skillsList: [],
      availableSkills: []
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema({}, {});
  }

  closeAchievementyModal = status => {
    this.setState({});
    // if (status === 'save')
    //   this.props.closeSaveAchievementComponent(this.props.competencyTypeId);
    // else this.props.closeAchievementComponent(this.props.competencyTypeId);
  };

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

    console.log('this.props.skillsDetail', this.props.skillsDetail);
    this.setSkillsData(this.props.skillsDetail);
    // this.getAssociatedListData(10);
    this.getKeySkillsList();
  }

  getKeySkillsList(userId) {
    theRapidHireApiService('getKeySkillsList')
      .then(response => {
        if (response.data.status === 'Success') {
          let skillsList = this.state.skillsList;
          let availableSkills =
            this.props.skillsDetail && this.props.skillsDetail.skills
              ? this.props.skillsDetail.skills
              : [];
          response.data.result.forEach(function(data) {
            let availIndex = availableSkills.findIndex(
              todo => todo.skillId == data.skillId
            );
            if (availIndex === -1)
              skillsList.push({ label: data.skillName, value: data.skillId });
          });
          console.log(skillsList);
          this.setState({ skillsList: skillsList });
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
      } else {
        self.handleSubmit();
      }
    });
  };

  handleSubmit() {
    let availableSkills =
      this.props.skillsDetail && this.props.skillsDetail.skills
        ? this.props.skillsDetail.skills
        : [];
    let skills = this.state.skills;
    console.log(this.state.skills);

    availableSkills.push({ skillId: skills.value, skillName: skills.label });

    let userId = this.props.user.userId;
    let skillId = this.state.skillId;
    let userProfileId =
      this.props.skillsDetail && this.props.skillsDetail.userProfileId
        ? this.props.skillsDetail.userProfileId
        : '';

    console.log('userProfileId', userProfileId);
    let data = {
      userProfileId,
      userId,
      skills: availableSkills
    };

    let self = this;

    if (!this.state.userProfileId || this.state.userProfileId === '') {
      theRapidHireApiService('addUserSkills', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.setState({ isLoading: false });
            self.closeSkillsModal('save');
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editUserSkills', data)
        .then(response => {
          if (response.data.status === 'Success') {
            self.closeSkillsModal('save');
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

  handleSkillsChange = newValue => {
    this.setState({
      skills: newValue
    });
  };

  closeSkillsModal = status => {
    this.setState({
      skillsModal: false
    });
    this.props.closeSkillsComponent();
  };

  render() {
    console.log('this.props.employmentDetail ', this.props.skillsDetail);
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
          show={this.state.skillsModal}
          onHide={this.closeSkillsModal.bind(this, 'close')}
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
                <FormGroup className={this.getClasses('skills')}>
                  <Col componentClass={ControlLabel} sm={3}>
                    Skills
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"
                        name="skills"
                        value={this.state.skills}
                        onChange={this.handleSkillsChange}
                        options={this.state.skillsList}
                        placeholder="Select all the location that you used along the way"
                      />
                    </div>
                    {renderMessage(this.props.getValidationMessages('skills'))}
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
              onClick={this.closeSkillsModal.bind(this, 'close')}
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
addInterviewerSkills = validation(strategy)(addInterviewerSkills);
const mapStateToProps = state => {
  return {
    user: state.User.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(addInterviewerSkills);
