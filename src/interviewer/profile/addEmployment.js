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
  Radio,
  Row
} from 'react-bootstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import { connect } from 'react-redux';
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

class addEmployment extends Component {
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
      employmentModal:true,
      employmentId:''
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        designation: 'required',
        organisation: 'required'       
      },
      {
        'required.designation': validationMessages.designation.required,
        'required.organisation': validationMessages.organisation.required        
      }
    );
  }

  closeAchievementyModal = status => {
    
    this.setState({      
    });
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
    console.log('this.props.employmentDetail ',this.props.employmentDetail);
    this.setEmploymentData(this.props.employmentDetail);
  }


  setEmploymentData = data => {
    
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
        designation : data.designation,
        organisation : data.organisation,
        currentCompany : data.currentCompany,
        currentSalary : data.currentSalary,
        lakh : data.currentSalaryInLakh,
        thousand : data.currentSalaryInThousand,
        describe : data.describe,
        noticePeriod : data.noticePeriod,
        offeredSalary : data.offeredSalary,
        offeredSalaryInLakh : data.offeredSalaryInLakh,
        offeredSalaryInThousand : data.offeredSalaryInThousand,
        offeredDesignation : data.offeredDesignation,
        nextEmployer : data.nextEmployer,
        userId: 10,
        employmentId:  data.employmentId,
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
    let today = new Date();  

    if (this.state.noticePeriod == 6) { // serving notice period === 6
      this.validatorTypes.rules['offeredDesignation'] = [
        'required'      
      ];
      this.validatorTypes.messages['required.offeredDesignation'] =
        validationMessages.offeredDesignation.required;

        this.validatorTypes.rules['nextEmployer'] = [
          'required'      
        ];
        this.validatorTypes.messages['required.nextEmployer'] =
          validationMessages.nextEmployer.required;

          this.validatorTypes.rules['offeredSalary'] = [
            'required'      
          ];
          this.validatorTypes.messages['required.offeredSalary'] =
            validationMessages.offeredSalary.required;
  
            this.validatorTypes.rules['offeredSalaryInLakh'] = [
              'required'      
            ];
            this.validatorTypes.messages['required.offeredSalaryInLakh'] =
              validationMessages.offeredSalaryInLakh.required;
  
              this.validatorTypes.rules['offeredSalaryInThousand'] = [
                'required'      
              ];
              this.validatorTypes.messages['required.offeredSalaryInThousand'] =
                validationMessages.offeredSalaryInThousand.required;
     
          if (
            self.state.lwdDate &&
            self.state.lwdDate > today          
          ) {
            showErrorToast(
              '"From" and "To" date should be less than future date'
            );
              self.setState({
                lwdDay : '',
                lwdYear : '',
                lwdMonth : '',
                lwdDate:''
              });
          }  
    }else{
      this.validatorTypes.rules['offeredDesignation'] = '';
      this.validatorTypes.messages['required.offeredDesignation'] = '';

      this.validatorTypes.rules['nextEmployer'] = '';
      this.validatorTypes.messages['required.nextEmployer'] = '';

      this.validatorTypes.rules['offeredSalary'] = '';
      this.validatorTypes.messages['required.offeredSalary'] = '';

      this.validatorTypes.rules['offeredSalaryInLakh'] = '';
      this.validatorTypes.messages['required.offeredSalaryInLakh'] = '';

      this.validatorTypes.rules['offeredSalaryInThousand'] = '';
      this.validatorTypes.messages['required.offeredSalaryInThousand'] = '';
      self.setState({
        lwdDay : '',
        lwdYear : '',
        lwdMonth : '',
        lwdDate:''
      });
    } 

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

  selectLWDDate = (type, value) => {
    if (type === 'lwdYear') {
      this.setState({ lwdYear: value } ,() => this.selectLwdChange());
    }
    if (type === 'lwdMonth') {
      this.setState({ lwdMonth: value },() => this.selectLwdChange());
    }
    if (type === 'lwdDay') {
      this.setState({ lwdDay: 1 })// () => this.selectDateChange());
    } 
  };

  selectLwdChange = () => {
    let lwdDate = '';  
    let lwdDay = 1,
       lwdYear = '',
       lwdMonth = '';

       if (this.state.lwdYear && this.state.lwdMonth) {
        lwdDay = 1;
        lwdMonth =
          this.state.lwdMonth !== '' ? Number(this.state.lwdMonth) + 1 : '';
          lwdYear = this.state.lwdYear !== '' ? this.state.lwdYear : '';
          lwdDate = moment(lwdYear + '-' + lwdMonth + '-' + lwdDay);
      }
      this.setState({
        lwdDate
      });
  }
  

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
        console.log('dd');
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
    let designation = this.state.designation;
    let organisation = this.state.organisation;
    let currentCompany = this.state.currentCompany;
    let currentSalary = this.state.currentSalary;
    let currentSalaryInLakh = this.state.lakh;
    let currentSalaryInThousand = this.state.thousand;
    let describe = this.state.describe;
    let noticePeriod = this.state.noticePeriod;
    let offeredSalary = this.state.offeredSalary;
    let offeredSalaryInLakh = this.state.offeredSalaryInLakh;
    let offeredSalaryInThousand = this.state.offeredSalaryInThousand;
    let offeredDesignation = this.state.offeredDesignation;
    let nextEmployer = this.state.nextEmployer;
    let userId= this.props.user.userId;
    let employmentId=  this.state.employmentId;
   
   
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

   
    let lwdDay = this.state.lwdDay !== '' ? this.state.lwdDay : '';
    let lwdMonth =
      this.state.lwdMonth !== '' ? Number(this.state.lwdMonth) + 1 : '';
    let lwdYear = this.state.lwdYear !== '' ? this.state.lwdYear : '';
    let lwdDate = '';
    if(this.state.lwdMonth && this.state.lwdDay && this.state.lwdYear) {
      lwdDate = moment(lwdYear + '-' + lwdMonth + '-' + lwdDay);
      lwdDate = moment(lwdDate).valueOf();
    }
  

    let data = {
      employmentId,
      userId,
      designation,
      organisation,
      currentCompany,
      currentSalary,
      currentSalaryInLakh,
      currentSalaryInThousand,
      describe,
      noticePeriod,
      offeredSalary,
      offeredSalaryInLakh,
      offeredSalaryInThousand,
      offeredDesignation,
      startDate:fromDate,
      endDate:toDate,
      lastWorkingDate:lwdDate,
      nextEmployer    
    };

    let self = this;
    console.log('this.state.employmentId -- ',this.state.employmentId);
    if (!this.state.employmentId || this.state.employmentId === '') {
      theRapidHireApiService('addEmployment', data)
        .then(response => {
          if (response.data.status === 'Success') {      
            self.setState({ isLoading: false });
            self.closeEmploymentModal('save');
          } 
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('editEmployment', data)
        .then(response => {
          if (response.data.status === 'Success') {        
            self.closeEmploymentModal('save');
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

  currentCheckBox = event => {
    if (event.target.checked) {
      this.validatorTypes.rules['endDay'] = '';
      this.validatorTypes.rules['endMonth'] = '';
      this.validatorTypes.rules['endYear'] = '';
      this.setState({
        toDate: '',
        todaysDate: true,
        endDay: '',
        endMonth: '',
        endYear: '',
        currentCompany: false
      });

      this.validatorTypes.rules['noticePeriod'] = 'required';
      this.validatorTypes.messages['required.noticePeriod'] =
        validationMessages.noticePeriod.required;

        this.validatorTypes.rules['currentSalary'] = [
          'required'      
        ];
        this.validatorTypes.messages['required.currentSalary'] =
          validationMessages.currentSalary.required;

          this.validatorTypes.rules['lakh'] = [
            'required'      
          ];
          this.validatorTypes.messages['required.lakh'] =
            validationMessages.lakh.required;

            this.validatorTypes.rules['thousand'] = [
              'required'      
            ];
            this.validatorTypes.messages['required.thousand'] =
              validationMessages.thousand.required;

    } else {

      this.validatorTypes.rules['noticePeriod'] = '';
      this.validatorTypes.messages['required.noticePeriod'] = '';

      this.validatorTypes.rules['currentSalary'] = '';
      this.validatorTypes.messages['required.currentSalary'] = '';

      this.validatorTypes.rules['lakh'] = '';
      this.validatorTypes.messages['required.lakh'] = '';

      this.validatorTypes.rules['thousand'] = '';
      this.validatorTypes.messages['required.thousand'] = '';

      this.validatorTypes.rules['endDay'] = 'required';
      this.validatorTypes.messages['required.endDay'] =
        validationMessages.day.required;

      this.validatorTypes.rules['endMonth'] = 'required';
      this.validatorTypes.messages['required.endMonth'] =
        validationMessages.month.required;

      this.validatorTypes.rules['endYear'] = 'required';
      this.validatorTypes.messages['required.endYear'] =
        validationMessages.year.required;

      this.setState({
        todaysDate: false,
        endYear: '',
        endMonth: '',
        endDay: '',
        currentCompany: true     
      });
    }   
  };


  deleteEmployment = event => {
    let employmentId= this.state.employmentId,self= this;
    theRapidHireApiService('deleteEmployment', {employmentId})
    .then(response => {
      if (response.data.status === 'Success') {        
        self.closeEmploymentModal('save');
        self.setState({ isLoading: false });
      }
    })
    .catch(error => {
      self.setState({ isLoading: false });
      console.log(error);
    });
  }

  closeEmploymentModal = status => {   
    this.setState({
      employmentModal: false
      
    });   
    this.props.closeEmploymentComponent();
  };

  render() {   
    const CalendarContainer = ({ children }) => {
      const el = document.getElementById('calendar-portal');
      return <Portal container={el}>{children}</Portal>;
    };

    return (
      <div>   

        <Modal
          bsSize="large"
          show={this.state.employmentModal}
          onHide={this.closeEmploymentModal.bind(this, 'close')}
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
              {!this.state.EmploymentId || this.state.EmploymentId === ''
                ? 'Add Employment'
                : 'Edit Employment'}
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
                    <ControlLabel>Designation</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add a designation"
                      name="designation"
                      value={this.state.designation}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('designation'))}
                  </Col>
                </FormGroup>

           
                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('organisation')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Organisation</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add a organisation"
                      name="organisation"
                      value={this.state.organisation}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('organisation'))}
                  </Col>
                </FormGroup>              

                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      Is this your current company ?
                    </Col>
                    <Col sm={9}>
                      <div className="flex">
                        <Radio
                          name="currentCompany"
                          className="radio-primary"
                          value={true}
                          checked={
                            this.state.currentCompany === true ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          Yes
                          <div className="check" />
                        </Radio>{' '}
                        <Radio
                          name="currentCompany"
                          className="radio-primary"
                          value={false}
                          checked={
                            this.state.currentCompany === false ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          No
                          <div className="check" />
                        </Radio>{' '}
                      </div>
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
                    </div>
                    <div className="text-right">
                      <Checkbox
                        className="checkbox-primary "
                        onClick={this.currentCheckBox.bind(this)}
                        defaultChecked={this.state.currentCompany ? true : false}
                      >
                        Are you working here now
                        <span className="check" />
                      </Checkbox>
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>

                {this.state.todaysDate === true ? <div>
                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      Current Salary
                    </Col>
                    <Col sm={9}>
                      <div className="flex">
                        <Radio
                          name="currentSalary"
                          className="radio-primary"
                          value="indian"
                          checked={
                            this.state.currentSalary === 'indian' ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          Indian
                          <div className="check" />
                        </Radio>{' '}
                        <Radio
                          name="currentSalary"
                          className="radio-primary"
                          value="dollar"
                          checked={
                            this.state.currentSalary === 'dollar' ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          Dollars
                          <div className="check" />
                        </Radio>{' '}
                      </div>
                    </Col>
                    {renderMessage(
                          this.props.getValidationMessages('currentSalary')
                        )}
                  </FormGroup>

                <FormGroup className="addDateInput"> 
                <Col componentClass={ControlLabel} sm={3}>
                       Salary
                </Col>                
                  <Col sm={9}>                
                  <div className="dob">
                      <div className="form-group">                     
                      <FormControl
                          componentClass="select"
                          placeholder="lakh"
                          name="lakh"
                          value={this.state.lakh}                          
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >                        
                       <option value="">lakh</option>
                       <option value={1}>1 lakh</option>
                       <option value={2}>2 lakh</option>
                       <option value={3}>3 lakh</option>
                       <option value={4}>4 lakh</option>
                       <option value={5}>5 lakh</option>    
                       <option value={6}>6 lakh</option>        
                       <option value={7}>7 lakh</option>
                       <option value={8}>8 lakh</option>
                       <option value={9}>9 lakh</option>
                       <option value={10}>10 lakh</option>
                       <option value={11}>11 lakh</option>    
                       <option value={12}>12 lakh</option>                                      
                      </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('lakh')
                        )}
                      </div>              
                     <div className="form-group">                                              
                      <FormControl
                          componentClass="select"
                          placeholder="thousand"
                          name="thousand"
                          value={this.state.thousand}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >      
                        <option value="">thousand</option>
                       <option value={1}>1 thousand</option>
                       <option value={2}>2 thousand</option>
                       <option value={3}>3 thousand</option>
                       <option value={4}>4 thousand</option>
                       <option value={5}>5 thousand</option>    
                       <option value={6}>6 thousand</option>        
                       <option value={7}>7 thousand</option>
                       <option value={8}>8 thousand</option>
                       <option value={9}>9 thousand</option>
                       <option value={10}>10 thousand</option>
                       <option value={11}>11 thousand</option>    
                       <option value={12}>12 thousand</option>                                      
                      </FormControl>      
                      {renderMessage(
                          this.props.getValidationMessages('thousand')
                        )}           
                      </div>                                    
                      </div>                   
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>
                </div>:''}

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('description')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Describe</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Tell us how this made you unique"
                      name="describe"
                      value={this.state.describe}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="1000"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('description')
                    )}
                  </Col>
                </FormGroup>

              {this.state.todaysDate === true ? 
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Notice Period
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <FormControl
                        componentClass="select"
                        placeholder="Select Notice Period"
                        name="noticePeriod"
                        value={this.state.noticePeriod}
                        onChange={this.handleChange}
                        onClick={this.handleChange}
                        inputRef={element => {
                          this.competencyDropdown = element;
                        }}
                      > 
                       <option value="">Select Achievement Level</option>
                       <option value={1}>15 days or less</option>
                       <option value={2}>1 month</option>
                       <option value={3}>2 month</option>
                       <option value={4}>3 month</option>
                       <option value={5}>more than 3 month</option>    
                       <option value={6}>Serving notice period</option>                                      
                      </FormControl>
                    </div>                   
                  </Col>
                </FormGroup>
              :''}
             {this.state.noticePeriod == 6 ? <div>
                   <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Last Working Days
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <YearPicker
                          id="year"
                          name="lwdYear"
                          classes="form-control"
                          defaultValue="Year"
                          end={moment().year()}
                          reverse
                          value={this.state.lwdYear}
                          onChange={year =>
                            this.selectLWDDate('lwdYear', year)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <MonthPicker
                          id="month"
                          name="lwdMonth"
                          classes="form-control"
                          defaultValue={'Month'}
                          short
                          endYearGiven
                          year={this.state.lwdYear}
                          value={this.state.lwdMonth}
                          onChange={month =>
                            this.selectLWDDate('lwdYear', month)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <DayPicker
                          defaultValue="Day"
                          id="day"
                          name="lwdDay"
                          classes="form-control"
                          year={this.state.lwdYear}
                          month={this.state.lwdMonth}
                          endYearGiven
                          value={this.state.lwdDay}
                          onChange={day =>
                            this.selectLWDDate('lwdDay', day)
                          }
                        />
                      </div>
                    </div>

                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup> 

                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      Offered Salary
                    </Col>
                    <Col sm={9}>
                      <div className="flex">
                        <Radio
                          name="offeredSalary"
                          className="radio-primary"
                          value="indian"
                          checked={
                            this.state.offeredSalary === 'indian' ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          Indian
                          <div className="check" />
                        </Radio>{' '}
                        <Radio
                          name="offeredSalary"
                          className="radio-primary"
                          value="dollar"
                          checked={
                            this.state.offeredSalary === 'dollar' ? true : false
                          }
                          onChange={this.handleChange}
                        >
                          Dollars
                          <div className="check" />
                        </Radio>{' '}
                      </div>
                      {renderMessage(
                          this.props.getValidationMessages('offeredSalary')
                        )}
                    </Col>
                  </FormGroup>

                <FormGroup className="addDateInput"> 
                <Col componentClass={ControlLabel} sm={3}>
                       Salary
                </Col>                
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                      <FormControl
                          componentClass="select"
                          placeholder="lakh"
                          name="offeredSalaryInLakh"
                          value={this.state.offeredSalaryInLakh}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                        <option value="">lakh</option>
                       <option value={1}>1 lakh</option>
                       <option value={2}>2 lakh</option>
                       <option value={3}>3 lakh</option>
                       <option value={4}>4 lakh</option>
                       <option value={5}>5 lakh</option>    
                       <option value={6}>6 lakh</option>        
                       <option value={7}>7 lakh</option>
                       <option value={8}>8 lakh</option>
                       <option value={9}>9 lakh</option>
                       <option value={10}>10 lakh</option>
                       <option value={11}>11 lakh</option>    
                       <option value={12}>12 lakh</option>                                      
                      </FormControl>      
                      {renderMessage(
                          this.props.getValidationMessages('offeredSalaryInLakh')
                        )}               
                      </div>
                      <div className="form-group">
                      <FormControl
                          componentClass="select"
                          placeholder="thousand"
                          name="offeredSalaryInThousand"
                          value={this.state.offeredSalaryInThousand}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >  
                         <option value="">thousand</option>
                       <option value={1}>1 thousand</option>
                       <option value={2}>2 thousand</option>
                       <option value={3}>3 thousand</option>
                       <option value={4}>4 thousand</option>
                       <option value={5}>5 thousand</option>    
                       <option value={6}>6 thousand</option>        
                       <option value={7}>7 thousand</option>
                       <option value={8}>8 thousand</option>
                       <option value={9}>9 thousand</option>
                       <option value={10}>10 thousand</option>
                       <option value={11}>11 thousand</option>    
                       <option value={12}>12 thousand</option>                                      
                      </FormControl>  
                      {renderMessage(
                          this.props.getValidationMessages('offeredSalaryInThousand')
                        )}                                
                      </div>                     
                    </div>                   
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>

                <FormGroup
                  controlId="formControlsTextarea"  
                  className={this.getClasses('offeredDesignation')}                
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Offered Designation</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add a Designation"
                      name="offeredDesignation"
                      value={this.state.offeredDesignation}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />                    
                  </Col>
                  {renderMessage(
                      this.props.getValidationMessages('offeredDesignation')
                  )}
                </FormGroup>


                <FormGroup
                  controlId="formControlsTextarea" 
                  className={this.getClasses('nextEmployer')}               
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Next Employer</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="Add your next employer"
                      name="nextEmployer"
                      value={this.state.nextEmployer}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />                  
                  </Col>
                  {renderMessage(
                      this.props.getValidationMessages('nextEmployer')
                  )}
                </FormGroup>
              </div>:''} 
              </Col>
              <div className="flex align-center justify-content-between fullWidth" />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="default"
              className="no-bold no-round"
              onClick={this.deleteEmployment.bind(this)}              
            >
              Delete
            </Button>

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
              onClick={this.closeEmploymentModal.bind(this, 'close')}              
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
addEmployment = validation(strategy)(addEmployment);

const mapStateToProps = state => {
  return {
  //  user: state.User.userData    
  };
};

export default connect(
  mapStateToProps,
  null
)(addEmployment);