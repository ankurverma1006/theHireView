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
import moment from 'moment';

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
import spikeViewApiService from '../../common/core/api/apiService';
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

class TimeSlots extends Component {
  constructor(props, context) {
    super(props);
    this.state = {      
      isOpen: false,
      timeSlotData:[]
    };   
    
  }

  componentWillMount() {
    //let userId = this.props.user.userId;
   this.bookedTimeSlot(this.props.user.userId);
    document.body.classList.add('light-theme');
    document.body.classList.add('absoluteHeader');
    document.body.classList.remove('home');
    document.body.classList.remove('fixedHeader');
  }

  componentWillReceiveProps(res) {
    // this.setProfileData(res.user);
    // this.setAchievementData(res.student.achievementData);
    // this.renderRecommendationsByUserId();
  }

  componentDidMount() {  
    
  }
 
  bookedTimeSlot(userId,date){
    let data={
      userId:userId,
      slotRegisteredDate:date
    }
    spikeViewApiService('bookedTimeSlot',data)
    .then(response => {    
      console.log(response); 
      if (response.data.status === 'Success' ) {
         let timeSlotData= this.state.timeSlotData;
         timeSlotData= response.data.result;     
         this.setState({timeSlotData: timeSlotData});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  updateTimeSlot(data){
   let date=  this.state.selectedDate;
   data.userId = this.props.user.userId;    
    spikeViewApiService('modifySlot',data)
    .then(response => {    
      console.log(response); 
      if (response.data.status === 'Success') {
        this.bookedTimeSlot(this.props.user.userId,date)
      }
    })
    .catch(err => {
      console.log(err);
    });

  }

  dateChange(event){
    console.log(new Date(moment(event.value).format("DD-MMM-YYYY")).valueOf() );
    let date= parseInt(new Date(moment(event.value).format("DD-MMM-YYYY")).valueOf());
  //  this.setState({newData:});
   this.bookedTimeSlot(this.props.user.userId,date);
   this.setState({selectedDate:date })
  }

 
  render() {
    let dateValue=new Date();
    let _this= this;
    return (
      <div className="wrapper">
      <Header {...this.props} />     
      <div className="main-panel">   
         
         
           
         
         
 

  <DatePickerComponent id="datepicker" onChange={this.dateChange.bind(this)} format='yyyy-MM-dd' placeholder='Enter date' />

       
       
       
       
       <div className="time_slot_card">
        <div className="header">
          <h4 className="title">Table with Links</h4>
          <p className="category">Here is a subtitle for this table</p>
        </div>
        <div className="content table-responsive table-full-width">
          <table className="table table-hover table-striped">
            <thead>
              <tr>              
                <th>startTime</th>
                <th>EndTime</th>            
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.timeSlotData.map(data => (
                <tr key={data.slotId}>
                  <td>{moment(parseInt(data.startTimeStamp,10)).format("hh:mm:ss")}</td>
                  <td>{moment(parseInt(data.endTimeStamp,10)).format("hh:mm:ss")}</td>                                 
                  <td><Button
                          bsStyle="default"
                          className="no-bold no-round"
                          onClick={_this.updateTimeSlot.bind(_this, data)}              
                        >
                        Book
                       </Button></td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
       
       
       
       
       
       
       
        </div>
 
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
)(TimeSlots);
