import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { Field, reduxForm } from 'redux-form';
//import renderField from 'components/FormInputs/renderField';
import {
  getLocalStorage,
  encrypt,
  decrypt,
  getIPAddress,
  ZoomInAndOut,
  renderMessage,
  showErrorToast
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

  componentWillMount() {}

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

    this.props
      .actionUserLogin(data)
      .then(response => {
        console.log(response);
        if (response.payload && response.payload.data.status === 'Success') {
          self.setState({ isLoading: false });
          const userResponse = response.payload.data.result;
          if (userResponse && userResponse.token) {
            if (userResponse.roleId === 1)
              self.props.history.push('/user/profile');
            else if (userResponse.roleId === 2)
              self.props.history.push('/interviewer/interviewerProfile');
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
      <main>
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <section className="authentication_wrapper d-flex align-items-center">
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-sm-offset-6">
                <div className="shadow_box p-5">
                  <h3 className="h4login text-center">Quick Login</h3>
                  <form>
                    <div className="form-group">
                      <label className="form-label">Email</label>
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
                        {renderMessage(
                          this.props.getValidationMessages('email')
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
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

                        {renderMessage(
                          this.props.getValidationMessages('password')
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group text-right">
                      <Link to="/forgot" className="forgotPass">
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="form-group">
                      <FormGroup>
                        <Button
                          bsStyle="success"
                          className="btn-lg btn-block mt-0"
                          disabled={isLoading}
                          onClick={!isLoading ? this.validateData : null}
                        >
                          {isLoading ? 'Checking Credentials...' : 'Sign In'}
                        </Button>
                      </FormGroup>

                      {/* <a style={{position :'absolute',right:'65px',bottom: '10px'}} href="https://theRapidHiremediastorage.blob.core.windows.net/theRapidHire-media-production/sv_1/PrivacyPolicy.html" target="_blank">
                                        Terms and Condition
                                    </a> */}
                    </div>
                    <p className="text-center">
                      Don't have an account?
                      <Link
                        to={{
                          pathname: '/signup',
                          state: {
                            eventKey: 2
                          }
                        }}
                        className="text-success"
                      >
                        {' '}
                        Register
                      </Link>
                    </p>
                  </form>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <Link to="" className="btn btn-primary btn-block btn-lg">
                        Facebook
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <Link to="" className="btn btn-danger btn-block btn-lg">
                        Google
                      </Link>
                    </div>
                  </div>
                </div>{' '}
              </div>
            </div>
          </div>
        </section>
      </main>
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
