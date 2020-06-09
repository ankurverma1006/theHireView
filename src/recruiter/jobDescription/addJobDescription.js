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
import Header from '../header/header';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
//import DatePicker from 'react-datepicker';
//import DatePicker from '../../../../assets/react-datepicker/es/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionGetStudentList } from '../../common/core/redux/actions';
import { actionSetStudentAsUser } from '../../common/core/redux/actions';
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
  showSuccessToast
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



class AddJobDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,     
      startDate: '',
      endDate: '',
      promptRecommendation: false,    
      userId: '',     
      todaysDate: false,    
      jobDescriptionDetail: {},     
      jobDescriptionListData: [],     
      designation:'',
      organisation:'',
      profileRoleList:[],
      titleNotAvailable:false,
      jobDescriptionModal:true,
      jobDescId:'',
      associateList: [],
      skillsList:[],
      locationList: [{
              value: 1 ,
              label: 'Indore'},
              {
                value: 2 ,
                label: 'Bhopal'},
                {
                  value: 2 ,
                  label: 'Dewas'}
              ]              
         
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
      //  projectName: 'required'
       
        // level3Competency: 'required',
        // skills: 'required',
        // importance: 'required',
        // //   startDate: 'required',
        // //  endDate: 'required',
        // firstName: ['regex:' + regExpressions.alphaOnly],
        // lastName: ['regex:' + regExpressions.alphaOnly],
        // email: 'email'
      },
      {
   //     'required.designation': validationMessages.designation.required
        
        // 'required.level3Competency': validationMessages.competency.required
        // 'required.skills': validationMessages.skills.required,
        // 'required.importance': validationMessages.importance.required,
        // //  'required.startDate': validationMessages.startDate.required,
        // //  'required.endDate': validationMessages.endDate.required,
        // 'email.email': validationMessages.email.invalid,
        // 'regex.firstName': validationMessages.firstName.alphaOnly,
        // 'regex.lastName': validationMessages.lastName.alphaOnly
      }
    );
    this.getKeySkillsList();
    this.getProfileRoleList();
  }


  getProfileRoleList(){
    theRapidHireApiService('getProfileRoleList')
    .then(response => {     
      console.log(response);
      if (response.data.status === 'Success') {
        let profileRoleList= this.state.profileRoleList;
        response.data.result.forEach(function(data){       
           profileRoleList.push({label: data.profileRole,value:data.profileRoleId })
        })  
       
        this.setState({profileRoleList: profileRoleList});
          }
        })
    .catch(err => {
      console.log(err);
    });
  }

  getKeySkillsList(){
    theRapidHireApiService('getKeySkillsList')
    .then(response => {     
      if (response.data.status === 'Success') {
         let skillsList= this.state.skillsList;      
         response.data.result.forEach(function(data){        
            skillsList.push({label: data.skillName,value:data.skillId })
        })   
       
         this.setState({skillsList: skillsList});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  setProfileData = data => {
    //console.log(data);
    if (data) {
      let userId = data.userId;
      let summary = data.summary;
      let firstName = data.firstName;
      let lastName = data.lastName;
      // let tagline = data.tagline.trim();
      // let editTag = data.tagline.trim();
      let tagline = data.tagline ? data.tagline.trim() : null;
      let editTag = data.tagline ? data.tagline.trim() : null;

      let name =
        (data.firstName ? data.firstName : '') +
        ' ' +
        (data.lastName ? data.lastName : '');
      let profileImage = data.profilePicture;
      if (profileImage) {
        profileImage =  profileImage;
      }
      let coverImage = data.coverImage;
      if (coverImage) {
        coverImage =  coverImage;
      }
      let isActive = data.isActive;
      this.setState({
        editTag,
        summary,
        firstName,
        lastName,
        userId,
        profileImage,
        coverImage,
        tagline,
        isActive,
        name
      });
    }
  };  

  closeAchievementyModal = status => {
    
    this.setState({      
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

  componentDidMount() {
    // if(this.props.user){
     let userId = this.props.userData.userId;
     this.setState({userId:userId})
    // }  
    console.log('this.props.employmentDetail ',this.props.jobDescriptionDetail);
    this.setJobDescriptionData(this.props.jobDescriptionDetail);
    this.getKeySkillsList();
    this.getJobDescriptionDetails(userId);
  }

  getJobDescriptionDetails(userId){
    theRapidHireApiService('getJobDescriptonListById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
         let jobDescriptionListData= this.state.jobDescriptionListData;
         jobDescriptionListData= response.data.result[0];         
         this.setState({jobDescriptionListData: jobDescriptionListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  setJobDescriptionData = data => { 
    if(data){ 
      this.setState({      
           recruiterId:data.recruiterId  ,
           title : data.title,
           companyId:data.companyId,
           description : data.description,
           noOfPosition : data.noOfPosition,
           minExperience : data.minExperience,                
           maxExperience : data.maxExperience,    
           location :data.location,      
           skills:data.skills,
           postedBy:data.postedBy,
           jobDescId:data.jobDescId                   
        })       
      }; 
  }

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
   let description = this.state.description;
   let noOfPosition = parseInt(this.state.noOfPosition,10);
   let minExperience = parseInt(this.state.minExperience,10);   
   let maxExperience = parseInt(this.state.maxExperience,10);    
   let location= [];
   this.state.location.forEach(function(item){
    location.push(item.label);
   })    
   let skills = [];     
   this.state.skills.forEach(function(item){
    skills.push({skillId:item.value,skillName:item.label});
   })   

   let title = this.state.profileRole && this.state.profileRole.label !== CONSTANTS.OTHER? this.state.profileRole.label: this.state.title;
   let titleId= this.state.profileRole && this.state.profileRole.label !== CONSTANTS.OTHER ? this.state.profileRole.value: null
   
    let userId = this.state.userId;
    let postedBy = this.props.user.userId;
    let jobDescId=  this.state.jobDescId;   

   
    let data = {
      title,
      titleId,
      userId,
      description,
      jobDescId,    
      noOfPosition,
      minExperience,
      maxExperience,
      location,
      postedBy,
      skills
    };

    let self = this;
   
    if (!this.state.jobDescId || this.state.jobDescId === '') {
      theRapidHireApiService('addJobDescription', data)
        .then(response => {
          if (response.data.status === 'Success') {      
            self.setState({ isLoading: false });
            showSuccessToast('Job Description added');
            self.closeJobDescriptionModal('save');
          } 
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log(error);
        });
    } else {
      theRapidHireApiService('getJobDescriptonListById', data)
        .then(response => {
          if (response.data.status === 'Success') {        
            self.closeJobDescriptionModal('save');
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


  handleProfileRoleChange = newValue => {
    if(newValue.label == CONSTANTS.OTHER){      
        this.setState({titleNotAvailable: true});
    }else{
      this.setState({titleNotAvailable: false});
    }
    this.setState({
      profileRole: newValue
    });    
  };

 
  handleLocationChange = newValue => {
    this.setState({
      location: newValue
    });
  };

  handleSkillsChange = newValue => {
    this.setState({
      skills: newValue
    });
  };
  

  closeJobDescriptionModal = status => {   
    this.setState({
      jobDescriptionModal: false
      
    });   
    this.props.closeJobDescriptionComponent();
  };

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
    const CalendarContainer = ({ children }) => {
      const el = document.getElementById('calendar-portal');
      return <Portal container={el}>{children}</Portal>;
    };

    return (
      <Modal
      bsSize="large"
      show={this.state.jobDescriptionModal}
      onHide={this.closeJobDescriptionModal.bind(this, 'close')}
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
          Add Job Description    
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="clearfix">
      <Form horizontal className="lightBgForm">
              <Col sm={10}> 

               <FormGroup className={this.getClasses('profileRole')}>
                  <Col componentClass={ControlLabel} sm={3}>
                  select title
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"                        
                        name="location"
                        value={this.state.profileRole}
                        onChange={this.handleProfileRoleChange}
                        options={this.state.profileRoleList}
                        placeholder="Select all the location that you used along the way"
                      />
                    </div>
                    {renderMessage(this.props.getValidationMessages('profileRole'))}
                  </Col>
                </FormGroup>             
              {this.state.titleNotAvailable == true ?
                  <FormGroup
                      controlId="formControlsTextarea"
                      className={this.getClasses('title')}
                    >
                      <Col componentClass={ControlLabel} sm={3}>
                        <ControlLabel>Title</ControlLabel>
                      </Col>
                      <Col sm={9}>
                        <FormControl
                          placeholder="Add a title"
                          name="title"
                          value={this.state.title}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="100"
                        />
                        {renderMessage(this.props.getValidationMessages('tile'))}
                      </Col>
                    </FormGroup>:
                null}
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
                      placeholder="Add a description"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('description'))}
                  </Col>
                </FormGroup>

                <FormGroup className={this.getClasses('skills')}>
                  <Col componentClass={ControlLabel} sm={3}>
                   Skills
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        multi
                        className="form-control"                        
                        name="skills"
                        value={this.state.skills}
                        onChange={this.handleSkillsChange}
                        options={this.state.skillsList}
                        placeholder="Select skill"
                      />
                    </div>
                    {renderMessage(this.props.getValidationMessages('skills'))}
                  </Col>
                </FormGroup>

                 <FormGroup className={this.getClasses('location')}>
                  <Col componentClass={ControlLabel} sm={3}>
                    Desired Location
                  </Col>
                  <Col sm={9}>
                    <div className="custom-select">
                      <span className="icon-down_arrow selectIcon" />
                      <Select
                        className="form-control"
                        multi
                        name="location"
                        value={this.state.location}
                        onChange={this.handleLocationChange}
                        options={this.state.locationList}
                        placeholder="Select all the location that you used along the way"
                      />
                    </div>
                    {renderMessage(this.props.getValidationMessages('location'))}
                  </Col>
                </FormGroup>

              <FormGroup className="addDateInput"> 
                <Col componentClass={ControlLabel} sm={3}>
                       Experience
                </Col>                
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                      <FormControl
                          componentClass="select"
                          placeholder="minExperience"
                          name="minExperience"
                          value={this.state.minExperience}                          
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >                        
                       <option value="">min exp</option>
                       <option value={1}>1</option>
                       <option value={2}>2</option>
                       <option value={3}>3</option>
                       <option value={4}>4</option>
                       <option value={5}>5</option>    
                       <option value={6}>6</option>        
                       <option value={7}>7</option>
                       <option value={8}>8</option>
                       <option value={9}>9</option>
                       <option value={10}>10</option>
                       <option value={11}>11</option>    
                       <option value={12}>12</option>                                      
                      </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('expectedSalaryInlakh')
                        )}
                      </div>
                      <div className="form-group">
                      <FormControl
                          componentClass="select"
                          placeholder="maxExperience"
                          name="maxExperience"
                          value={this.state.maxExperience}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >      
                        <option value="">max exp</option>
                       <option value={1}>1</option>
                       <option value={2}>2</option>
                       <option value={3}>3</option>
                       <option value={4}>4</option>
                       <option value={5}>5</option>    
                       <option value={6}>6</option>        
                       <option value={7}>7</option>
                       <option value={8}>8</option>
                       <option value={9}>9</option>
                       <option value={10}>10</option>
                       <option value={11}>11</option>    
                       <option value={12}>12</option>                                      
                      </FormControl>                 
                      </div>                     
                    </div>                   
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>        
    

                <FormGroup
                  controlId="formControlsTextarea"
                  className={this.getClasses('noOfPosition')}
                >
                  <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>No Of position needed</ControlLabel>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      placeholder="No. of Positions"
                      name="noOfPosition"
                      value={this.state.noOfPosition}
                      onChange={this.handleChange}
                      autoComplete="off"
                      maxLength="100"
                    />
                    {renderMessage(this.props.getValidationMessages('noOfPosition'))}
                  </Col>
                </FormGroup>        
               
              </Col>      </Form>      
              </Modal.Body>
          <Modal.Footer className="right flex align-center custom-left">
       
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
              className="btn btn-secondary btn btn-default"
              onClick={this.closeJobDescriptionModal.bind(this, 'close')}              
            >
              Close
            </Button>
           
           </Modal.Footer>
           </Modal>          
            
     
    );
  }
}
AddJobDescription = validation(strategy)(AddJobDescription);
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



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddJobDescription);
