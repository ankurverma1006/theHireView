import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';
import _ from 'lodash';

import theRapidHireApiService from '../../common/core/api/apiService';
import {
  ZoomInAndOut,
  getThumbImage,
  getLocalStorage,
  limitCharacter
} from '../../common/commonFunctions';
import SearchUserList from '../../common/searchDropdown/searchUserList';
import ChangePassword from '../../common/changePassword/changePassword';
import {
  actionUserLogout,
  actionGetHeaderCount,
  actionUpdateHeaderCount,
  actionChangePasswordStatus
} from '../../common/core/redux/actions';
import userDefaultImage from '../../assets/img/default-img.PNG';

let AsyncTypeahead = asyncContainer(Typeahead);
var keyCheck=false,renderChangeMenu=false;
class Header extends Component { 
  constructor(props, context) {
    super(props);
    this.state={
      userProfile:{}

    }    
  }

  getUserProfileData(userId){
    theRapidHireApiService('getUserSkillsById',{userId})
    .then(response => {     
      if (response.data.status === 'Success') {
        console.log(response.data);       
         let userProfile = response.data.result[0];       
         let profileRole= userProfile.profileRole[0].profileRole;
         let experience= userProfile.experienceInYear;
         let mobileNo= userProfile.mobileNo;
         let currentLocation= userProfile.currentLocation;
         let videoLink = userProfile.videoLink;
         this.setState({userProfile:userProfile,
                    profileRole,
                    experience,
                    mobileNo,
                    currentLocation,
                    videoLink
         });        
      }
    })
    .catch(err => {
      console.log(err);
    });
  } 

  componentWillMount() {
    let user= this.props.otherUser? this.props.otherUser: this.props.user;    
    if(user){
      let userId =user.userId; 
      this.getUserProfileData(userId);
    }
  } 

  logout = () => {
    this.props.actionUserLogout();
    this.props.history.push('/');
  };

  render() {
    return (
    <Navbar fluid={true}>
      {/* <Navbar.Header>
        <button type="button" className="navbar-toggle" data-toggle="collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </Navbar.Header> */}

      <Navbar.Collapse>

        {/* <Nav>
          <NavItem><i className="fa fa-dashboard"></i></NavItem>
          <NavDropdown title={<i className="fa fa-globe" />} id="basic-nav-dropdown">
            <MenuItem>Action</MenuItem>
            <MenuItem>Another action</MenuItem>
            <MenuItem>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem>Separated link</MenuItem>
          </NavDropdown>
        </Nav> */}
        <div className="separator"></div>
        {/* <Navbar.Form pullLeft>
          <FormGroup>
            <span className="input-group-addon"><i className="fa fa-search"></i></span>
            <FormControl type="text" placeholder="Type to search" />
          </FormGroup>
        </Navbar.Form> */}
        <Nav pullRight>
        <NavItem> <Link to="/interviewer/interviewerProfile">Profile </Link></NavItem>
        {this.state.userProfile ?     <NavItem> <Link to="/interviewer/dashboard">Dashboard </Link></NavItem>:null}
        {this.state.userProfile ?      <NavItem> <Link to="/interviewer/timeSlots">Time Slot </Link></NavItem>  :null}       
          {/* <NavDropdown title="Dropdown" id="right-nav-bar">
            <MenuItem>Action</MenuItem>
            <MenuItem>Another action</MenuItem>
            <MenuItem>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem>Separated link</MenuItem>
          </NavDropdown> */}
          <NavItem onClick={this.logout}>Log out</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
  }}
const mapStateToProps = state => {
  return {
    user: state.User.userData,
    parent: state.User.parentData,
    headerCount: state.User.headerCount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUserLogout,
      actionGetHeaderCount,
      actionUpdateHeaderCount,
      actionChangePasswordStatus
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);


