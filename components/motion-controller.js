import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const debug = false;

const ANCHOR_ALPHA_CALIBRATION_DURATION = 2000;

export default class MotionController extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      motion: {},
      orientation: {}
    };
    this.motion = {};
    this.orientation = { anchorAlpha: 0 };
    this.anchorAlpha = 0;
  }

  onOrientationChanged(e) {
    const timeSinceCalibrationStarted = (new Date()) - this.calibrationStartTime;
    this.orientation = { alpha: e.alpha, beta: e.beta, gamma: e.gamma, absolute: e.absolute, anchorAlpha: this.orientation.anchorAlpha };
    if(timeSinceCalibrationStarted < ANCHOR_ALPHA_CALIBRATION_DURATION) {
      this.orientation.anchorAlpha = e.alpha;
    }
    // console.log('orientation');
    // console.log(e);
    if(this.props.onMotionOrOrientationChanged) {
      this.props.onMotionOrOrientationChanged(this.motion, this.orientation);
    }
  }

  onMotionChanged(e) {
    this.motion = { 
      acceleration: e.acceleration,
      accelerationIncludingGravity: e.accelerationIncludingGravity,
      rotationRate: e.rotationRate
    } 
    // console.log('motion');
    // console.log(e);
    if(this.props.onMotionOrOrientationChanged) {
      this.props.onMotionOrOrientationChanged(this.motion, this.orientation);
    }
  }

  componentDidMount(){
    if (window) {
      //window.addEventListener('deviceorientation', (e) => (this.onOrientationChanged(e)));
      //window.addEventListener('devicemotion', (e) => (this.onMotionChanged(e)));
      let element;
      window.ondevicemotion = (e) => {
        // element = document.getElementById('motion-debug');
        // element.innerHTML = `${e.acceleration.x}, ${e.acceleration.y}, ${e.acceleration.z}`;
        this.onMotionChanged(e);
      };
      window.ondeviceorientation = (e) => {
        // element = document.getElementById('orientation-debug');
        // element.innerHTML = `${e.alpha}, ${e.beta}, ${e.gamma}`;
        this.onOrientationChanged(e);
      };
      this.calibrationStartTime = new Date();
    }
  }

  componentWillUnmount() {
    if (window) {
      //window.removeEventListener('deviceorientation', (e) => (this.onOrientationChanged(e)));
      //window.removeEventListener('devicemotion', (e) => (this.onMotionChanged(e)));
    }
  }

  render() {
    const { motion, orientation } = this.state;
    return (
      <div>
        {debug &&
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <h3>motion / orientation</h3>
            <div>{JSON.stringify(motion, null, 2)}</div>
            <div>{JSON.stringify(orientation, null, 2)}</div>
          </div>

        }
        {debug &&
          <div>
            <div id="motion-debug" style={{ fontSize: '18px'}}>
            </div>
            <div id="orientation-debug" style={{ fontSize: '18px' }}>
            </div>
          </div>
        }
      </div>
    );
  }

}