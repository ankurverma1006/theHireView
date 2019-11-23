import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

//import HeaderBeforeLogin from './headerBeforeLogin';
import theRapidHireApiService from '../core/api/apiService';
import { ZoomInAndOut, renderMessage } from '../commonFunctions';
import CONSTANTS from '../core/config/appConfig';
import Sidebar from '../authorization/sideBar';

let validationMessages = CONSTANTS.validationMessages;

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: ''
    };

    this.handleButtonState = this.handleButtonState.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);

    this.validatorTypes = strategy.createSchema(
      {
        email: 'required|email'
      },
      {
        'required.email': validationMessages.email.required,
        'email.email': validationMessages.email.invalid
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

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitData = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleButtonState();
    }
  };

  handleButtonState() {
    let self = this;
    self.props.validate(function(error) {
      if (!error) {
        self.setState({ isLoading: true });
        self.handleSubmit();
      }
    });
  }

  handleSubmit() {
    let self = this;
    let email = self.state.email.toLowerCase().trim();
    theRapidHireApiService('forgotPassword', { email })
      .then(response => {
        if (response.data.status === 'Success') {
          self.setState({ email: '', isLoading: false });
          setTimeout(() => {
            self.props.history.push('/');
          }, 4000);
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
              <div className="col-md-6 offset-md-6">
                <div className="shadow_box p-3 p-md-5">
                  <Link to="/login" className="text-secondary">
                    <span className="icon-back_arrow2 mr-2" />
                    Back To Login
                  </Link>
                  <h3 className="h4login text-center">Forgot Password</h3>
                  <p className="lead mb-50">
                    <strong>
                      Reset your password by filling in your email address. You
                      will then receive an email with new password.
                    </strong>
                  </p>
                  <form className="forgotPasswordForm bg-transparent">
                    <FormGroup
                      style={{ position: 'relative' }}
                      className={this.getClasses('email')}
                    >
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
                          onKeyPress={this.submitData}
                        />
                      </InputGroup>
                      {renderMessage(this.props.getValidationMessages('email'))}
                    </FormGroup>
                    <FormGroup>
                      <Button
                        bsStyle="primary"
                        className="centeredBtn btn-lg"
                        disabled={isLoading}
                        onClick={!isLoading ? this.handleButtonState : null}
                      >
                        {isLoading ? 'In Progress...' : 'Reset'}
                      </Button>
                    </FormGroup>
                  </form>
                </div>
              </div>{' '}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

ResetPassword = validation(strategy)(ResetPassword);
export default ResetPassword;
