import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import {login} from './service';
import {getLogger, registerRightAction, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('auth/Login');

const LOGIN_ROUTE = 'auth/login';

export class Login extends Component {
  static get routeName() {
    return LOGIN_ROUTE;
  }

  static get route() {
    return {name: LOGIN_ROUTE, title: 'Authentication', rightText: 'Login'};
  }

  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
    this.store = this.props.store;
    this.navigator = this.props.navigator;
    log('constructor');
  }

  componentWillMount() {
    log('componentWillMount');
    this.updateState();
    registerRightAction(this.navigator, this.onLogin.bind(this));
  }

  render() {
    log('render');
    const auth = this.state.auth;
    let message = issueToText(auth.issue);
    return (
      <View style={styles.content}>
        <View style={{flex:3}}>
          <ActivityIndicator animating={auth.isLoading} style={styles.activityIndicator} size="large"/>
          <Text>Username</Text>
          <TextInput onChangeText={(text) => this.setState({...this.state, username: text})}/>
          <Text>Password</Text>
          <TextInput onChangeText={(text) => this.setState({...this.state, password: text})}/>
            {message && <Text>{message}</Text>}
        </View>
        <View style={{flex:2}}>
          <MyGeolocation />
        </View>
      </View>
    );
  }

  componentDidMount() {
    log(`componentDidMount`);
    this.unsubscribe = this.store.subscribe(() => this.updateState());
  }

  componentWillUnmount() {
    log(`componentWillUnmount`);
    this.unsubscribe();
  }

  updateState() {
    log(`updateState`);
    this.setState({...this.state, auth: this.store.getState().auth});
  }

  onLogin() {
    log('onLogin');
    this.store.dispatch(login(this.state)).then(() => {
      if (this.state.auth.token) {
        this.props.onAuthSucceeded(this.state.auth.token);
      }
    });
  }
}

class MyGeolocation extends Component {
  state = { initialPosition: 'unknown', lastPosition: 'unknown', };
  watchID: ?number = null;
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          let initialPosition = JSON.stringify(position);
          this.setState({initialPosition});
        },
        (error) => alert(JSON.stringify(error)), {
          enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    return (
        <View>
          <Text>
            <Text style={styles.title}>Initial position: </Text>
              {this.state.initialPosition}
          </Text>
          <Text>
            <Text style={styles.title}>Current position: </Text>
              {this.state.lastPosition}
          </Text>
        </View>
    );
  }
}