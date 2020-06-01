import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Slider from 'react-slick';
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
    const testimonial = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <main>
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />

        {/* Home page start */}

        <header>
          <div className="container">
            <div className="row header_row">
              <div className="col-cell"></div>
              <div className="col-cell">
                <div className="main-menu">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="javascript:;" className="menu-item active">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="javascript:;" className="menu-item">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link to="javascript:;" className="menu-item">
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link to="javascript:;" className="menu-item">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-cell"></div>
            </div>
          </div>
        </header>

        <section className="home_banner">
          <div className="container banner_content text-center">
            <h2 className="m-0">Providing Exceptional</h2>
            <h1 className="m-0">Recruitment Services</h1>
            <h6>
              WE Consultants are the pioneer of organised recruitment services
              in India. <br />
              Over the years, we have acted as preferred talent acquisition
              partner to multinationals and leading Indian.
            </h6>
          </div>
        </section>

        <section className="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="card about-card py-4">
                  <div className="card_body text-center">
                    <div className="service_icon mb-4">
                      <i
                        class="fa fa-paper-plane-o fa-fw"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <h4 className="mt-0 content_head">Aerospace & Defense</h4>
                    <p className="mb-0">
                      The Aerospace and Defense sector in India is closely
                      regulated by government
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="card about-card py-4">
                  <div className="card_body text-center">
                    <div className="service_icon mb-4">
                      <i class="fa fa-thumbs-o-up fa-fw" aria-hidden="true"></i>
                    </div>
                    <h4 className="mt-0 content_head">Development</h4>
                    <p className="mb-0">
                      The Developmental sector is a major contributor towards
                      the creation of infrastructure
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="card about-card py-4">
                  <div className="card_body text-center">
                    <div className="service_icon mb-4">
                      <i class="fa fa-newspaper-o fa-fw" aria-hidden="true"></i>
                    </div>
                    <h4 className="mt-0 content_head">Industrial</h4>
                    <p className="mb-0">
                      The Industrial sector in India is poised for a phase of
                      remarkable growth because
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="card about-card py-4">
                  <div className="card_body text-center">
                    <div className="service_icon mb-4">
                      <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
                    </div>
                    <h4 className="mt-0 content_head">Education</h4>
                    <p className="mb-0">
                      India currently has one of the largest higher Education
                      systems in the world and
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="container">
            <div className="header-block text-center">
              <div className="sub-heading">OUR SERVICES</div>
              <h2 className="heading">Best Service Ever</h2>
              <p>
                We offer a wide range of customized, high-quality,
                research-based talent consulting services. We are uniquely
                well-positioned to help address your talent needs by leveraging
                our know-how, relationships and service capabilities built over
                five decades.
              </p>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <div className="card service_card d-flex">
                  <div className="services-icon">
                    <i className="fa-fw fa fa-bar-chart"></i>
                  </div>
                  <div className="text-content pl-3">
                    <h4 className="content_head">Career Transition Services</h4>
                    <p className="mb-0">
                      Exclusive and Retained, our Executive Search Practice is
                      primarily focused on Board and CXO level leadership
                      hiring. Our goal is to deliver value to build adaptive
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <div className="card service_card d-flex">
                  <div className="services-icon">
                    <i className="fa-fw fa fa-bullhorn"></i>
                  </div>
                  <div className="text-content pl-3">
                    <h4 className="content_head">Executive Search</h4>
                    <p className="mb-0">
                      Exclusive and Retained, our Executive Search Practice is
                      primarily focused on Board and CXO level leadership
                      hiring. Our goal is to deliver value to each client we
                      serve
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <div className="card service_card d-flex">
                  <div className="services-icon">
                    <i className="fa-fw fa fa-cubes"></i>
                  </div>
                  <div className="text-content pl-3">
                    <h4 className="content_head">Global Sourcing</h4>
                    <p className="mb-0">
                      Global Sourcing is a specialist service that has been
                      developed to address the needs of global businesses
                      looking at employing Indian & Expatriate talent at
                      leadership / senior
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">
                <div className="card service_card d-flex">
                  <div className="services-icon">
                    <i className="fa-fw fa fa-life-ring"></i>
                  </div>
                  <div className="text-content pl-3">
                    <h4 className="content_head">Interim Management</h4>
                    <p className="mb-0">
                      Interim Management is the provision of senior executives
                      to manage change or transition on a short term basis. The
                      concept is prevalent in mature economies and is upcoming
                      in India.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial">
          <div className="container">
            <div className="header-block text-center">
              <div className="sub-heading">TESTIMONIALS</div>
              <h2 className="heading">Our Happy Client Review</h2>
            </div>
            <Slider {...testimonial}>
              <div className="card d-flex align-items-center">
                <div className="image">
                  <img
                    src="https://executivecareer.in/wp-content/uploads/2018/11/tastimonials_3.jpg"
                    className="img-responsive"
                  />
                </div>
                <div className="slider-content">
                  <p>
                    Your team has been a valuable recruitment partner for our
                    organization. Their understanding of our business needs and
                    organizational culture goes beyond just matching skills to
                    job descriptions
                  </p>
                  <strong>Shivam Gour</strong>
                </div>
              </div>
              <div className="card d-flex align-items-center">
                <div className="image">
                  <img
                    src="https://executivecareer.in/wp-content/uploads/2018/11/tastimonials_1.jpg"
                    className="img-responsive"
                  />
                </div>
                <div className="slider-content">
                  <p>
                    Your team has been a valuable recruitment partner for our
                    organization. Their understanding of our business needs and
                    organizational culture goes beyond just matching skills to
                    job descriptions
                  </p>
                  <strong>Shivam Gour</strong>
                </div>
              </div>
              <div className="card d-flex align-items-center">
                <div className="image">
                  <img
                    src="https://executivecareer.in/wp-content/uploads/2018/11/tastimonials_2.jpg"
                    className="img-responsive"
                  />
                </div>
                <div className="slider-content">
                  <p>
                    Your team has been a valuable recruitment partner for our
                    organization. Their understanding of our business needs and
                    organizational culture goes beyond just matching skills to
                    job descriptions
                  </p>
                  <strong>Shivam Gour</strong>
                </div>
              </div>
              <div className="card d-flex align-items-center">
                <div className="image">
                  <img
                    src="https://executivecareer.in/wp-content/uploads/2018/11/tastimonials_3.jpg"
                    className="img-responsive"
                  />
                </div>
                <div className="slider-content">
                  <p>
                    Your team has been a valuable recruitment partner for our
                    organization. Their understanding of our business needs and
                    organizational culture goes beyond just matching skills to
                    job descriptions
                  </p>
                  <strong>Shivam Gour</strong>
                </div>
              </div>
            </Slider>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="footer-top">
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="footer-content">
                    <ul className="list-unstyled footer-address mb-0">
                      <li className="d-flex py-2">
                        <i className="fa-fw fa fa-globe"></i>
                        <div className="pl-3">
                          Level 3, Cyber City, Gurugram, Haryana
                        </div>
                      </li>
                      <li className="d-flex py-2">
                        <i className="fa-fw fa fa-envelope"></i>
                        <div className="pl-3">
                          <a href="javascript:;">jobs@executivecareer.in</a>
                        </div>
                      </li>
                      <li className="d-flex py-2">
                        <i className="fa-fw fa fa-clock-o"></i>
                        <div className="pl-3">10:00 - 17:00</div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="footer-content">
                    <h3 className="footer-title">Company</h3>
                    <ul className="list-unstyled mb-0">
                      <li className="py-2">
                        <a href="javascript:;">Home</a>
                      </li>
                      <li className="py-2">
                        <a href="javascript:;">About Us</a>
                      </li>
                      <li className="py-2">
                        <a href="javascript:;">Services</a>
                      </li>
                      <li className="py-2">
                        <a href="javascript:;">Contact</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="footer-content">
                    <h3 className="footer-title">Opening Hours</h3>
                    <ul className="list-unstyled mb-0">
                      <li className="py-2">Mon – Fri : 10.00 – 18.00</li>
                      <li className="py-2">Sat – Sun : Closed</li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="footer-content">
                    <h3 className="footer-title">Subscribe Now</h3>
                    <p className="py-2 mb-0">
                      If You Have Any Questions, You Can Contact With Us So That
                      We Can Give You A Satisfying Answer. Subscribe To Our
                      Newsletter To Get Our Latest Products.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3 py-4 text-center">
              © 2019 All Rights Reserved
            </div>
          </div>
        </footer>

        {/* Home page end */}

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
