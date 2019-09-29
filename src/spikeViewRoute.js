import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
//import createHistory from 'history/createBrowserHistory';

import { getLocalStorage } from './common/commonFunctions';

/******************** Common Routing ****************************/

import Login from './common/authorization/login';
import Signup from './common/authorization/signUp';
import HRSignup from './common/authorization/hrSignUp';
import ChangePassword from './common/changePassword/changePassword';
import ForgotPassword from './common/forgotPassword/resetPassword';

/******************** User Routing ****************************/
import UserDashboard from './user/dashboard/dashboard';
import UserEditProfile from './user/profile/editProfile';
import TimeSlotUser from './user/profile/timeSlots';
import SlotArrangement from './user/profile/slotArrangement';

import Video from './video/video';

import App from './videoChat/js/app';

/******************** Interviewer Routing ****************************/
import TimeSlot from './interviewer/profile/timeSlots';
import InterviewerDashboard from './interviewer/dashboard/dashboard';
import InterviewerEditProfile from './interviewer/profile/editProfile';


/******************** Recruiter Routing ****************************/
import UserMapping from './recruiter/jobDescription/userMapping';
import JobDescription from './recruiter/jobDescription/jobDescription';
import VideoHistory from './recruiter/jobDescription/videoHistory';

/******************** Admin Routing ****************************/
//import Dashboard from './admin/dashboard/dashboard';
import Candidate from './admin/candidate/candidate';
import Hruser from './admin/hruser/hruser';
// import ReactGA from 'react-ga';
var createHistory= require("history").createBrowserHistory;
// const history = createHistory();
// ReactGA.initialize('UA-139519546-1');
// history.listen(location => ReactGA.pageview(location.pathname));

class SpikeViewRoute extends Component {
  componentWillMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    let userInfo = getLocalStorage('userInfo');
    if (userInfo) {
      if (userInfo.token) {
        let access_token = userInfo.token;
        this.setState({ access_token: access_token });
        // if(userInfo && this.props.match.params){
        //   if(userInfo.userId == this.props.match.params.userId && this.props.match.params.recommendationId){
        //     this.props.history.push({
        //       pathname: '/recommendationRequest',
        //       state: { requestRecommendedId: this.props.match.params.recommendationId,userId: this.props.match.params.userId}
        //     });
        //   }
        // }else{

        // }
        //this.props.history.push('/home');
      }
    } else {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <Switch>
        {/* Common routes for parent and student */}
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/hrsignup" component={HRSignup} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route exact path="/changepassword" component={ChangePassword} />

      

    
        <Route exact path="/user/dashboard" component={UserDashboard} />
        <Route exact path="/user/profile" component={UserEditProfile} />
        <Route exact path="/interviewer/timeSlots" component={TimeSlot} />
        <Route exact path="/user/timeSlots" component={TimeSlotUser} />
        <Route exact path="/user/slotArrangement" component={SlotArrangement} />
        <Route exact path="/recruiter/jobDesription" component={JobDescription} />
        <Route exact path="/video" component={Video} />
        
        
        <Route exact path="/interviewer/interviewerProfile" component={InterviewerEditProfile} />
        <Route exact path="/interviewer/dashboard" component={InterviewerDashboard} />
       
        <Route exact path="/js/app" component={App} />

        <Route exact path="/recruiter/userMapping" component={UserMapping} />
        <Route exact path="/recruiter/videoHistory" component={VideoHistory} />


        {/* Admin Routes */}
        <Route exact path="/admin/candidate" component={Candidate} />
        <Route exact path="/admin/hruser" component={Hruser} />
     
      </Switch>
    );
  }
}
export default SpikeViewRoute;
