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
import { ToastContainer } from 'react-toastify';

import { Week, Month, Agenda,TimelineViews, TimelineMonth, ScheduleComponent, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject } from '@syncfusion/ej2-react-schedule';

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
  showErrorToast ,ZoomInAndOut 
} from '../../common/commonFunctions';
import spikeViewApiService from '../../common/core/api/apiService';
import CONSTANTS from '../../common/core/config/appConfig';


class TimeSlots extends Component {
   constructor(props) {
        super(...arguments);
    this.state = {      
      isOpen: false,
      startDate: new Date(),
      timeData:[]
    };   
    
  }
 
  componentDidMount() {  
    let user= this.props.otherUser? this.props.otherUser: this.props.user;
    if(user){
      let userId =user.userId;       
      this.setState({userId: userId,user:user});
      this.getUserProfileData(userId);
      this.getSlotDetails(userId);  
    }   
  }

  getUserProfileData(userId){
    spikeViewApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);       
         let userProfile = response.data.result[0];     
        this.setState({userProfile:userProfile                  
         });        
      }
    })
    .catch(err => {
      console.log(err);
    });
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
              text: 'Photogenic',     
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

     if(moment(args.data.StartTime).valueOf() <  moment().valueOf()){
      args.cancel = true;
      showErrorToast('Selected time can not be less than current time.');
      return false;
     }  

     console.log(args.data.StartTime);
    let self= this;
    let startDate= new Date(args.data.StartTime);
   
    let endDate= new Date(args.data.EndTime);
 
     console.log(moment(args.data.StartTime));   

    let data={
      slotRegisteredDate:new Date(moment(args.data.StartTime).format("DD-MMM-YYYY")).valueOf(),
      startTimeStamp: moment(startDate).valueOf(),
      endTimeStamp: moment(endDate).valueOf(),
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
      console.log(args.data);     
      
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



 
  render() {
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
           <div className="w3-content main-panel1"> 
           {this.state.userProfile ? 
              <ScheduleComponent width='100%' height='800px' 
                ref={schedule => this.scheduleObj = schedule}
                popupOpen={this.onPopupOpen.bind(this)} showQuickInfo={false} 
                //  eventRendered={this.onEventRendered.bind(this)} selectedDate={new Date(2018, 3, 1)}
                onChange={this.handleChange.bind(this)} eventSettings={{ dataSource: this.state.timeData }} 
                >
                      <ViewsDirective>
                      <ViewDirective option='Day' startHour='09:30' endHour='18:00' />
                          <ViewDirective option='Week'/>                
                          <ViewDirective option='Agenda'/>
                      </ViewsDirective>
                      <ResourcesDirective>
                          <ResourceDirective field='slotId' title='Slot' name='Slot' allowMultiple={false} textField='text' dataSource={this.state.timeData} idField='id' colorField='Color'>
                          </ResourceDirective>
                      </ResourcesDirective> 
                      <Inject  services={[Week,Agenda]}/>
                </ScheduleComponent> :
                <div className="container main">
                  Kindly complete profile first
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
    otherUser: state.User.otherUserInfoData,
    student: state.Student
  };
};

export default connect(
  mapStateToProps,
  null
)(TimeSlots);
