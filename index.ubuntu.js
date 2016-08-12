/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated,
} from 'react-native';


import { playSound } from 'ubuntu-module-sound';

const _ = require('lodash');

const defaultWorkTime = 1.5 * 60 * 1000;
const animatedCountdownThreshold = 1 * 60 * 1000;


class BackgroundImage extends Component {
  render() {
    return (
      <Image
        style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5fcff',
                tintColor: '#ffeeeeee'}}
        source={{uri: this.props.source}}
        resizeMode='contain'>
        {this.props.children}
      </Image>
    );
  }
}

BackgroundImage.propTypes = {
  source: React.PropTypes.string,
};


class TomatoTime extends Component {
  constructor(props) {
    super(props);
    this.state = { timeLeft: defaultWorkTime };
    this.intervalId = -1;
    this.startPressed = this._startPressed.bind(this);
    this.pausePressed = this._pausePressed.bind(this);
    this.animation = new Animated.Value(0);
  }

  render() {
    const minutes = Math.floor(this.state.timeLeft / (60 * 1000));
    const seconds = _.padLeft((this.state.timeLeft % (60 * 1000)) / 1000, 2, "0");

    if (this.intervalId !== -1 && this.state.timeLeft < animatedCountdownThreshold) {
      Animated.spring(this.animation, {
              toValue: 1,
              velocity: 2,
              tension: -10,
              friction: 1,
            }).start();
    }

    return (
      <BackgroundImage
        source='./share/images/ubuntu.png'>
        <View style={styles.container}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Animated.View
              style={{backgroundColor: 'green',
                      borderRadius: 5,
                      paddingTop: 10,
                      paddingBottom:10,
                      paddingLeft: 30,
                      paddingRight: 30,
                      transform: [{scale: this.animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.25]
                                  })}]}}>
              <Text style={{fontSize: 45, textAlign: 'center'}}>
                {minutes}:{seconds}
              </Text>
            </Animated.View>
          </View>
          <View style={{justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableHighlight
                style={{backgroundColor: '#d3d3d3', margin: 20}}
                underlayColor='grey'
                onPress={this.startPressed}>
                <Text style={{fontSize: 18, margin: 20}}>
                  Start
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{backgroundColor: '#d3d3d3', margin: 20}}
                underlayColor='grey'
                onPress={this.pausePressed}>
                 <Text style={{fontSize: 18, margin: 20}}>
                  Pause 
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </BackgroundImage>
    );
  }

  _startPressed() {
    if (this.intervalId !== -1)
      return;
    this.intervalId = setInterval(() => {
          const timeLeft = this.state.timeLeft - 1000;
          if (timeLeft == 0) {
            clearInterval(this.intervalId);
            playSound("./share/audio/Metal_Gong-Dianakc-109711828.wav");
            setTimeout(() => {
                  this.setState({timeLeft: defaultWorkTime});
                  this.intervalId = -1;
                }, 3000);
          }
          this.setState({timeLeft: timeLeft});
        }, 1000);    
  }

  _pausePressed() {
    if (this.intervalId !== -1) {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('TomatoTime', () => TomatoTime);
