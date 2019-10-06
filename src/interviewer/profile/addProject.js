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
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import ImageCropper from '../../common/cropper/imageCropper';
import achievementDefaultImage from '../../assets/img/default_achievement.jpg';
import _ from 'lodash';
import moment from 'moment';
import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  isValidURL,
  ZoomInAndOut,
  generateTimestamp,
  showErrorToast
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



class addProject extends Component {
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
      designation:'',
      organisation:'',
      projectModal:true,
      projectId:'',
      associateList: []
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        projectName: 'required'       
      },
      {
        'required.projectName': validationMessages.projectName.required       
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
    let userId= null;
    if(this.props.user){
      userId = this.props.user.userId;
      this.setState({userId: userId});
    } 
   
    this.setProjectData(this.props.projectDetail);
    this.getAssociatedListData(userId);
  }

  getAssociatedListData(userId){
    theRapidHireApiService('getAssociatedListDataByUserId',{userId})
    .then(response => {     
      if (response.data.statusCode === 200) {
         let associateList= this.state.associateList;
         associateList= response.data.resourceData[0];
         this.setState({associateList: associateList});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }


  setProjectData = data => {
    
    let startDay = '',
      startMonth = '',
      startYear = '',
      endDay = '',
      endMonth = '',
      endYear = '',
      todaysDate = '';
    if (data) {        
     
      if (data.startDate) {
        startDay = moment(data.startDate).format('D');
        startMonth = Number(moment(data.startDate).format('M')) - 1;

        startYear = moment(data.startDate).format('YYYY');
      }

      if (data.endDate) {
        endDay = moment(data.endDate).format('D');
        endMonth = Number(moment(data.endDate).format('M')) - 1;
        endYear = moment(data.endDate).format('YYYY');
      } else {
        todaysDate = '';
      }

      this.setState({      
        userId:data.userId,
        projectName : data.projectName,
        projectURL : data.projectURL,
        associatedWith : data.associatedWith,
        projectFinished : data.projectFinished,       
        description : data.description,     
        projectId:  data.projectId,
        startDay: startDay,
        startMonth: startMonth,
        startYear: startYear,
        endDay: endDay,
        endMonth: endMonth,
        endYear: endYear,
        //startDate: moment(data.fromDate),
        // endDate: data.toDate ? moment(data.toDate) : emptyToDate,   
        todaysDate: data.toDate ? false : true       
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
    let today = new Date();  
    this.props.validate(function(error) {     
      if (!error) {
        if (
          self.state.fromDate &&
          self.state.fromDate > today &&
          (self.state.toDate && self.state.toDate > today)
        ) {
          showErrorToast(
            '"From" and "To" date should be less than future date'
          );
          self.setState({
            startYear: '',
            startMonth: '',
            startDay: '',
            endYear: '',
            endMonth: '',
            endDay: ''
          });
        } else if (self.state.fromDate && self.state.fromDate > today) {
          showErrorToast('"From" date should be less than future date');
          self.setState({
            startYear: '',
            startMonth: '',
            startDay: ''
          });
        } else if (self.state.toDate && self.state.toDate > today) {
          showErrorToast('"To" date should be less than future date');
          self.setState({
            endYear: '',
            endMonth: '',
            endDay: ''
          });
        } else if (
          self.state.fromDate !== '' &&
          self.state.toDate !== '' &&
          self.state.fromDate > self.state.toDate
        ) {
          showErrorToast(
            'The "to" date should be greater than or equal to "from" date'
          );
          self.setState({
            endYear: '',
            endMonth: '',
            endDay: ''
          });
        }else { 
          self.setState({ isLoading: true });       
              self.handleSubmit();        
          }
        }    
    });
  };

  selectStartDate = (type, value) => {
    if (type === 'startYear') {
      this.setState({ startYear: value }, () => this.selectDateChange());
    }
    if (type === 'startMonth') {
      this.setState({ startMonth: value }, () => this.selectDateChange());
    }
    if (type === 'startDay') {
      this.setState({ startDay: 1 }, () => this.selectDateChange());
    }
  };

  selectEndDate = (type, value) => {
    if (type === 'endYear') {
      this.setState({ endYear: value }, () => this.selectDateChange());
    }
    if (type === 'endMonth') {
      this.setState({ endMonth: value }, () => this.selectDateChange());
    }
    // if (type === 'endDay') {
    //   this.setState({ endDay: 1 }, () => this.selectDateChange());
    // }
  };
 
  selectDateChange = () => {
    let fromDate = '';
    let toDate = '';
    let startDay = 1,
      startYear = '',
      startMonth = '',
      endDay = 1,
      endMonth = '',
      endYear = '';

    if (this.state.startYear && this.state.startMonth) {
      startDay = 1;
      startMonth =
        this.state.startMonth !== '' ? Number(this.state.startMonth) + 1 : '';
      startYear = this.state.startYear !== '' ? this.state.startYear : '';
      fromDate = moment(startYear + '-' + startMonth + '-' + startDay);
    }

    if (this.state.endYear && this.state.endMonth) {
      endDay = 1;
      endMonth =
        this.state.endMonth !== '' ? Number(this.state.endMonth) + 1 : '';
      endYear = this.state.endYear !== '' ? this.state.endYear : '';
      toDate = moment(endYear + '-' + endMonth + '-' + endDay);
    }

    if (toDate && fromDate) {
      if (fromDate.isAfter(toDate)) {      
        this.setState({
          endDay: startDay,
          endMonth: startMonth - 1,
          endYear: startYear,
          fromDate,
          toDate
        });
      } else {
        this.setState({
          fromDate,
          toDate
        });
      }
    }
  }; 

  handleSubmit() {  

    let projectName = this.state.projectName;
    let projectURL = this.state.projectURL;
    let associatedWith = this.state.associatedWith;
    let projectFinished = this.state.projectFinished;
    let description = this.state.description;
 
    let userId = this.props.user.userId;
    let projectId=  this.state.projectId;   
   
    console.log('this.state.startDay -- ',this.state.startDay);

    let startDay = 1;
    let startMonth =
      this.state.startMonth !== '' ? Number(this.state.startMonth) + 1 : '';
    let startYear = this.state.startYear !== '' ? this.state.startYear : '';
    let fromDate = '';
    if (startDay && startMonth && startYear) {
      fromDate = moment(startYear + '-' + startMonth + '-' + startDay);
      fromDate = moment(fromDate).valueOf();
    }

    let endDay = 1;
    let endMonth =
      this.state.endMonth !== '' ? Number(this.state.endMonth) + 1 : '';
    let endYear = this.state.endYear !== '' ? this.state.endYear : '';
    let toDate = '';
    if (endDay && endMonth && endYear) {
      toDate = moment(endYear + '-' + endMonth + '-' + endDay);
      toDate = moment(toDate).valueOf();
      toDate = this.state.todaysDate ? '' : toDate;
    }    
  
    let data = {
      projectId,
      userId,
      projectName,
      projectURL,
      associatedWith,
      projectFinished,
      description, 
      startDate:fromDate,
      endDate:toDate      
    };

    let self = this;
   
    if (!this.state.projectId || this.state.projectId === '') {
      theRapidHireApiService('addProject', data)
        .then(response => {
          if (response.data.status === 'Success') {      
            self.setState({ isLoading: false });
           self.closeProjectModal('save');
          } 
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editProject', data)
        .then(response => {
          if (response.data.status === 'Success') {        
           self.closeProjectModal('save');
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    }
  }

  currentCheckBox = event => {
    if (event.target.checked) {
      this.setState({
        todaysDate: true,
        endDate: emptyToDate,
        endDay: '',
        endMonth: '',
        endYear: '',
        projectFinished: true
      });
    } else {
      this.setState({
        todaysDate: false,
        endYear: moment().format('YYYY'),
        endMonth: moment().format('M') - 1,
        endDay: moment().format('D'),
        projectFinished:false
      });
    }
    // let endDate = null;
    // if (!todaysDate) endDate = emptyToDate;
    // else endDate = '';
    // this.setState({ todaysDate: !todaysDate, endDate: endDate });
  };

  closeProjectModal = status => {   
    this.setState({
      projectModal: false
      
    });   
    this.props.closeProjectComponent();
  };

  render() {

    console.log('this.props.employmentDetail ',this.props.projectDetail);
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
          show={this.state.projectModal}
          onHide={this.closeProjectModal.bind(this, 'close')}
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
              {!this.state.ProjectId || this.state.ProjectId === ''
                ? 'Add Project'
                : 'Edit Project'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal className="lightBgForm">
              <Col sm={10}>
                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('title')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Project Name</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add a project"
                      name="projectName"
                      value={this.state.projectName}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('projectName'))}
                  </Col>
                </FormGroup>                     
               

                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Date From
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <YearPicker
                          id="year"
                          name="startYear"
                          classes="form-control"
                          defaultValue="Year"
                          end={moment().year()}
                          reverse
                          value={this.state.startYear}
                          onChange={year =>
                            this.selectStartDate('startYear', year)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <MonthPicker
                          id="month"
                          name="startMonth"
                          classes="form-control"
                          defaultValue={'Month'}
                          short
                          endYearGiven
                          year={this.state.startYear}
                          value={this.state.startMonth}
                          onChange={month =>
                            this.selectStartDate('startMonth', month)
                          }
                        />
                      </div>                 
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>

                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Date To
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <YearPicker
                          id="year"
                          name="endYear"
                          disabled={this.state.todaysDate ? true : false}
                          classes="form-control"
                          defaultValue="Year"
                          end={moment().year()}
                          reverse
                          value={this.state.endYear}
                          onChange={year => this.selectEndDate('endYear', year)}
                        />
                      </div>
                      <div className="form-group">
                        <MonthPicker
                          id="month"
                          name="endMonth"
                          disabled={this.state.todaysDate ? true : false}
                          classes="form-control"
                          defaultValue={'Month'}
                          short
                          endYearGiven
                          year={this.state.endYear}
                          value={this.state.endMonth}
                          onChange={month =>
                            this.selectEndDate('endMonth', month)
                          }
                        />
                      </div>
                      {/* <div className="form-group">
                        <DayPicker
                          defaultValue="Day"
                          id="day"
                          disabled={this.state.todaysDate ? true : false}
                          name="endDay"
                          classes="form-control"
                          year={this.state.endYear}
                          month={this.state.endMonth}
                          endYearGiven
                          value={this.state.endDay}
                          onChange={day => this.selectEndDate('endDay', day)}
                        /> 
                      </div>*/}
                    </div>
                    <div className="text-right">
                      <Checkbox
                        className="checkbox-primary "
                        onClick={this.currentCheckBox.bind(this)}
                        defaultChecked={this.state.projectFinished ? true : false}
                      >
                        Is project going on?
                        <span className="check" />
                      </Checkbox>
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>

                {/* <div>    <FormGroup className="addDateInput"> 
                <Col componentClass={ControlLabel} sm={3}>
                       Associated With
                </Col>                
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                      <FormControl
                          componentClass="select"
                          placeholder="associatedWith"
                          name="associatedWith"
                          value={this.state.associatedWith}                          
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >                        
                       <option value="">associatedWith</option>
                       {this.state.associateList.map((ass, i) => (
                       <option value={ass}>{ass}</option>
                       ))}                                 
                      </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('associatedWith')
                        )}
                      </div>                                  
                    </div>
                  </Col>
                </FormGroup>
                </div> */}

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('description')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Description</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      componentClass="textarea"
                      placeholder="description"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="1000"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('description')
                    )}
                  </Col>
                </FormGroup>    

                 <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('title')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Project URL</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add a projectURL"
                      name="projectURL"
                      value={this.state.projectURL}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('projectURL'))}
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
              onClick={this.closeProjectModal.bind(this, 'close')}              
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
          <Modal.Body>            
          </Modal.Body>
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
addProject = validation(strategy)(addProject);

const mapStateToProps = state => {
  return {
  //  user: state.User.userData    
  };
};

export default connect(
  mapStateToProps,
  null
)(addProject);
