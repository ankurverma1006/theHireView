import React, { Component } from 'react';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import theRapidHireApiService from '../../common/core/api/apiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionGetStudentList } from '../../common/core/redux/actions';
import { actionSetStudentAsUser } from '../../common/core/redux/actions';
import { ToastContainer } from 'react-toastify';
import Select from 'react-select';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

import {
  renderMessage,
  setLocalStorage,
  showSuccessToast,
  showErrorToast,
  ZoomInAndOut
} from '../../common/commonFunctions';
import CONSTANTS from '../../common/core/config/appConfig';

let validationMessages = CONSTANTS.validationMessages;
let regExpressions = CONSTANTS.regExpressions;

class AddMoreStudent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      firstName: '',
      lastName: '',
      isLoading: false,
      studentMailList: [{ email: '' }],
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      companyDetail:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  //  this.handleAddMail = this.handleAddMail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.addStudentModelFun = this.addStudentModelFun.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        firstName: ['required', 'regex:' + regExpressions.alphaOnly],
        lastName: ['regex:' + regExpressions.alphaOnly],
        email: 'required|email'
      },
      {
        'required.firstName': validationMessages.firstName.required,
        'regex.firstName': validationMessages.firstName.alphaOnly,
        'regex.lastName': validationMessages.lastName.alphaOnly,
        'required.email': validationMessages.email.required,
        'email.email': validationMessages.email.invalid
      }
    );
  }

  componentDidMount() {
    if (this.props.parent) {
      this.props.parent['token'] = this.props.user['token'];
    }
    if (this.props.user) {
      let user = this.props.parent ? this.props.parent : this.props.user;
      this.setState({
        user: user,
        parentFirstName: user.firstName,
        parentLastName: user.lastName
      });
      if (this.props.user) {
        this.setState({
          addStudentModel: this.props.addStudentModel
        });
      }
    }
    this.getCompanyList();
  }

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

  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  validateData = () => {
    let self = this;
    this.props.validate(function(error) {
      console.log('error', error);
      if (!error) {
        self.setState({ isLoading: true });
        self.handleSubmit();
      }
    });
  };
 
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitData = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.validateData();
    }
  };

  //   checkStudentName = (index, event) => {
  //     let studentMailList = this.state.studentMailList;
  //     let self = this;
  //     if (event.target.value === '') return false;

  //     var filter = /^[A-Za-z\s]+$/;
  //     if (!filter.test(event.target.value)) {
  //       studentMailList[index]['firstName'] = '';
  //       this.setState({ studentMailList: studentMailList });
  //       showErrorToast('Invalid Student Name.');
  //     }
  //   };

  existMail = event => {
    let students = this.state.user.students;
    let studentMailList = this.state.studentMailList;
    let self = this;  

    if (event.target.value === '') return false;


  };

  handleSubmit() {
    let self = this;
    let createdBy = this.state.user.userId;
    let roleId = 3;
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let isActive = this.state.user.isActive;
    let email= this.state.email;    
    let companyName = this.state.company && this.state.company.value !== 1? this.state.company.label: this.state.companyName;
    let companyId= this.state.company && this.state.company.value !== 1 ? this.state.company.value: null
    console.log('state ', this.state);
    let data = {
      userId:'',
      firstName,
      lastName,
      email,
      roleId,   
      companyId,
      companyName,
      createdBy      
    };

    theRapidHireApiService('signupHR', data)
      .then(response1 => {        
            self.setState({ isLoading: false });   
                        
      })
      .catch(err => {
        console.log(err);
      });
  }

  addStudentModelFun() {
    this.setState({ addStudentModel: this.state.addStudentModel });
    this.props.closeAddStudentModel();
  }

  render() {
    let self = this;
    const { isLoading } = this.state;
    const cssClasses = {
      root: 'input-group mb-1',
      input: 'form-control'
    };
    const inputProps = {
      value: this.state.streetAddress1,
      onChange: this.onChange,
      placeholder: 'Street Address1',
      type: 'text'
    };
    const defaultStyles = {
      root: {
        position: 'relative',
        paddingBottom: '0px'
      },
      input: {
        display: 'inline-block',
        width: '100%',
        padding: '10px'
      },
      autocompleteContainer: {
        position: 'absolute',
        top: '100%',
        backgroundColor: 'white',
        border: '1px solid #555555',
        width: '100%'
      },
      autocompleteItem: {
        backgroundColor: '#ffffff',
        padding: '10px',
        color: '#555555',
        cursor: 'pointer'
      },
      autocompleteItemActive: {
        backgroundColor: '#fafafa'
      }
    };

    return (
      <div>
         <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <Modal
          //   bsSize="medium"
          show={this.state.addStudentModel}
          onHide={this.addStudentModelFun}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title className="subtitle text-center">
              Add New Candidate
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal className="lightBgForm">
              <Col sm={12}>

                <FormGroup className={`centeredRightLabel ${this.getClasses('company')}`}>
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

                <FormGroup className={`centeredRightLabel ${this.getClasses('companyName')}`}>
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

                <FormGroup
                  className={`centeredRightLabel ${this.getClasses(
                    'firstName'
                  )}`}
                >
                  <Col sm={4}>First Name</Col>
                  <Col sm={8}>
                    <FormControl
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={this.state.firstName}
                      //     onBlur={self.checkStudentName.bind(self, index)}
                      onChange={self.handleChange.bind(self)}
                      autoComplete="off"
                      maxLength="35"
                    />

                    {renderMessage(
                      this.props.getValidationMessages('firstName')
                    )}
                  </Col>
                </FormGroup>
                <FormGroup
                  className={`centeredRightLabel ${this.getClasses(
                    'lastName'
                  )}`}
                >
                  <Col sm={4}>Last Name</Col>
                  <Col sm={8}>
                    <FormControl
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={this.state.lastName}
                      //     onBlur={self.checkStudentName.bind(self, index)}
                      onChange={self.handleChange.bind(self)}
                      autoComplete="off"
                      maxLength="35"
                    />
                    {renderMessage(
                      this.props.getValidationMessages('lastName')
                    )}
                  </Col>
                </FormGroup>
                <FormGroup
                  className={`centeredRightLabel ${this.getClasses('email')}`}
                >
                  <Col sm={4}>Email</Col>
                  <Col sm={8}>
                    <FormControl
                      type="email"
                      name="email"
                      placeholder="Email "
                      value={this.state.email}
                      onBlur={self.existMail.bind(self)}
                      onChange={self.handleChange.bind(self)}
                      autoComplete="off"
                    />
                    {renderMessage(this.props.getValidationMessages('email'))}
                  </Col>
                </FormGroup>
              </Col>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary no-bold no-round mr-1"
              className="no-bold no-round"
              disabled={isLoading}
              onClick={!isLoading ? this.validateData : null}
            >
              {isLoading ? 'Loading...' : 'Save'}
            </Button>
            <Button
              bsStyle="default no-bold no-round"
              className="no-bold no-round"
              onClick={this.addStudentModelFun}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { actionGetStudentList, actionSetStudentAsUser },
    dispatch
  );
};

AddMoreStudent = validation(strategy)(AddMoreStudent);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMoreStudent);
