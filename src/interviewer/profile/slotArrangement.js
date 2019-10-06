import React, { Component } from 'react';
import Header from '../header/header';
import {
  Button,
  Media,
  Row,
  Col,
  FormControl,FormGroup,
  InputGroup
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { ToastContainer } from 'react-toastify';
import Slider from 'react-slick';
import _ from 'lodash';


import { Week, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query, Predicate, Internationalization } from '@syncfusion/ej2-data';


import { extend } from '@syncfusion/ej2-base';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
//import "@syncfusion/ej2-split-buttons/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
//import '../node_modules/@syncfusion/ej2/material.css';
//import CompetencyRecommendations from '../profile/competency/recommendations/competencyWiseRecommendations';
import ImageCropper from '../../common/cropper/imageCropper';
import DownloadLink from "react-download-link";
//import Img from '../../common/cropper/img';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
//import moment from 'moment';
import {
  showErrorToast,
  uploadToAzure,
  limitCharacter,
  SampleNextArrow,
  SamplePrevArrow,
  getThumbImage
} from '../../common/commonFunctions';
import theRapidHireApiService from '../../common/core/api/apiService';
import CONSTANTS from '../../common/core/config/appConfig';
//import AvailableTimes from 'react-available-times';
// import {
//   actionGetStudentPersonalInfo,
//   actionGetAllCompetency,
//   actionGetAchievementsByUser,
//   actionGetRecommendationsByUser,
//   actionUpdateUserInfo,
//   actionGetAchievementsData
// } from '../../common/core/redux/actions';
import achievementDefaultImage from '../../assets/img/default_achievement.jpg';
import SpiderChart from '../../common/spiderChart/spiderChart';




class SlotArrangement extends Component {
  constructor(props, context) {
    super(props);
    this.state = {      
      isOpen: false,
      startDate: new Date()
    };
  
    
    
  }

  componentWillMount() {
    //let userId = this.props.user.userId;
  
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
    document.body.classList.remove('home');
    document.body.classList.remove('fixedHeader');
  }

  componentWillReceiveProps(res) {
    
  }

  componentDidMount() {  
    this.getSlotList();
  }
 
  getSlotList(userId){
    theRapidHireApiService('getProjectListById',{userId})
    .then(response => {     
      if (response.data.statusCode === 200) {
         let projectListData= this.state.projectListData;
         projectListData= response.data.resourceData[0];
         this.setState({projectListData: projectListData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  onPopupOpen(args) {
    console.log(args);
    let self= this;
    let data={
      startTime: args.data.StartTime,
      endTime: args.data.EndTime,
      userId: 17
    };
    theRapidHireApiService('createSlot', data)
    .then(response => {
      if (response.data.statusCode === 200) {      
        self.setState({ isLoading: false });
        self.closeProjectModal('save');
      } 
    })
    .catch(error => {
      self.setState({ isLoading: false });
      console.log(error);
    });

    args.cancel = true;
}


 
  render() {
    return (
      <div className="innerWrapper">      
          <Header {...this.props} />    
 
  <div >
          <div >
            <div className="loader">
 <FormGroup
                    className={`fullWidthDatepicker `}>
                   
                    </FormGroup> 

      
</div></div></div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    student: state.Student
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
     
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotArrangement);
