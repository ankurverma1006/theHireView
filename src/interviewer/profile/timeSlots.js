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

 
//import Summary from './summary/addSummary';
//import Education from './education/addEducation';

//import DatePicker from 'react-datepicker';
//import DatePicker from 'react-date-picker';

import { Week, Month, Agenda,TimelineViews, TimelineMonth, ScheduleComponent, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject } from '@syncfusion/ej2-react-schedule';
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


var ownerData = [
  { text: 'Jammy', id: 1, color: '#ea7a57', capacity: 20, type: 'Conference' },
  { text: 'Tweety', id: 2, color: '#7fa900', capacity: 7, type: 'Cabin' },
  { text: 'Nestle', id: 3, color: '#5978ee', capacity: 5, type: 'Cabin' },
  { text: 'Phoenix', id: 4, color: '#fec200', capacity: 15, type: 'Conference' },
  { text: 'Mission', id: 5, color: '#df5286', capacity: 25, type: 'Conference' },
  { text: 'Hangout', id: 6, color: '#00bdae', capacity: 10, type: 'Cabin' },
  { text: 'Rick Roll', id: 7, color: '#865fcf', capacity: 20, type: 'Conference' },
  { text: 'Rainbow', id: 8, color: '#1aaa55', capacity: 8, type: 'Cabin' },
  { text: 'Swarm', id: 9, color: '#df5286', capacity: 30, type: 'Conference' },
  { text: 'Photogenic', id: 10, color: '#710193', capacity: 25, type: 'Conference' }
];

   // initialize the min and max time value
   var minTime = (new Date('8/3/2017 9:00 AM'));
   var maxTime = (new Date('8/3/2017 11:30 AM'));

// var minDate =new Date(new Date().getFullYear(), new Date().getMonth(), 7, 0, 0, 0);
//     var maxDate =new Date(new Date().getFullYear(), new Date().getMonth(), 27,new Date().getHours(),new Date().getMinutes(),new Date().getSeconds());
//     var dateValue = new Date(new Date().setDate(14));

var minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7);
var  maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27);
var  dateValue = new Date(new Date().setDate(14));

class TimeSlots extends Component {
   constructor(props) {
        super(...arguments);
    this.state = {      
      isOpen: false,
      startDate: new Date(),
      timeData:[]
    };
    this.data = extend([], ownerData, null, true);
    this.ownerData = [
        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
    ];
    this.conferenceData = [
      { Text: 'Margaret', Id: 1, Color: '#1aaa55' },
      { Text: 'Robert', Id: 2, Color: '#357cd2' },
      { Text: 'Laura', Id: 3, Color: '#7fa900' }
    ];
    
      this.data = [
                {
                    Id: 1,
                    Subject: 'Burning Man',
                    StartTime: new Date(2018, 5, 1, 15, 0),
                    EndTime: new Date(2018, 5, 1, 17, 0),
                    ConferenceId: [1, 2, 3]
                }, {
                    Id: 2,
                    Subject: 'Data-Driven Economy',
                    StartTime: new Date(2018, 5, 2, 12, 0),
                    EndTime: new Date(2018, 5, 2, 14, 0),
                    ConferenceId: [1, 2]
                }, {
                    Id: 3,
                    Subject: 'Techweek',
                    StartTime: new Date(2018, 5, 2, 15, 0),
                    EndTime: new Date(2018, 5, 2, 17, 0),
                    ConferenceId: [2, 3]
                }, {
                    Id: 4,
                    Subject: 'Content Marketing World',
                    StartTime: new Date(2018, 5, 2, 18, 0),
                    EndTime: new Date(2018, 5, 2, 20, 0),
                    ConferenceId: [1, 3]
                }, {
                    Id: 5,
                    Subject: 'B2B Marketing Forum',
                    StartTime: new Date(2018, 5, 3, 10, 0),
                    EndTime: new Date(2018, 5, 3, 12, 0),
                    ConferenceId: [1, 2, 3]
                }
            ];
    
  }

  componentWillMount() {
    //let userId = this.props.user.userId;
  
    // document.body.classList.add('light-theme');
    // document.body.classList.add('absoluteHeader');
    // document.body.classList.remove('home');
    // document.body.classList.remove('fixedHeader');
  }

  componentWillReceiveProps(res) {
    // this.setProfileData(res.user);
    // this.setAchievementData(res.student.achievementData);
    // this.renderRecommendationsByUserId();
  }

