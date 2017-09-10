
import React from 'react'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import WebAudioFont from '../components/web-audio-font'
import UserTracks from '../components/user-tracks'
import InstrumentsBar from '../components/instruments-bar'
import PianoPad from '../components/piano-pad'
import DrumPads from '../components/drum-pads'
import MotionController from '../components/motion-controller'
import { Row, Col, Button } from '../components/elements'
import RTM from 'satori-rtm-sdk';
import styled from 'styled-components'
import mapMotion from '../lib/motion-mapper'
import _ from 'lodash'

import users from '../mock-data/users.json'

const rtm = new RTM('wss://q5241z7b.api.satori.com', 'CD3108D6a79CAE30b8E8C37ebad877A6');

const MOTION_HISTORY_SIZE = 10;
const MAX_SAMPLING_RATE = 500;

const TopRight = styled.div`
  float: right;
`;

const ClientConnectedIndicator = styled.div `
  display: inline-block;
  background-color: #00ff00;
  width: 20px;
  height: 20px;
  border-radius: 10px;
`

const BottomPanel = styled.div`
  position: fixed;
  left: auto;
  width: 100%;
  bottom: 0;
`;

const InnerWrapper = styled.div`
  padding: 20px 40px;
`;

export default class Rooms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clientConnected: false,
      currentInstrument: {
        name: 'piano'
      },
      currentUser: {
        name: 'Lorem Ipsum'
      },
      showInstrumentsBar: false
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
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    const channelName = `airjam-${roomId}`
    var channel = rtm.subscribe(channelName, RTM.SubscriptionMode.SIMPLE);

    // Do not subscribe twice
    channel.on("rtm/subscription/data", (pdu) => {
      pdu.body.messages.forEach(console.log);
      const { messages } = pdu.body;
      // Play Note Here
      _.map(messages, (msg) => {
        // TODO handle other instr
        const instrumentName = _.get(msg, 'instrument.name', 'piano');
        if(instrumentName === 'piano') {
          if (this.webAudioFont) {
            this.webAudioFont.playNote(msg.note);
          }
        } else if(instrumentName === 'drums') {
          if (this.webAudioFont) {
            this.webAudioFont.playDrumsWithLabel(msg.note);
          }
        }
        
        // Add to dataviz layer
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
    const { currentUser, currentInstrument } = this.state;
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    const channelName = `airjam-${roomId}`
    if(this.rtm) {
      const msg = { user: currentUser, instrument: currentInstrument, note: note };
      this.rtm.publish(channelName, msg , (pdu) => {
        if (pdu.action === 'rtm/publish/ok') {
          console.log('Publish confirmed');
        } else {
          console.log('Failed to publish. RTM replied with the error ' +
              pdu.body.error + ': ' + pdu.body.reason);
        }
      });
    }
  }

  onDrumsButtonPushed(label) {
    this.sendDrumNote(label);
  }

  sendDrumNote(label) {
    const { currentUser, currentInstrument } = this.state;
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    const channelName = `airjam-${roomId}`
    
    if(this.rtm) {
      const msg = { user: currentUser, instrument: currentInstrument, note: label };
      this.rtm.publish(channelName, msg , (pdu) => {
        if (pdu.action === 'rtm/publish/ok') {
          console.log('Publish confirmed');
        } else {
          console.log('Failed to publish. RTM replied with the error ' +
              pdu.body.error + ': ' + pdu.body.reason);
        }
      });
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

  onInstrumentSelected(instrument) {
    this.setState({ currentInstrument: instrument });
  }

  onInstrumentButtonClicked() {
    const { showInstrumentsBar } = this.state;
    this.setState({ showInstrumentsBar: !showInstrumentsBar });
  }

  onMotionOrOrientationChanged(motion, orientation) {
    if(this.midiMachine) {
      const drumFuncs = {
        tom: () => { this.sendDrumNote('tom'); },
        snare: () => { this.sendDrumNote('snare'); }, 
        ride: () => { this.sendDrumNote('ride'); }
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
      this.webAudioFont.startBeat();
    }
  }

  render() {
    const { clientConnected, currentInstrument, showInstrumentsBar } = this.state; 
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    return (
      <Page>
        <InnerWrapper>
          <TopRight>
            <Row>
              <Col>
                <Button style={{ marginRight: '10px' }} onClick={this.onInstrumentButtonClicked.bind(this)}>Instruments</Button>
              </Col>
              <Col>
                {clientConnected &&
                  <div>Connected <ClientConnectedIndicator/></div>
                }
                {!clientConnected &&
                  <div>Not Connected</div>
                }
              </Col>
            </Row>
          </TopRight>
          <h2>Welcome to Room {roomId}</h2>
          <p>Start jamming right away</p>
          <UserTracks tracks={users}/>
        </InnerWrapper>
        <MidiMachine ref={(midiMachine) => { this.midiMachine = midiMachine; }}/>
        <WebAudioFont ref={(webAudioFont) => { this.webAudioFont = webAudioFont; }} onSoundFontsLoaded={this.onSoundFontsLoaded.bind(this)}/>
        <BottomPanel>
          {showInstrumentsBar && 
            <InstrumentsBar onInstrumentSelected={this.onInstrumentSelected.bind(this)} />
          }
          {currentInstrument.name == 'piano' &&
            <PianoPad onNotePushed={this.onNotePushed.bind(this)}/>
          }
          {currentInstrument.name == 'drums' &&
            <DrumPads onButtonPushed={this.onDrumsButtonPushed.bind(this)}/>
          }
        </BottomPanel>
        <MotionController onMotionOrOrientationChanged={this.onMotionOrOrientationChanged.bind(this)}/>
      </Page>
    );
  }

}