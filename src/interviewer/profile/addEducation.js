import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  Col,
  Row,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

//import 'react-datepicker/dist/react-datepicker.css';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import ImageCropper from '../../common/cropper/imageCropper';
import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  ZoomInAndOut,
  generateTimestamp,
  getThumbImage
} from '../../common/commonFunctions';
import theRapidHireApiService from '../../common/core/api/apiService';
import { actionListOragnization } from '../../common/core/redux/actions';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';

let AsyncTypeahead = asyncContainer(Typeahead);
let validationMessages = CONSTANTS.validationMessages;

class addEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      educationModal: true,
      organizationId: '',
      instituteName: '',
      city: '',
      // fieldOfStudy: '',
      // grade: '',
      description: '',
      userId: '',
      isActive: true,
      educationId: '',
      listOragnization: [],
      searchText: '',
      fromYear: '',
      toYear: '',
      fromGrade: '',
      toGrade: '',
      oragnizationPreview: '',
      oragnizationLogo: '',
      oragnizationFile: '',
      isToGrade: '',
      isToYear: '',
      imageSource: '',
      degreeList: [],
      specializationList: [],
      degree: '',
      specialization: '',
      educationFromYear: '',
      educationToYear: ''
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.uploadImageToAzure = this.uploadImageToAzure.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        instituteName: 'required',

        fromYear: 'required',
        toYear: 'required'
      },
      {
        'required.instituteName': validationMessages.instituteName.required,

        'required.fromYear': validationMessages.fromYear.required,
        'required.toYear': validationMessages.toYear.required
      }
    );
  }

  componentWillMount() {
    // this.listOragnization();
    this.getDegree();
    this.getSpecialization();
  }

  getDegree() {
    theRapidHireApiService('getDegree')
      .then(response => {
        if (response.data.status === 'Success') {
          let degreeList = this.state.degreeList;
          console.log(response.data.result);
          degreeList = response.data.result;
          this.setState({ degreeList: degreeList });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getSpecialization() {
    theRapidHireApiService('getSpecialization')
      .then(response => {
        if (response.data.status === 'Success') {
          let specializationList = this.state.specializationList;
          console.log(response.data.result);
          specializationList = response.data.result;
          this.setState({ specializationList: specializationList });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    console.log(this.props.educationMode);
    if (this.props.user) {
      this.setState({
        userId: this.props.user.userId,
        isActive: this.props.user.isActive
      });
    }

    if (this.props.educationDetail) {
      let data = this.props.educationDetail;
      // let logo = data.logo !== '' ? getThumbImage('medium', data.logo) : '';
      this.setState({
        educationId: data.educationId,
        instituteName: data.organization.name,
        //     city: data.city,
        // fromGrade: data.fromGrade,
        //    toGrade: data.toGrade,
        // educationFromYear: data.fromYear,
        // educationToYear: data.toYear,
        grade: data.grade,
        degree: data.degreeId,
        specialization: data.specializationId,
        fromYear: data.fromYear,
        toYear: data.toYear,
        organizationId: data.organizationId,
        ///    oragnizationPreview: logo,
        //    oragnizationLogo: data.logo,
        //grade: data.grade,
        //fieldOfStudy: data.fieldOfStudy,
        description: data.description
        //startDate: moment(data.fromDate),
        //endDate: moment(data.toDate)
      });
    }
  }

  closeEducationModal = () => {
    this.setState({
      educationModal: false
    });
    this.props.closeEducationComponent();
  };

  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  handleImageChange = event => {
    this.setState({ imageSource: '' });
    const file = event.target.files[0];
    const fileName = file.name;
    const fileType = file.type;
    if (file) {
      //this.generateSASToken();
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = event => {
        this.setState({
          // oragnizationFile: file,

          imageSource: event.target.result,
          imageName: fileName,
          imageType: fileType,
          action: 1
        });
      };
    }
  };

  // generateSASToken() {
  //   theRapidHireApiService('getSASToken')
  //     .then(response => {
  //       if (response.data.status === 'Success') {
  //         let sasToken = response.data.result.sasToken;
  //         this.setState({ sasToken });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCompare = (fromValue, toValue, key) => {
    if (fromValue !== '' && toValue !== '') {
      let fromValueNum = parseInt(fromValue, 10);
      let toValueNum = parseInt(toValue, 10);
      if (key === 1) {
        if (fromValueNum > toValueNum) {
          console.log('if', this.validatorTypes);
          this.validatorTypes.rules['isToGrade'] = 'required';
          this.validatorTypes.messages['required.isToGrade'] =
            'The ToGrade must be greater than FromGrade';
        } else {
          console.log('else', this.validatorTypes);
          this.validatorTypes.rules['isToGrade'] = '';
          this.validatorTypes.messages['required.isToGrade'] = '';
        }
      } else if (key === 2) {
        if (fromValueNum > toValueNum) {
          console.log('if', this.validatorTypes);
          this.validatorTypes.rules['isToYear'] = 'required';
          this.validatorTypes.messages['required.isToYear'] =
            'The ToYear must be greater than FromYear';
        } else {
          console.log('else', this.validatorTypes);
          this.validatorTypes.rules['isToYear'] = '';
          this.validatorTypes.messages['required.isToYear'] = '';
        }
      }
    }
  };

  handleToYear = event => {
    let toYear = this.state.educationToYear;
    let DOB =
      this.props.user && this.props.user.dob
        ? moment(this.props.user.dob).format('YYYY')
        : '';

    if (
      toYear &&
      this.props.educationMode === 2 &&
      parseInt(DOB, 10) > parseInt(toYear, 10)
    ) {
      var x = document.getElementById('toYearSelect');
      var selectBoxLength = document.getElementById('toYearSelect').length;
      x.remove(selectBoxLength - 2);
    }
    this.setState({ [event.target.name]: event.target.value });
    this.handleCompare(this.state.fromYear, event.target.value, 2);
  };

  handleFromYear = event => {
    let fromYear = this.state.educationFromYear;
    let DOB =
      this.props.user && this.props.user.dob
        ? moment(this.props.user.dob).format('YYYY')
        : '';

    if (
      fromYear &&
      this.props.educationMode === 2 &&
      parseInt(DOB, 10) > parseInt(fromYear, 10)
    ) {
      var x = document.getElementById('fromYearSelect');
      var selectBoxLength = document.getElementById('fromYearSelect').length;
      x.remove(selectBoxLength - 2);
    }
    this.setState({ [event.target.name]: event.target.value });
    this.handleCompare(event.target.value, this.state.toYear, 2);
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
    if (startDate.isAfter(endDate)) {
      endDate = startDate;
    }
    this.setState({ startDate, endDate });
  };

  validateData = () => {
    let self = this;
    console.log('add education -- ');

    this.props.validate(function(error) {
      if (!error) {
        self.setState({ isLoading: true });
        // if (self.state.oragnizationFile !== '') {
        //   self.uploadOragnizationLogo();
        // } else {
        self.handleSubmit();
        //   }
      }
    });
  };

  uploadImageToAzure(file) {
    if (file) {
      this.setState({
        oragnizationPreview: this.state.imageSource,
        oragnizationFile: file
      });
    }
  }

  uploadOragnizationLogo() {
    let AzureStorage = window.AzureStorage;
    let sasToken = this.state.sasToken;
    let userId = this.state.userId;
    let fileData = this.state.oragnizationFile;
    let fileName = generateTimestamp(fileData.name);
    let uploadPath = `sv_${userId}/${CONSTANTS.oragnizationAlbum}/${fileName}`;
    let self = this;

    const blobService = AzureStorage.Blob.createBlobServiceWithSas(
      CONSTANTS.azureBlobURI,
      sasToken
    );

    blobService.createBlockBlobFromBrowserFile(
      CONSTANTS.azureContainer,
      uploadPath,
      fileData,
      (error, result) => {
        if (result) {
          self.setState(
            {
              oragnizationLogo: uploadPath
            },
            () => {
              self.handleSubmit();
            }
          );
        }
        if (error) {
          console.log('error ', error);
        }
      }
    );
  }

  handleSubmit() {
    console.log('handle submit-- ');

    let organizationId = this.state.organizationId;
    let educationId = this.state.educationId;
    let userId = this.state.userId;
    let grade = this.state.grade;
    let fromYear = this.state.fromYear;
    let toYear = this.state.toYear;
    let degreeId = this.state.degree;
    let specializationId = this.state.specialization;
    // let fieldOfStudy = this.state.fieldOfStudy;
    //let grade = this.state.grade;
    // let fromDate =
    //   this.state.startDate !== ''
    //     ? moment(this.state.startDate).format('DD-MMM-YYYY')
    //     : '';
    // let toDate =
    //   this.state.endDate !== ''
    //     ? moment(this.state.endDate).format('DD-MMM-YYYY')
    //     : '';
    let description = this.state.description;
    let isActive = true;
    let type = CONSTANTS.typeSchool;
    let logo = this.state.oragnizationLogo;

    let data = {
      educationId,
      organizationId,
      userId,
      logo,
      degreeId,
      specializationId,
      grade,
      // degree,
      // field,
      fromYear,
      toYear,
      isActive,
      description,
      type
    };

    let self = this;
    console.log('this.state.educationId ', this.state.educationId);

    if (this.state.educationId === '') {
      theRapidHireApiService('addEducation', data)
        .then(response => {
          if (response && response.data.status === 'Success') {
            self.props.closeEducationComponent();
            self.props.getAllEducation();
            self.setState({ isLoading: false });
          } else {
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log('err', error);
        });
    } else {
      theRapidHireApiService('editEducation', data)
        .then(response => {
          if (response && response.data.status === 'Success') {
            self.props.closeEducationComponent();
            self.props.getAllEducation();
            self.setState({ isLoading: false, educationModal: false });
          } else {
            self.setState({ isLoading: false });
          }
        })
        .catch(error => {
          self.setState({ isLoading: false });
          console.log('err', error);
        });
    }
  }

  deleteEducation = educationId => {
    console.log(educationId);
    let data = {
      educationId
    };
    let self = this;
    if (educationId) {
      theRapidHireApiService('deleteEducation', data)
        .then(response => {
          if (response && response.data.status === 'Success') {
            self.props.closeEducationComponent();
            self.props.getAllEducation();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  listOragnization() {
    let self = this;
    this.props
      .actionListOragnization()
      .then(response => {
        if (response.payload && response.payload.data.status === 'Success') {
          let oragnizationData = response.payload.data.result;
          if (oragnizationData.length > 0) {
            let options = oragnizationData.map(function(item) {
              return {
                value: item.organizationId,
                label: item.name
              };
            });
            self.setState({ listOragnization: options, isLoading: false });
          } else {
            self.setState({ listOragnization: [], isLoading: false });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleInstituteChange = value => {
    console.log(value);
    if (value.length > 0) {
      let organizationId = value[0].value;
      let instituteName = value[0].label;
      console.log(organizationId, instituteName);
      this.setState({
        organizationId,
        instituteName
      });
    }
  };

  handleInputChange = value => {
    this.setState({
      instituteName: value
    });
  };

  renderFromYearDropdown() {
    const yearList = [];
    let fromYear = this.state.educationFromYear;

    let DOB =
      this.props.user && this.props.user.dob
        ? moment(this.props.user.dob).format('YYYY')
        : '';

    if (DOB === 0 || DOB === null || DOB === '') {
      let current_year = moment().format('YYYY') - 49;
      DOB = current_year;
    }
    console.log(fromYear);
    console.log(DOB);
    yearList.push(
      <option value="" key={''}>
        Year
      </option>
    );

    if (
      parseInt(fromYear, 10) &&
      parseInt(DOB, 10) &&
      parseInt(DOB, 10) > parseInt(fromYear, 10) &&
      this.props.educationMode === 2
    ) {
      yearList.push(
        <option value={fromYear} key={fromYear}>
          {fromYear}
        </option>
      );
    }

    for (var i = DOB; i <= CONSTANTS.toYear; i++) {
      yearList.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return yearList;
  }

  renderToYearDropdown() {
    let toYear = this.state.educationToYear;

    const yearList = [];
    let DOB =
      this.props.user && this.props.user.dob
        ? moment(this.props.user.dob).format('YYYY')
        : '';

    if (DOB === 0 || DOB === null || DOB === '') {
      let current_year = moment().format('YYYY') - 49;
      DOB = current_year;
    }

    yearList.push(
      <option value="" key={''}>
        Year
      </option>
    );

    if (
      parseInt(toYear, 10) &&
      parseInt(DOB, 10) &&
      parseInt(DOB, 10) > parseInt(toYear, 10) &&
      this.props.educationMode === 2
    ) {
      yearList.push(
        <option value={toYear} key={toYear}>
          {toYear}
        </option>
      );
    }

    for (var i = DOB; i <= CONSTANTS.toYear; i++) {
      yearList.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return yearList;
  }

  renderGradeDropdown() {
    const gradeArray = [
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
      '11th',
      '12th'
    ];
    const gradeList = [];
    gradeList.push(
      <option value="" key={''}>
        Grade
      </option>
    );
    for (var i = 0; i <= gradeArray.length - 1; i++) {
      gradeList.push(
        <option value={gradeArray[i]} key={i}>
          {gradeArray[i]}
        </option>
      );
    }
    return gradeList;
  }

  render() {
    const { isLoading } = this.state;
    return (
      <Modal
        bsSize="large"
        show={this.state.educationModal}
        onHide={this.closeEducationModal}
        backdrop="static"
        keyboard={false}
      >
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />

        {this.state.imageSource ? (
          <ImageCropper
            imageSource={this.state.imageSource}
            imageName={this.state.imageName}
            imageType={this.state.imageType}
            aspectRatio={1 / 1}
            modalSize={this.state.action === 1 ? 'medium' : 'large'}
            cropBoxWidth={this.state.action === 1 ? '200' : '700'}
            cropBoxHeight={this.state.action === 1 ? '200' : '700'}
            uploadImageToAzure={this.uploadImageToAzure}
          />
        ) : null}
        <Modal.Header closeButton>
          <Modal.Title className="subtitle text-center">
            EDUCATION INFO
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal className="lightBgForm clearfix">
            <Col sm={9}>
              <FormGroup
                controlId="formHorizontalEmail"
                className={this.getClasses('instituteName')}
              >
                <Col componentClass={ControlLabel} sm={3}>
                  Institute
                </Col>
                <Col sm={9}>
                  <AsyncTypeahead
                    minLength={2}
                    isLoading={this.state.isLoading}
                    labelKey={'label'}
                    placeholder="Search Institute"
                    onSearch={this.listOragnization.bind(this)}
                    options={this.state.listOragnization}
                    name="instituteName"
                    value={this.state.instituteName}
                    onChange={this.handleInstituteChange}
                    allowNew={true}
                    newSelectionPrefix="Add Oragnization"
                    onInputChange={this.handleInputChange}
                    searchText={this.state.searchText}
                    defaultInputValue={this.state.instituteName}
                  />
                  {renderMessage(
                    this.props.getValidationMessages('instituteName')
                  )}
                </Col>
              </FormGroup>
              <FormGroup
                controlId="formHorizontalPassword"
                className={this.getClasses('grade')}
              >
                <Col componentClass={ControlLabel} sm={3}>
                  Grade
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="text"
                    placeholder="Ex: A"
                    name="grade"
                    value={this.state.grade}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  {renderMessage(this.props.getValidationMessages('grade'))}
                </Col>
              </FormGroup>

              <div>
                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Degree
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <FormControl
                          componentClass="select"
                          placeholder="degree"
                          name="degree"
                          value={this.state.degree}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                          <option value="" disabled>
                            degree
                          </option>
                          {this.state.degreeList &&
                            this.state.degreeList.map((ass, i) => (
                              <option value={ass.degreeId}>{ass.name}</option>
                            ))}
                        </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('degree')
                        )}
                      </div>
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>
              </div>

              <div>
                <FormGroup className="addDateInput">
                  <Col componentClass={ControlLabel} sm={3}>
                    Field
                  </Col>
                  <Col sm={9}>
                    <div className="dob">
                      <div className="form-group">
                        <FormControl
                          componentClass="select"
                          placeholder="specialization"
                          name="specialization"
                          value={this.state.specialization}
                          onChange={this.handleChange}
                          autoComplete="off"
                          maxLength="1000"
                        >
                          <option value="" disabled>
                            field
                          </option>
                          {this.state.specializationList &&
                            this.state.specializationList.map((ass, i) => (
                              <option value={ass.specializationId}>
                                {ass.name}
                              </option>
                            ))}
                        </FormControl>
                        {renderMessage(
                          this.props.getValidationMessages('field')
                        )}
                      </div>
                    </div>
                    {/* {renderMessage(this.props.getValidationMessages('endDate'))} */}
                  </Col>
                </FormGroup>
              </div>

              {/* <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={3}>
                  Grade
                </Col>
                <Col sm={9}>
                  <Row className="flex row customDatePicker">
                    <Col sm={6} className={this.getClasses('fromGrade')}>
                      <div className="line-between-form-controls">
                        <div className="custom-select">
                          <span className="icon-down_arrow selectIcon" />
                          <FormControl
                            componentClass="select"
                            placeholder="Grade"
                            onChange={this.handleFromGrade}
                            name="fromGrade"
                            value={this.state.fromGrade}
                          >
                            {this.renderGradeDropdown()}
                          </FormControl>
                        </div>
                      </div>
                      {renderMessage(
                        this.props.getValidationMessages('fromGrade')
                      )}
                    </Col>

                    <Col sm={6} className={this.getClasses('toGrade')}>
                      <div className="line-between-form-controls">
                        <div className="custom-select">
                          <span className="icon-down_arrow selectIcon" />
                          <FormControl
                            componentClass="select"
                            placeholder="Grade"
                            onChange={this.handleToGrade}
                            name="toGrade"
                            value={this.state.toGrade}
                          >
                            {this.renderGradeDropdown()}
                          </FormControl>
                        </div>
                      </div>
                      {renderMessage(
                        this.props.getValidationMessages('toGrade')
                      )}
                    </Col>
                    <Col sm={12}>
                      {renderMessage(
                        this.props.getValidationMessages('isToGrade')
                      )}
                    </Col>
                  </Row>
                </Col>
              </FormGroup> */}

              <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={3}>
                  From to Date
                </Col>
                <Col sm={9}>
                  <Row className="flex row customDatePicker">
                    <Col sm={6} className={this.getClasses('fromYear')}>
                      <div className="line-between-form-controls">
                        <div className="custom-select">
                          <span className="icon-down_arrow selectIcon" />
                          <FormControl
                            id="fromYearSelect"
                            componentClass="select"
                            placeholder="From"
                            onChange={this.handleFromYear}
                            onClick={this.handleFromClick}
                            //onSelect={this.handleFromYear}
                            name="fromYear"
                            value={this.state.fromYear}
                          >
                            {this.renderFromYearDropdown().reverse()}
                          </FormControl>
                        </div>
                      </div>
                      {renderMessage(
                        this.props.getValidationMessages('fromYear')
                      )}
                    </Col>
                    <Col sm={6} className={this.getClasses('toYear')}>
                      <div className="line-between-form-controls">
                        <div className="custom-select">
                          <span className="icon-down_arrow selectIcon" />
                          <FormControl
                            id="toYearSelect"
                            componentClass="select"
                            placeholder="To"
                            onChange={this.handleToYear}
                            name="toYear"
                            value={this.state.toYear}
                          >
                            {this.renderToYearDropdown().reverse()}
                          </FormControl>
                        </div>
                      </div>
                      {renderMessage(
                        this.props.getValidationMessages('toYear')
                      )}
                    </Col>
                    <Col sm={12}>
                      {renderMessage(
                        this.props.getValidationMessages('isToYear')
                      )}
                    </Col>
                  </Row>
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={3}>
                  Description
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    placeholder="Enter Here"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleChange}
                    autoComplete="off"
                    maxLength="500"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col sm={3}>
              <div className="modal-file-upload-box d-flex align-items-center justify-content-center">
                <input
                  type="file"
                  onChange={this.handleImageChange.bind(this)}
                  accept="image/*"
                  value=""
                  className="custom-fileUpload"
                />
                <div className="addProfileWrapper text-center">
                  {this.state.oragnizationPreview === '' ? (
                    <span className="icon-school icon lg-icon" />
                  ) : (
                    <img src={this.state.oragnizationPreview} alt="" />
                  )}
                  <div className="hover-section d-flex align-items-center justify-content-center">
                    <input
                      type="file"
                      onChange={this.handleImageChange.bind(this)}
                      accept="image/*"
                      value=""
                      className="custom-fileUpload"
                    />
                    <span class="icon-edit_pencil icon" />
                  </div>
                </div>
              </div>
            </Col>
            <div className="flex align-center justify-content-between fullWidth" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-content-between align-center">
            <div className="left">
              {this.state.educationId !== '' ? (
                <Button
                  bsStyle="danger"
                  onClick={this.deleteEducation.bind(
                    this,
                    this.state.educationId
                  )}
                >
                  Delete Education
                </Button>
              ) : (
                ''
              )}
            </div>
            <div className="right flex align-center">
              <Button
                bsStyle="primary"
                disabled={isLoading}
                onClick={!isLoading ? this.validateData : null}
              >
                {isLoading ? 'In Progress...' : 'Save'}
              </Button>

              <Button
                className="btn btn-secondary"
                onClick={this.closeEducationModal}
              >
                Close
              </Button>
            </div>
          </div>
          {/* <Button
            bsStyle="primary"
            className="no-bold no-round"
            disabled={isLoading}
            onClick={!isLoading ? this.validateData : null}
          >
            {isLoading ? 'In Progress...' : 'Save'}
          </Button>
          <Button
            bsStyle="default"
            className="no-bold no-round"
            onClick={this.closeEducationModal}
          >
            Close
          </Button>
          {this.state.educationId !== '' ? (
            <Button
              bsStyle="default"
              className="no-bold no-round btn btn-danger"
              onClick={this.deleteEducation.bind(this, this.state.educationId)}
            >
              Delete Education
            </Button>
          ) : (
            ''
          )*/}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.User.userData
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ actionListOragnization }, dispatch);
};

addEducation = validation(strategy)(addEducation);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addEducation);
