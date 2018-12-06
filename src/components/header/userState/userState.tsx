import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, Button, IconButton, Menu, MenuItem } from '@material-ui/core';

import { IAuthSore, ISignInApi } from '@interfaces/authApi';
import { avatarColor } from '@utils/common';

import styles from './userState.module.scss';

interface IProps {
  auth: IAuthSore;
  signIn: (data: ISignInApi) => void;
  signOut: () => void;
}

interface IState {
  anchorEl: any;
}

class UserState extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  signIn = () => {
    this.props.signIn({
      username: 15982086412,
      password: 'liujie123',
      grant_type: 'password'
    });
  };

  signOut = () => {
    this.props.signOut();
    this.handleMenuClose();
  };

  handleMenuState = (e: any) => {
    this.setState({
      anchorEl: e.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  beforeSignIn = () => {
    return (
      <div className={styles['before-landing']}>
        <Button onClick={this.signIn} color="inherit">
          Sign in
        </Button>

        <p className={styles['or']}>or</p>

        <NavLink to="/auth" className={styles['nav-link']} activeClassName={styles['nav-link-active']}>
          <Button color="inherit">
            Sign up
          </Button>
        </NavLink>
      </div>
    );
  };

  afterSignIn = () => {
    const { anchorEl } = this.state;
    const { auth } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    if (auth.userInfo.username) {
      const nameStyle = {
        background: avatarColor(auth.userInfo.username)
      };
      return (
        <IconButton aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenuState}>
          <Avatar style={nameStyle}>{auth.userInfo.username.charAt(0).toLocaleUpperCase()}</Avatar>
        </IconButton>
      );
    } else {
      return null;
    }
  };

  public render() {
    const { auth } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div>
        {auth.isSignIn ? this.afterSignIn() : this.beforeSignIn()}
        <Menu id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={open}
              onClose={this.handleMenuClose}>
          <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
          <MenuItem onClick={this.signOut}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default UserState;
