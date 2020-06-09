import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, Button, FormControl } from 'react-bootstrap';

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

  logout = () => {
    this.props.actionUserLogout();
    this.props.history.push('/');
  };
  
  render() {
    return (
    <Navbar>
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
        {this.props.user && this.props.user.roleId == 4 ? <Navbar.Form pullLeft>
          <FormGroup>
            <span className="input-group-addon"> <Link to="/admin/candidate">Admin</Link></span>           
          </FormGroup>
        </Navbar.Form> :null}
        <Nav pullRight>
          {/* <NavItem> <Link to="/interviewer/timeSlots">Time Slot </Link></NavItem>
          <NavDropdown title="Dropdown" id="right-nav-bar">
            <MenuItem>Action</MenuItem>
            <MenuItem>Another action</MenuItem>
            <MenuItem>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem>Separated link</MenuItem>
          </NavDropdown> */}
          <Button onClick={this.logout} className="btn-primary btn btn-default">
          <i className="fa fa-sign-out mr-2" aria-hidden="true"></i>  Log Out
          </Button>
          {/* <NavItem onClick={this.logout} className="btn-primary btn btn-default p-0 m-0"> <i className="fa fa-sign-out mr-2" aria-hidden="true"></i>Log out</NavItem> */}
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