  componentDidMount() {  
    let user= this.props.otherUser? this.props.otherUser: this.props.user;
    if(user){
      let userId =user.userId;       
      this.setState({userId: userId,user:user});
    }
    this.getSlotDetails(user.userId);
  }

  getSlotDetails(userId){
    let interviewerId= userId;
    spikeViewApiService('getTimeSlotByInterviewer',{interviewerId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response);
        let timeData=  [];
        response.data.result.forEach(function(item,index){    
          let launchDate = new Date(item.startTimeStamp);     
          let day = launchDate.getUTCDate();
          let month = launchDate.getMonth();
          let year = launchDate.getFullYear(); 
          let min = launchDate.getMinutes();
          let hour = launchDate.getHours();

          let startDate= new Date(year,month,day,hour,min);

           launchDate = new Date(item.endTimeStamp);     
           day = launchDate.getUTCDate();
           month = launchDate.getMonth();
           year = launchDate.getFullYear(); 
           min = launchDate.getMinutes();
           hour = launchDate.getHours();

          let endDate= new Date(year,month,day,hour,min);

          timeData.push({
              slotId: item.slotId,      
              userId:  item.userId,     
              StartTime: startDate,
              EndTime: endDate,
              Color :item.userId ? '#1aaa55' :'#7fa900'
            })
      });
      this.setState({timeData:timeData});
      }
     
    })
    .catch(err => {
      console.log(err);
    });
  }
 
  handleChange = date => {
    console.log(date);
    this.setState({
      startDate: date
    });
  };

  onPopupOpen(args) {
    console.log(args);
    // if(args.data.Guid)
    //   return false;
    let self= this;
    let startDate= new Date(args.data.StartTime);
    console.log('startDate ',moment(args.data.StartTime).format("DD-MMM-YYYY"));
    let endDate= new Date(args.data.EndTime);
    let data={
      slotRegisteredDate:new Date(moment(args.data.StartTime).format("DD-MMM-YYYY")).valueOf(),
      startTimeStamp: moment(args.data.StartTime).valueOf(),
      endTimeStamp: moment(args.data.EndTime).valueOf(),
      interviewerId: this.state.userId
    };
   if(!args.data.slotId){
      spikeViewApiService('createSlot', data)
      .then(response => {
        if (response.data.status==="Success") {      
            self.setState({ isLoading: false });    
            self.getSlotDetails(self.state.userId);   
        } 
      })
      .catch(error => {
      // self.setState({ isLoading: false });
        console.log(error);
      });
    }else{
      let slotId= args.data.slotId
      spikeViewApiService('deleteTimeSlotByInterviewer',{slotId})
      .then(response => {
        if (response.data.status==="Success") {      
            self.setState({ isLoading: false });    
            self.getSlotDetails(self.state.userId);   
        } 
      })
      .catch(error => {
      // self.setState({ isLoading: false });
        console.log(error);
      });
    }
    args.cancel = true;
}

// onActionBegin(args) {
//   if (args.requestType === 'eventCreate' && args.data.length > 0) {
//       let eventData = args.data[0];
//       let eventField = this.scheduleObj.eventFields;
//       let startDate = eventData[eventField.startTime];
//       let endDate = eventData[eventField.endTime];
//       args.cancel = !this.scheduleObj.isSlotAvailable(startDate, endDate);
//   }
// }
 
  render() {
    return (
      <div className="wrapper">
      <Header {...this.props} />     
      <div className="main-panel">   

 <div className="w3-content main-panel1"> 
       <ScheduleComponent width='100%' height='800px' 
       ref={schedule => this.scheduleObj = schedule}
       popupOpen={this.onPopupOpen.bind(this)} showQuickInfo={false} 
     //  eventRendered={this.onEventRendered.bind(this)}
       onChange={this.handleChange.bind(this)}  eventSettings={{ dataSource: this.state.timeData }} 
       >
            <ViewsDirective>
            <ViewDirective option='Day' startHour='09:30' endHour='18:00' />
                <ViewDirective option='Week'/>
                <ViewDirective option='Month'/>
                <ViewDirective option='Agenda'/>
            </ViewsDirective>
             <ResourcesDirective>
                <ResourceDirective field='slotId' title='Slot' name='Slot' allowMultiple={false} dataSource={this.state.timeData} idField='slotId' colorField='Color'>
                </ResourceDirective>
            </ResourcesDirective> 
            <Inject  services={[Week, Month, Agenda]}/>
        </ScheduleComponent> 
</div></div></div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    otherUser: state.User.otherUserInfoData,
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
