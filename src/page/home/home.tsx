import React, { Component } from 'react';

import logo from '../../assets/images/logo.svg';
import styles from './home.module.scss';

export default class extends Component {
  render() {
    return (
      <div className={styles['home']}>
        <img src={logo} className={styles['home-logo']} alt="logo"/>
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a className={styles['home-link']} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </div>
    );
  }
}