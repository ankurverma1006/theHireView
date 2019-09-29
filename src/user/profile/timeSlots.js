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
import { ToastContainer } from 'react-toastify';
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
  getThumbImage,ZoomInAndOut
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
    let userId = this.props.user.userId;
    this.setState({userId:userId});
   this.bookedTimeSlot(userId);   
   this.getUserProfileData(userId);
  }

  componentDidMount() {  
    this.setTimeSlotForWeek();
  }

  getUserProfileData(userId){
    spikeViewApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);       
         let userProfile = response.data.result[0];     
        this.setState({userProfile:userProfile                  
         }); 
         this.setUserProfileData(userProfile);
      }
    })
    .catch(err => {
      console.log(err);
    });
  } 

  setTimeSlotForWeek(){  
    let timeSlotForWeek=[];
    for(var i=0;i<7;i++){
      let date = new Date();
      date.setDate(date.getDate() + i);    
     
      let finalDate = date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
      
      timeSlotForWeek.push({showDate:finalDate,date : new Date(moment().add('days', i).format("DD-MMM-YYYY")).valueOf() })
    }
    this.setState({timeSlotForWeek});
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
        this.bookedTimeSlot(this.state.userId,date)
      }
    })
    .catch(err => {
      console.log(err);
    });

  }

  dateChange(date){
   // console.log(new Date(moment(event.value).format("DD-MMM-YYYY")).valueOf() );
 //   let date= parseInt(new Date(moment(event.value).format("DD-MMM-YYYY")).valueOf());
  //  this.setState({newData:});
   this.bookedTimeSlot(this.state.userId,date);
   this.setState({selectedDate:date })
  }

 
  render() {
    let dateValue=new Date();
    let _this= this;
    return (
      <div className="wrapper">
       <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        /> 
      <Header {...this.props} />     
      <div className="main-panel">   
      <div className="">
      
      {this.state.userProfile ?   
      <div className="w3-row-padding">
      <div className="w3-third" style={{width: "fit-content","margin-left": "122px","padding-top": "15px"}}>
     <div className="w3-white w3-text-grey w3-card-4">
      <div className="w3-display-container " style={{overflow:"hidden"}}> 
      <div className="w3-container">
        {this.state.timeSlotForWeek && this.state.timeSlotForWeek.map((data) => (    
                     <p>    
                         <Button
                                      bsStyle="primary no-bold no-round mr-1"
                                        onClick={_this.dateChange.bind(
                                          _this,
                                          data.date                      
                                        )}
                                       >
                                       <span className="icon-share2" />
                                       {data.showDate}
                            </Button></p>
        ))}                               
        </div>
        </div>
        </div> </div>
        <div className="w3-twothird" style={{"padding-top": "15px"}}>
          <div className="w3-container w3-card w3-white w3-margin-bottom">    
            
               {/* <DatePickerComponent id="datepicker" onChange={this.dateChange.bind(this)} format='yyyy-MM-dd' placeholder='Enter date' />  */}

       
       <div className="time_slot_card">
        <div className="header">
          <h4 className="title">Avalilable TimeSlot</h4>
          <p className="category">Kindly select date then get the date</p>
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
       </div>:<div className="w3-content main-panel1">
                <div className="container main">
                  Kindly complete profile first
                  </div>
              </div>

            }
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
