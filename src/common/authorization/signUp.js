import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  Nav,
  NavItem
} from 'react-bootstrap';
// import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';

import Sidebar from './sideBar';
import FacebookLogin from 'react-facebook-login';
import theRapidHireApiService from '../core/api/apiService';
import {
  ZoomInAndOut,
  renderMessage,
  showErrorToast
} from '../commonFunctions';
import CONSTANTS from '../core/config/appConfig';
import moment from 'moment';
//import DatePicker from 'react-datepicker';
//import DatePicker from '../../assets/react-datepicker';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;
let i = 0;

class Signup extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      isLoading: false,
      firstName: '',
      lastName: '',
      email: '',
      parentEmail: '',
      parentFirstName: '',
      parentLastName: '',
      roles: [],
      roleId:
        this.props.location.state &&
        this.props.location.state.eventKey &&
        this.props.location.state.eventKey === 2
          ? 2
          : 1,
      eventKey:
        this.props.location.state &&
        this.props.location.state.eventKey &&
        this.props.location.state.eventKey === 2
          ? 2
          : 3,
      birthDate: '',
      isOpen: false,
      year: '',
      month: '',
      day: '',
      parentField: false,
      dob: ''
    };

    this.initialState = this.state;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.setValidatorTypes = this.setValidatorTypes.bind(this);
  }

  async componentWillMount() {
    this.getRoles();
    this.setValidatorTypes(
      this.props.location.state &&
        this.props.location.state.eventKey &&
        this.props.location.state.eventKey === 2
        ? 2
        : 3
    );
  }
  componentDidMount() {
    this.setDatePickerPlaceHolder();
  }

  setValidatorTypes(type) {
    let elementObject = {
      firstName: ['required', 'regex:' + regExpressions.alphaOnly],
      lastName: ['required', 'regex:' + regExpressions.alphaOnly],
      email: 'required|email'
    };

    let messageObject = {
      'required.firstName': validationMessages.firstName.required,
      'regex.firstName': validationMessages.firstName.alphaOnly,
      'required.lastName': validationMessages.lastName.required,
      'regex.lastName': validationMessages.lastName.alphaOnly,
      'required.email': validationMessages.email.required,
      'email.email': validationMessages.email.invalid
    };

    if (parseInt(type, 10) === 3) {
    }

    if (parseInt(type, 10) === 2) {
    }
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

  getRoles = () => {
    theRapidHireApiService('roleType', '')
      .then(response => {
        if (response.data.status === 'Success') {
          this.setState({ roles: response.data.result });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  setDatePickerPlaceHolder() {
    try {
      if (!this.state.birthDate)
        document.getElementsByName('date')[0].style.visibility = 'visible';
      else {
        document.getElementsByName('date')[0].style.visibility = 'hidden';
      }
    } catch (error) {}
  }

  submitData = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.validateData();
    }
  };

  validateData = () => {
    let self = this;
    this.props.validate(function(error) {
      if (!error) {
        var email = self.state.email
          ? self.state.email.toLowerCase().trim()
          : '';

        self.setState({ isLoading: true });
        self.handleSubmit();
      }
    });
  };

  handleSelect = eventKey => {
    if (eventKey !== this.state.roleId) {
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        parentEmail: '',
        parentFirstName: '',
        parentLastName: '',
        birthDate: '',
        month: '',
        day: '',
        year: ''
      });
    }

    this.setState({
      roleId: eventKey == 2 ? 2 : 1,
      eventKey: eventKey
    });
    this.props.clearValidations();
    this.setValidatorTypes(eventKey);
  };

  handleResetForm = () => {
    this.setState(this.initialState);
  };

  handleSubmit() {
    console.log('handleSubmit');
    let firstName = this.state.firstName.trim();
    let lastName = this.state.lastName.trim();
    let email = this.state.email.toLowerCase().trim();
    let roleId = this.state.roleId;

    let self = this;

    let data = {
      firstName,
      lastName,
      email,
      roleId
      // dob
    };

    theRapidHireApiService('signupUser', data)
      .then(response => {
        if (response.data.status === 'Success') {
          self.handleResetForm();
          setTimeout(function() {
            self.props.history.push('/login');
          }, 5000);
        } else {
          self.setState({ isLoading: false });
        }
      })
      .catch(err => {
        self.setState({ isLoading: false });
        console.log(err);
      });
  }

  render() {
    const { isLoading } = this.state;
    const responseFacebook = response => {
      console.log('facebook console');
      console.log(response);
      this.signup(response, 'facebook');
    };
    return (
      <div className="wrapper">
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <div className="main-panel">
          <div className="banner">
            <div className="overlay"></div>
            <div className="banner-content">
              <div className="">
                <div className="login_card">
                  <div className="header">
                    <FacebookLogin
                      appId="1928279157274431"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={responseFacebook}
                    />
                    <br />
                    <br />
                    <div className="formContent forgotPasswordForm bg-transparent">
                      <div className="centeredBox p-6">
                        <div
                          style={{ position: 'relative' }}
                          className="flex align-center mb-1"
                        >
                          <Link to="/login" className="md-icon mr-1">
                            <span className="icon-back_arrow2" />
                          </Link>
                          <legend className="color-blue mb-0">
                            Back To Login
                          </legend>
                        </div>

                        <Nav
                          bsStyle="tabs"
                          activeKey={this.state.eventKey == 2 ? 2 : 3}
                        >
                          <NavItem
                            eventKey={2}
                            onClick={this.handleSelect.bind(this, '2')}
                          >
                            Interviewer SIGN UP
                          </NavItem>

                          <NavItem
                            eventKey={3}
                            onClick={this.handleSelect.bind(this, '3')}
                          >
                            User SIGN UP
                          </NavItem>
                          <NavItem
                            eventKey={4}
                            onClick={() => this.props.history.push('/hrsignup')}
                          >
                            HR SIGN UP
                          </NavItem>
                        </Nav>
                        <form>
                          <FormGroup
                            style={{ position: 'relative' }}
                            className={this.getClasses('email')}
                          >
                            <label className="form-label">First Name</label>

                            {/* <InputGroup.Addon>
                    <span className="icon-username" />
                  </InputGroup.Addon> */}
                            <FormControl
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              value={this.state.firstName}
                              onChange={this.handleChange}
                              autoComplete="off"
                              maxLength="35"
                            />

                            {renderMessage(
                              this.props.getValidationMessages('firstName')
                            )}
                          </FormGroup>

                          <FormGroup
                            style={{ position: 'relative' }}
                            className={this.getClasses('lastName')}
                          >
                            <label className="form-label">Last Name</label>
                            {/* <InputGroup>
                  <InputGroup.Addon>
                    <span className="icon-username" />
                  </InputGroup.Addon> */}
                            <FormControl
                              type="text"
                              placeholder="Last Name"
                              name="lastName"
                              value={this.state.lastName}
                              onChange={this.handleChange}
                              autoComplete="off"
                              maxLength="35"
                            />
                            {renderMessage(
                              this.props.getValidationMessages('lastName')
                            )}
                          </FormGroup>

                          <FormGroup
                            style={{ position: 'relative' }}
                            className={this.getClasses('email')}
                          >
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
                            {renderMessage(
                              this.props.getValidationMessages('email')
                            )}
                          </FormGroup>

                          <FormGroup style={{ position: 'relative' }}>
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
                      </div>
                    </div>{' '}
                  </div>{' '}
                </div>
              </div>{' '}
            </div>{' '}
          </div>
        </div>
      </div>
    );
  }
}
Signup = validation(strategy)(Signup);
export default Signup;
