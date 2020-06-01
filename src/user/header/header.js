import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormGroup,
  FormControl
} from 'react-bootstrap';

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
var keyCheck = false,
  renderChangeMenu = false;
class Header extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      userProfile: {}
    };
  }

  componentWillMount() {
    let user = this.props.otherUser ? this.props.otherUser : this.props.user;
    if (user) {
      let userId = user.userId;
      this.getUserProfileData(userId);
    }
  }

  logout = e => {
    e.preventDefault();
    this.props.actionUserLogout();
    this.props.history.push('/');
  };

  showVideoChat = () => {
    this.props.history.push('/js/app');
  };

  getUserProfileData(userId) {
    theRapidHireApiService('getUserSkillsById', { userId })
      .then(response => {
        if (response.data.status === 'Success') {
          console.log(response.data);
          let userProfile = response.data.result[0];

          this.setState({ userProfile: userProfile });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let _this = this;
    return (
      <Navbar className="mb-0">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">
              <h3 className="m-0">RapidHire</h3>
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav className="navbar-right">
            <NavItem href="/user/profile">Profile </NavItem>
            {_this.state.userProfile ? (
              <NavItem href="/user/dashboard">Dashboard </NavItem>
            ) : null}
            {_this.state.userProfile ? (
              <NavItem href="/user/timeSlots">TimeSlots </NavItem>
            ) : null}
            <NavItem onClick={this.logout}>Log out</NavItem>
          </Nav>
        </Navbar.Collapse>
        {this.props.user && this.props.user.roleId == 4 ? (
          <Navbar.Form pullLeft>
            <FormGroup>
              <span className="input-group-addon">
                {' '}
                <Link to="/admin/candidate">Admin</Link>
              </span>
            </FormGroup>
          </Navbar.Form>
        ) : null}
      </Navbar>
    );
  }
}
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
