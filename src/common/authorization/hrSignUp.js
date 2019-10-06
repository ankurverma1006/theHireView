import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  Nav,
  NavItem
} from 'react-bootstrap';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import * as qs from 'query-string';
import Select from 'react-select';
import { actionUserLogin } from '../core/redux/actions';
import Sidebar from './sideBar';
import theRapidHireApiService from '../core/api/apiService';
import {
  ZoomInAndOut,
  renderMessage,
  showErrorToast,
  encrypt,
  getIPAddress
} from '../commonFunctions';
import CONSTANTS from '../core/config/appConfig';
import moment from 'moment';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;
let i = 0;

class HRSignup extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      parentEmail: '',
      parentFirstName: '',
      parentLastName: '',
      year: '',
      month: '',
      day: '',
      roleId:
        this.props.location.state &&
        this.props.location.state.eventKey &&
        this.props.location.state.eventKey === 2
          ? 1
          : 1,
      eventKey:
        this.props.location.state &&
        this.props.location.state.eventKey &&
        this.props.location.state.eventKey === 2
          ? 2
          : 1,
      parentField: false,
      invite: CONSTANTS.INVITE_4,
      invitedRoleId: 1,
      otherCompanyName:false,
      companyDetail:[]
    };

    this.initialState = this.state;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.setValidatorTypes = this.setValidatorTypes.bind(this);
  }

  componentWillMount() {
    console.log('call');
    this.setValidatorTypes(
      this.props.location.state &&
      this.props.location.state.eventKey &&
      this.props.location.state.eventKey === 2
        ? 2
        : 1
    );
  }

  componentDidMount() {
    if (this.props.location.search) {
      const parsed = qs.parse(this.props.location.search);
      const invite = parsed.invite;
      const userId = parsed.userId;
      this.setState({
        invite,
        userId
      });
      this.setUserInfo(userId);
      let _this = this;
      getIPAddress(function(ip) {
        _this.setState({
          deviceId: ip
        });
      });
    }
    this.getCompanyList();
  }

  setUserInfo = userId => {
    if (userId) {
      theRapidHireApiService('getStudentPersonalInfoBeforeLogin', { userId })
        .then(response => {
          if (response.data.status === 'Success') {
            let userData = response.data.result;
            console.log(userData);
            if (userData) {
              let firstName = userData.firstName || '';
              let lastName = userData.lastName || '';
              let email = userData.email || '';
              let roleId = userData.roleId === 0 ? 1 : userData.roleId;
              let invitedRoleId = roleId;
              if (userData.dob) {
                let day = moment(userData.dob).format('D');
                let month = Number(moment(userData.dob).format('M')) - 1;
                let year = moment(userData.dob).format('YYYY');
                console.log(day, month, year);
                this.setState({
                  day,
                  month,
                  year
                });
              }

              if (this.state.invite === CONSTANTS.INVITE_0) {
                this.setValidatorTypes(roleId);
              }
              this.setState({
                firstName,
                lastName,
                email,
                invitedRoleId,
                roleId
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  getCompanyList(){
    theRapidHireApiService('getCompanyList')
    .then(response => {     
      if (response.data.status === 'Success') {
         let companyDetail= this.state.companyDetail;
         response.data.result.forEach(function(data){         
         
            companyDetail.push({label: data.companyName,value:data.companyId })
        })     
         this.setState({companyDetail: companyDetail});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }


  // type = 1 = student,   type = 2 = parent
  setValidatorTypes(type) {
    console.log(type);
    type = Number(type);

    // Common validation for student and parent
    let elementObject = {
      firstName: ['required', 'regex:' + regExpressions.alphaOnly],
      lastName: ['required', 'regex:' + regExpressions.alphaOnly],
      email: 'required|email',
  // //   newPassword: ['required', 'regex:' + regExpressions.passwordPattern],
    //  confirmNewPassword: 'required|same:newPassword'
     
    };

    let messageObject = {
      'required.firstName': validationMessages.firstName.required,
      'regex.firstName': validationMessages.firstName.alphaOnly,
      'required.lastName': validationMessages.lastName.required,
      'regex.lastName': validationMessages.lastName.alphaOnly,
      'required.email': validationMessages.email.required,
      'email.email': validationMessages.email.invalid,
 //     'required.newPassword': validationMessages.password.newPassword,
 //     'regex.newPassword': validationMessages.password.passwordPattern,
      // 'required.confirmNewPassword':
      //   validationMessages.password.confirmNewPassword,
      // 'same.confirmNewPassword': validationMessages.password.same
     
    };   
    this.validatorTypes = strategy.createSchema(elementObject, messageObject);
  }

  getValidatorData() {
    return this.state;
  }

  getClasses(field) {
    return classnames({
      error: !this.props.isValid(field)
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSelect = tabValue => {
    let eventKey = Number(tabValue);
    if (eventKey !== this.state.roleId && this.props.location.search === '') {
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        newPassword: '',
        confirmNewPassword: '',
        companyName:''
        // parentEmail: '',
        // parentFirstName: '',
        // parentLastName: '',
        // year: '',
        // month: '',
        // day: ''
      });
    }

    this.setState({
      roleId: 3,
      eventKey: eventKey
    });
    this.props.clearValidations();
    this.setValidatorTypes(eventKey);
  };

  handleResetForm = () => {
    this.setState(this.initialState);
  };

  submitData = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.validateData();
    }
  };

  validateData = () => {
    console.log('validateData -- ');
    let self = this;
    this.props.validate(function(error) {
      if (!error) {       
          //self.setState({ isLoading: true });
          self.handleSubmit();        
      }
    });
  };

  handleCompanyChange = newValue => {
    if(newValue.value == 1){
       
        // this.validatorTypes.rules['companyName'] = 'required|companyName';
        // this.validatorTypes.messages['required.companyName'] =
        //                                         'Please enter companyName';
        this.setState({otherCompanyName: true});
    }else{
        // this.validatorTypes.rules['companyName'] = '';
        // this.validatorTypes.messages['required.companyName'] =
        //                                         'Please enter companyName';
    }
        this.setState({
        company: newValue
        });
    
  };

  handleSubmit() {
    let firstName = this.state.firstName.trim();
    let lastName = this.state.lastName.trim();
    let email = this.state.email.toLowerCase().trim();
 //   let password = encrypt(this.state.newPassword.trim());
    let roleId = 3;
    let userId = this.state.userId;
    let deviceId = this.state.deviceId;
    console.log(this.state.company);
    let companyName = this.state.company && this.state.company.value !== 1? this.state.company.label: this.state.companyName;
    let companyId= this.state.company && this.state.company.value !== 1 ? this.state.company.value: null
    let students = [];    
    let self = this;

      let data = {
        firstName,
        lastName,
        email,
  //      password,
      //  dob,
    //    parentEmail,
     //   parentFirstName,
     //   parentLastName,
        roleId,
        companyId,
        companyName,
    //    invite,
         userId:''
      };

      console.log(data);

      theRapidHireApiService('signupHR', data)
        .then(response => {
          if (response.data.status === 'Success') {
            if (
              self.state.invite === CONSTANTS.INVITE_1 ||
              self.state.invite === CONSTANTS.INVITE_2 ||
              self.state.invite === CONSTANTS.INVITE_3
            ) {
              let loginData = {
                email,                
                deviceId
              };

              this.props
                .actionUserLogin(loginData)
                .then(response => {
                  if (
                    response.payload &&
                    response.payload.data.status === 'Success'
                  ) {
                    self.setState({
                      isLoading: false
                    });
                    const userResponse = response.payload.data.result;
                    if (userResponse && userResponse.token) {
                      if (userResponse.roleId === 1) {                     
                      
                      }
                    }
                  }
                })
                .catch(error => {
                  self.setState({
                    isLoading: false,
                    password: ''
                  });
                  console.log('err', error);
                });
            } else {
              self.setState({
                isLoading: false,
                firstName: '',
                lastName: '',
                email: '',
                newPassword: '',
                confirmNewPassword: '',
                // day: '',
                // month: '',
                // year: '',
                // parentFirstName: '',
                // parentLastName: ''
              });
              setTimeout(function() {
                self.props.history.push('/login');
              }, 5000);
            }
          } else {
            self.setState({ isLoading: false });
          }
        })
        .catch(err => {
          self.setState({ isLoading: false });
          console.log(err);
        }); 
  
  }

  selectDate(type, value) {
    if (this.state.roleId === CONSTANTS.STUDENT_ROLE) {
      if (type === 'year') {
        this.setState({ year: value }, () => this.checkAge());
      }
      if (type === 'month') {
        this.setState({ month: value }, () => this.checkAge());
      }
      if (type === 'day') {
        this.setState({ day: value }, () => this.checkAge());
      }
    } else if (this.state.roleId === CONSTANTS.PARENT_ROLE) {
      if (type === 'year') {
        this.setState({ year: value });
      }
      if (type === 'month') {
        this.setState({ month: value });
      }
      if (type === 'day') {
        this.setState({ day: value });
      }
    }
  }

  checkAge() {
    if (this.state.year && this.state.month && this.state.day) {
      let day = this.state.day;
      let month = Number(this.state.month);
      let year = this.state.year;

      let birthDate = new Date(year, month, day);
      var today = new Date();

      if (birthDate > today) {
        showErrorToast('Please select valid date');
      }

      let age = today.getFullYear() - birthDate.getFullYear();

      if (
        this.state.invite === CONSTANTS.INVITE_0 ||
        this.state.invite === CONSTANTS.INVITE_1 ||
        this.state.invite === CONSTANTS.INVITE_2 ||
        this.state.invite === CONSTANTS.INVITE_3
      ) {
        this.setState({
          parentField: false
        });
      } else if (age <= 13) {
        this.setState({
          parentField: true
        });
        this.validatorTypes.rules['parentEmail'] = 'required|email';
        this.validatorTypes.messages['required.parentEmail'] =
          'Please enter parent email address';
        this.validatorTypes.messages['email.parentEmail'] =
          'Please enter a valid parent email address';

        this.validatorTypes.rules['parentFirstName'] =
          'required|regex:' + regExpressions.alphaOnly;
        this.validatorTypes.messages['required.parentFirstName'] =
          validationMessages.parentName.required;
        this.validatorTypes.messages['regex.parentFirstName'] =
          validationMessages.parentName.alphaOnly;
      } else {
        this.setState({
          parentField: false,
          parentFirstName: '',
          parentEmail: ''
        });
        this.validatorTypes.rules['parentEmail'] = 'email';
        this.validatorTypes.messages['required.parentEmail'] = '';
        this.validatorTypes.messages['email.parentEmail'] =
          'Please enter a valid parent email address';

        this.validatorTypes.rules['parentFirstName'] =
          'regex:' + regExpressions.alphaOnly;
        this.validatorTypes.messages['required.parentFirstName'] = '';
      }
    }
  }  


  render() {
    const { isLoading } = this.state;
    var readOnly = false;
    if (
      this.state.invite === CONSTANTS.INVITE_0 ||
      this.state.invite === CONSTANTS.INVITE_1 ||
      this.state.invite === CONSTANTS.INVITE_2 ||
      this.state.invite === CONSTANTS.INVITE_3
    ) {
      readOnly = true;
    } else {
      readOnly = false;
    }
    return (
    <div className="wrapper">        
      <div className="main-panel">     
        <div className="login_card">
           <div className="header">
       
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
          
        <div className="formContent forgotPasswordForm bg-transparent">
          <div className="centeredBox p-7">      
          <div className="flex align-center mb-1">
                  <Link to="/login" className="md-icon mr-1">
                    <span className="icon-back_arrow2" />
                  </Link>
                  <legend className="color-blue mb-0">Back To Login</legend>
                </div>     
                <Nav bsStyle="tabs" activeKey={4}>               
                <NavItem
                  eventKey={2}
                  onClick={() =>
                    this.props.history.push({
                      pathname: '/signup',
                      state: {
                        eventKey: 2
                      }
                    })
                  }
                >
                  Interviewer SIGN UP
                </NavItem>
                <NavItem
                  eventKey={1}
                  onClick={() =>
                    this.props.history.push({
                      pathname: '/signup',
                      state: {
                        eventKey: 1
                      }
                    })
                  }
                >
                  USER SIGN UP
                </NavItem>
                <NavItem
                  eventKey={4}                 
                >
                  HR SIGN UP
                </NavItem>
              </Nav>
           

            <form>
                      
              <FormGroup className={this.getClasses('company')}>
              <label className="form-label">Add Company</label>
              
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"                        
                        name="company"
                        value={this.state.company}
                        onChange={this.handleCompanyChange}
                        options={this.state.companyDetail}
                        placeholder="Select company"
                      />
                    </div>                   
                   
                    {renderMessage(this.props.getValidationMessages('company'))}
                </FormGroup>

                {this.state.otherCompanyName === true ?

                <FormGroup className={this.getClasses('companyName')}>
                    <label className="form-label">Company Name</label>
                  
                    <FormControl
                        type="text"
                        placeholder="Company Name"
                        name="companyName"
                        value={this.state.companyName}
                        onChange={this.handleChange}
                        autoComplete="off"
                        maxLength="35"
                    />
                  
                    {renderMessage(this.props.getValidationMessages('companyName'))}
                </FormGroup> : null}

              <FormGroup className={this.getClasses('firstName')}>
                <label className="form-label">First Name</label>
              
                  <FormControl
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    autoComplete="off"
                    maxLength="35"
                  />
               
                {renderMessage(this.props.getValidationMessages('firstName'))}
              </FormGroup>

              <FormGroup className={this.getClasses('lastName')}>
                <label className="form-label">Last Name</label>
           
                  <FormControl
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    autoComplete="off"
                    maxLength="35"
                  />
                
                {renderMessage(this.props.getValidationMessages('lastName'))}
              </FormGroup>

              <FormGroup className={this.getClasses('email')}>
                <label className="form-label">Email</label>
               
                  <FormControl
                    type="Email"
                    placeholder="Email"
                    name="email"                    
                    value={this.state.email}
                    onChange={this.handleChange}
                    autoComplete="off"
                    onKeyPress={this.submitData}
                  />
            
                {renderMessage(this.props.getValidationMessages('email'))}
              </FormGroup>

              {/* <FormGroup className={this.getClasses('newPassword')}>
                <label className="form-label">Password</label>
              
                  <FormControl
                    type="password"
                    placeholder="Password"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.handleChange}
                    maxLength="20"
                    autoComplete="new-password"
                  />
                
                {renderMessage(this.props.getValidationMessages('newPassword'))}
              </FormGroup>

              <FormGroup className={this.getClasses('confirmNewPassword')}>
                <label className="form-label">Confirm Password</label>
              
                  <FormControl
                    type="password"
                    placeholder="Confirm password"
                    name="confirmNewPassword"
                    value={this.state.confirmNewPassword}
                    onChange={this.handleChange}
                    maxLength="20"
                  />               
                {renderMessage(
                  this.props.getValidationMessages('confirmNewPassword')
                )}
              </FormGroup>
 */}

              <FormGroup>
                <Button
                  bsStyle="primary"
                  className="centeredBtn btn-lg"
                  disabled={isLoading}
                  onClick={!isLoading ? this.validateData : null}
                >
                  {isLoading ? 'In Progress...' : 'Sign Up'}
                </Button>
              </FormGroup>
            </form>
          </div> </div>
        </div>
      </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ actionUserLogin }, dispatch);
};

HRSignup = validation(strategy)(HRSignup);
export default connect(
  null,
  mapDispatchToProps
)(HRSignup);
