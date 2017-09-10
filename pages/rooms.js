
import React from 'react'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import WebAudioFont from '../components/web-audio-font'
import PianoPad from '../components/piano-pad'
import MotionController from '../components/motion-controller'
import RTM from 'satori-rtm-sdk';
import styled from 'styled-components'
import mapMotion from '../lib/motion-mapper'
import _ from 'lodash'

const rtm = new RTM('wss://q5241z7b.api.satori.com', 'CD3108D6a79CAE30b8E8C37ebad877A6');
const channelName = 'jam-session-1'

const MOTION_HISTORY_SIZE = 10;
const MAX_SAMPLING_RATE = 500;

const ClientConnectedIndicator = styled.div `
  display: inline-block;
  background-color: #00ff00;
  width: 20px;
  height: 20px;
  border-radius: 10px;
`

export default class Rooms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clientConnected: false
    };

    this.history = {
      motion: {
        acceleration: [],
        accelerationIncludingGravity: [],
        rotationRate: []
      },
      orientation: []
    };
    this.lastMotionTimestamp = new Date();
    this.timeOfLastTrigger = new Date();

  }

  componentDidMount() {
    var channel = rtm.subscribe(channelName, RTM.SubscriptionMode.SIMPLE);

    // Do not subscribe twice
    channel.on("rtm/subscription/data", (pdu) => {
      pdu.body.messages.forEach(console.log);
      const { messages } = pdu.body;
      // Play Note Here
      _.map(messages, (msg) => {
        if(this.midiMachine) {
          this.midiMachine.playNote(msg.note);
        }
      });
      
    });

    // client enters 'connected' state
    rtm.on("enter-connected", () => {
      this.setState({ clientConnected: true });
      //rtm.publish("your-channel", {key: "value"});

    });

    // client receives any PDU and PDU is passed as a parameter
    rtm.on("data", (pdu) => {
      if (pdu.action.endsWith("/error")) {
          rtm.restart();
      }
    });

    // start the client
    rtm.start();

    this.channel = channel;
    this.rtm = rtm;

    // setInterval(() => {
    //   this.onMotionOrOrientationChanged(
    //     { 
    //       acceleration: { x: Math.random() * 10.0, y: Math.random() * 10.0, z: Math.random() * 10.0 },
    //       accelerationIncludingGravity: { x: Math.random() * 10.0, y: Math.random() * 10.0, z: Math.random() * 10.0 }
    //     }, 
    //     { alpha: Math.random() * 360.0, beta: Math.random() * 360.0 - 180.0, gamma: Math.random() * 360.0 - 180.0 }
    //   );
    // }, 10);
  }

  onNotePushed(note) {

    // if(this.midiMachine) {
    //   this.midiMachine.playNote(note);

    //   if(this.rtm) {
    //     const msg = { note: note };
    //     this.rtm.publish(channelName, msg , (pdu) => {
    //       if (pdu.action === 'rtm/publish/ok') {
    //         console.log('Publish confirmed');
    //       } else {
    //         console.log('Failed to publish. RTM replied with the error ' +
    //             pdu.body.error + ': ' + pdu.body.reason);
    //       }
    //     });
    //   }
    // }

    if(note % 12 == 0) {
      this.webAudioFont.playSnare();
    } 
    if(note % 12 == 1) {
      this.webAudioFont.playTom();
    } 
    if(note % 12 == 2) {
      this.webAudioFont.playHihat();
    } 
  }

  updateMotionHistory(motion, orientation) {
    
    if(this.history.motion.acceleration.length > MOTION_HISTORY_SIZE) {
      this.history.motion.acceleration.splice(0, 1);
    }
    this.history.motion.acceleration.push(motion.acceleration);

    if(this.history.motion.accelerationIncludingGravity.length > MOTION_HISTORY_SIZE) {
      this.history.motion.accelerationIncludingGravity.splice(0, 1);
    }
    this.history.motion.accelerationIncludingGravity.push(motion.accelerationIncludingGravity);

    if(this.history.motion.rotationRate.length > MOTION_HISTORY_SIZE) {
      this.history.motion.rotationRate.splice(0, 1);
    }
    this.history.motion.rotationRate.push(motion.rotationRate);

    if(this.history.orientation.length > MOTION_HISTORY_SIZE) {
      this.history.orientation.splice(0, 1);
    }
    this.history.orientation.push(motion.orientation);
  }

  onMotionOrOrientationChanged(motion, orientation) {
    if(this.midiMachine) {
      const drumFuncs = {
        tom: () => {
          this.webAudioFont.playTom();
        },
        snare: () => {
          this.webAudioFont.playSnare();
        }, 
        ride: () => {
          this.webAudioFont.playHihat();
        }
      };
      const triggered = mapMotion(motion, orientation, this.history.motion, this.history.orientation, (new Date() - this.timeOfLastTrigger), drumFuncs);
      if(triggered) {
        this.timeOfLastTrigger = new Date();
      }
      this.updateMotionHistory(motion, orientation);
    }
    
  }

  onSoundFontsLoaded() {
    if(this.webAudioFont) {
      // this.webAudioFont.startBeat();
    }
  }

  render() {
    const { clientConnected } = this.state; 
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    return (
      <Page>
        <h1>Welcome to Room {roomId}</h1>
        <p>Start jamming right away</p>
        {clientConnected &&
          <div>Connected <ClientConnectedIndicator/></div>
        }
        {!clientConnected &&
          <div>Not Connected</div>
        }
        <MidiMachine ref={(midiMachine) => { this.midiMachine = midiMachine; }}/>
        <WebAudioFont ref={(webAudioFont) => { this.webAudioFont = webAudioFont; }} onSoundFontsLoaded={this.onSoundFontsLoaded.bind(this)}/>
        <PianoPad onNotePushed={this.onNotePushed.bind(this)}/>
        <MotionController onMotionOrOrientationChanged={this.onMotionOrOrientationChanged.bind(this)}/>
      </Page>
    );
  }

}