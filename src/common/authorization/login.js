import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import renderField from 'components/FormInputs/renderField';
import {
  getLocalStorage,
  encrypt,
  decrypt,
  getIPAddress,
  ZoomInAndOut,
  renderMessage
} from '../../common/commonFunctions';
import cube from '../../common/commonFunctions';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  Nav,
  NavItem
} from 'react-bootstrap';

import { actionUserLogin } from '../core/redux/actions';
import { actionSetStudentAsUser } from '../core/redux/actions';
import Sidebar from './sideBar';

import CONSTANTS from '../core/config/appConfig';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;

function getUrlParameter(name, url) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(url);
  // return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ''));
  return results === null ? '' : decodeURIComponent(results[1]);
}

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
      isLoading: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);

    this.validatorTypes = strategy.createSchema(
      {
        email: 'required|email',
        password: ['required', 'regex:' + regExpressions.passwordPattern]
      },
      {
        'required.email': validationMessages.email.required,
        'email.email': validationMessages.email.invalid,
        'required.password': validationMessages.password.required,
        'regex.password': validationMessages.password.passwordPattern
      }
    );
  }

  componentDidMount() {
    
    let _this = this;
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    if (!isEdge) {
      getIPAddress(function(ip) {
        _this.setState({
          deviceId: ip
        });
      });
    } else {
      _this.setState({
        deviceId: '0.0.0.0'
      });
    }
  }

  componentWillMount() {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('home');
    document.body.classList.remove('fixedHeader');

    this.setState({
      matchParam: this.props.match.params || {},
      matchUrl: this.props.match.url,
      search: this.props.location.search
    });
    let user = getLocalStorage('userInfo');

    if (this.props.match.url.indexOf('/autoLogin/') >= 0) {
      this.handleSubmit();
    } else if (
      user &&
      this.props.match.params &&
      parseInt(user.userId, 10) ===
        parseInt(this.props.match.params.userId, 10) &&
      this.props.match.params.recommendationId
    ) {
      this.props.history.push({
        pathname: '/student/recommendationrequest',
        state: {
          requestRecommendedId: this.props.match.params.recommendationId,
          userId: this.props.match.params.userId
        }
      });
    } else if (
      this.props.match.url.indexOf('/recommendation/') >= 0 &&
      this.props.match.params &&
      this.props.match.params.pass &&
      this.props.match.params.pass !== 'null' &&
      this.props.match.params.email
    ) {
      this.handleSubmit();
    } else if (
      this.props.match.url.indexOf('/previewprofile/') >= 0 &&
      this.props.match.params &&
      this.props.match.params.email &&
      this.props.match.params.pass &&
      this.props.match.params.pass !== 'null'
    ) {
      this.handleSubmit();
    } else if (
      this.props.match.url.indexOf('/previewprofile/') >= 0 &&
      this.props.match.params &&
      this.props.match.params.email &&
      this.props.match.params.pass === 'null' &&
      user &&
      user.email === this.props.match.params.email
    ) {
      this.props.history.push({
        pathname: '/student/previewprofile',
        state: { sharedId: this.props.match.params.id }
      });
    } else if (this.props.match.url.indexOf('/joingroup') >= 0) {
      let search = this.props.location.search;
      let parsedGroupId = getUrlParameter('groupId', search);
      let parsedEmail = getUrlParameter('email', search);
      let parsedPass = getUrlParameter('pass', search);
      if (parsedGroupId && parsedEmail && parsedPass && parsedPass !== 'null') {
        this.handleSubmit();
      } else if (
        parsedGroupId &&
        parsedEmail &&
        parsedPass &&
        parsedPass === 'null' &&
        user &&
        user.email === parsedEmail
      ) {
        this.props.history.push({
          pathname: '/student/groupListAll',
          state: {
            groupId: parsedGroupId,
            link: 'joingroup'
          }
        });
      }
    }
  }

  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
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

  submitData = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.validateData();
    }
  };

  handleSubmit() {
    let self = this;
    let email = null;
    let password = null;
    let url = this.state.matchUrl || this.props.match.url;
    let groupId = null;

    if (
      this.props.match.url.indexOf('/autoLogin/') >= 0 &&
      this.props.match.params &&
      this.props.match.params.user &&
      this.props.match.params.pass
    ) {
      email = this.props.match.params.user.trim();
      password = this.props.match.params.pass.trim();
    } else if (
      this.props.match.url.indexOf('/recommendation/') >= 0 &&
      this.props.match.params.email &&
      this.props.match.params.pass &&
      this.props.match.params.pass !== 'null'
    ) {
      email = this.props.match.params.email.toLowerCase().trim();
      password = this.props.match.params.pass.trim();
    } else if (
      this.props.match.url.indexOf('/previewprofile/') >= 0 &&
      this.props.match.params.email &&
      this.props.match.params.pass &&
      this.props.match.params.pass !== 'null'
    ) {
      email = this.props.match.params.email.toLowerCase().trim();
      password = this.props.match.params.pass.trim();
    } else if (url.indexOf('/joingroup') >= 0) {
      let search = this.state.search
        ? this.state.search
        : this.props.location.search;
      let parsedGroupId = getUrlParameter('groupId', search);
      let parsedEmail = getUrlParameter('email', search);
      let parsedPass = getUrlParameter('pass', search);
      if (parsedEmail && parsedPass && parsedPass !== 'null') {
        groupId = parsedGroupId;
        email = parsedEmail.toLowerCase().trim();
        password = parsedPass.trim();
      } else if (parsedGroupId) {
        groupId = parsedGroupId;
        email = this.state.email.toLowerCase().trim();
        password = encrypt(this.state.password.trim());
      }
    } else {
      email = this.state.email.toLowerCase().trim();
      password = encrypt(this.state.password.trim());
    }

    let deviceId = this.state.deviceId;

    let data = {
      email,
      password,
      deviceId
    };

    // this.props
    //   .actionUserLogin(data)
    //   .then(response => {
    //     if (response.payload && response.payload.data.status === 'Success') {
    //       if (
    //         self.state.matchParam.recommendationId &&
    //         response.payload.data.result.userId ===
    //           parseInt(self.state.matchParam.userId, 10)
    //       ) {
    //         self.props.history.push({
    //           pathname: '/student/recommendationrequest',
    //           state: {
    //             requestRecommendedId: self.state.matchParam.recommendationId,
    //             userId: self.state.matchParam.userId
    //           }
    //         });
    //       } else if (url.indexOf('/previewprofile/') >= 0) {
    //         self.props.history.push({
    //           pathname: '/student/previewprofile',
    //           state: { sharedId: self.state.matchParam.id }
    //         });
    //       } else if (url.indexOf('/joingroup') >= 0) {
    //         self.props.history.push({
    //           pathname: '/student/groupListAll',
    //           state: {
    //             groupId: groupId,
    //             link: 'joingroup'
    //           }
    //         });
    //       } else {
    //         self.setState({ isLoading: false });
    //         const userResponse = response.payload.data.result;
    //         if (userResponse && userResponse.token) {
    //           if (userResponse.roleId === 1) {
    //             self.props.history.push({
    //               pathname: '/student/profile',
    //               state: { pass: password }
    //             });
    //           } else if (userResponse.roleId === 2)
    //             self.props.history.push({
    //               pathname: '/parent/dashboard',
    //               state: { pass: password }
    //             });
    //         }
    //       }
    //     } else {
    //       self.setState({ isLoading: false, password: '' });
    //     }
    //   })
    this.props
    .actionUserLogin(data)
    .then(response => {
      console.log(response);      
      if (response.payload && response.payload.data.status === 'Success') {        
          self.setState({ isLoading: false });
          const userResponse = response.payload.data.result;
          if (userResponse && userResponse.token) {
            if (userResponse.roleId === 1)
              self.props.history.push('/user/dashboard');
            //&&                userResponse.students.length === 1
            else if (userResponse.roleId === 2)
              self.props.history.push('/interviewer/dashboard');
              else if (userResponse.roleId === 3)
              self.props.history.push('/recruiter/jobDesription');
              else if (userResponse.roleId === 4)
              self.props.history.push('/admin/candidate');
        }
      } else { 
        self.setState({ isLoading: false, password: '' });
      }
    })
      .catch(error => {
        self.setState({
          isLoading: false,
          password: ''
        });
        console.log('err', error);
      });
  }

  render() {
    const { isLoading } = this.state;
    return (
<div>   <div className="wrapper">
        
          <div className="main-panel">   
     
      <div className="login_card">
      <div className="header forgotPasswordForm bg-transparent">
        <h4 className="h4login">  <legend className="color-blue mb-0">Login</legend></h4>
      </div>     
      <div className="content">
        <form className="form-horizontal">
  
          <div className="form-group">
            <label className="col-md-3 control-label">Email</label>
            <div className="col-md-9">
            <FormGroup className={this.getClasses('email')}>
               
                  {/* <InputGroup.Addon>
                    <span className="icon-email" />
                  </InputGroup.Addon> */}
                  <FormControl
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
               
                {renderMessage(this.props.getValidationMessages('email'))}
              </FormGroup>    
            </div>
          </div>
  
          <div className="form-group">
            <label className="col-md-3 control-label">Password</label>
            <div className="col-md-9">
            <FormGroup className={this.getClasses('password')}>
              
                  {/* <InputGroup.Addon>
                    <span className="icon-password" />
                  </InputGroup.Addon> */}
                  <FormControl
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    autoComplete="off"
                    onKeyPress={this.submitData}                   
                  />
              
                {renderMessage(this.props.getValidationMessages('password'))}
              </FormGroup>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3"></label>
            <div className="col-md-9">
            <Link to="/forgot" className="forgotPass">
                Forgot Password?
              </Link>           
            </div>
          </div>
  

          <div className="form-group">
            <label className="col-md-3"></label>
            <div className="col-md-9">
            <FormGroup>
                <Button
                  bsStyle="primary"
                  className="centeredBtn btn-lg"
                  disabled={isLoading}
                  onClick={!isLoading ? this.validateData : null}
                >
                  {isLoading ? 'Checking Credentials...' : 'Sign In'}
                </Button>
              </FormGroup>
              <Link style={{position :'absolute',right:'20px',bottom: '107px'}} 
                                                                                                    to={{
                                                                                                      pathname: '/signup',
                                                                                                      state: {
                                                                                                        eventKey: 2
                                                                                                      }
                                                                                                    }}
                >
                      Register
                      </Link>       
              {/* <a style={{position :'absolute',right:'65px',bottom: '10px'}} href="https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/PrivacyPolicy.html" target="_blank">
           Terms and Condition
        </a> */}
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
       <div>
          {/* <a href="https://testflight.apple.com/join/7xaw03JI" className="app-btn">
            <img onerror="this.style.opacity='0'" src="../assets/img/App-Store.png" />
          </a>
          <a href="https://drive.google.com/file/d/15KFJVR8nIb5hSV7e-SGyXY_Od4GdRZYC/view?usp=sharing" className="app-btn">
            <img onerror="this.style.opacity='0'" src="../assets/img/Play-Store.png" />
          </a> */}
        </div>
        {/* <Sidebar /> */}
        {/* <ToastContainer
          autoClose={150000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        /> */}
        {/* <div className="form-content">
          <div className="centeredBox p-6">
            <Nav bsStyle="tabs" activeKey={1}>
              <NavItem eventKey={1}>LOGIN</NavItem>
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
                  onClick={() => this.props.history.push('/hrsignup')}
                >
                  HR SIGN UP
                </NavItem>
            </Nav>

            <form>
              <FormGroup className={this.getClasses('email')}>
                <InputGroup>
                  <InputGroup.Addon>
                    <span className="icon-email" />
                  </InputGroup.Addon>
                  <FormControl
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                </InputGroup>
                {renderMessage(this.props.getValidationMessages('email'))}
              </FormGroup>

              <FormGroup className={this.getClasses('password')}>
                <InputGroup>
                  <InputGroup.Addon>
                    <span className="icon-password" />
                  </InputGroup.Addon>
                  <FormControl
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    autoComplete="off"
                    onKeyPress={this.submitData}
                    maxLength="20"
                  />
                </InputGroup>
                {renderMessage(this.props.getValidationMessages('password'))}
              </FormGroup>

              <Link to="/forgot" className="forgotPass">
                Forgot Password?
              </Link>
              <FormGroup>
                <Button
                  bsStyle="primary"
                  className="centeredBtn btn-lg"
                  disabled={isLoading}
                  onClick={!isLoading ? this.validateData : null}
                >
                  {isLoading ? 'Checking Credentials...' : 'Sign In'}
                </Button>
              </FormGroup>
              <a style={{position :'absolute',right:'65px',bottom: '10px'}} href="https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/PrivacyPolicy.html" target="_blank">
           Terms and Condition
        </a>
            </form>
          </div>
        </div>        */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { actionUserLogin, actionSetStudentAsUser },
    dispatch
  );
};

Login = validation(strategy)(Login);
export default connect(
  null,
  mapDispatchToProps
)(Login);