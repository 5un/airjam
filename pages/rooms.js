
import React from 'react'
import Page from '../components/page'
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
const PRESENCE_MESSAGE_INTERVAL = 5000;

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
      showInstrumentsBar: false,
      tuneCorrectionOn: false,
      members: {}
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
    const username = _.get(this.props, 'url.query.username', 'Unknown');
    const channelName = `airjam-${roomId}`
    var channel = rtm.subscribe(channelName, RTM.SubscriptionMode.SIMPLE);
    var presenceChannel = rtm.subscribe(`${channelName}-presence`, RTM.SubscriptionMode.SIMPLE, {
      filter: 'SELECT * FROM `' + channelName + '` WHERE type = "presence"',
      history: { age: 60 },
    });

    // Do not subscribe twice
    channel.on("rtm/subscription/data", (pdu) => {
      const { messages } = pdu.body;
      // Play Note Here
      _.map(messages, (msg) => {
        // TODO handle other instr
        if((msg.type === 'modified' && this.state.tuneCorrectionOn) || (msg.type === 'note' && !this.state.tuneCorrectionOn)){
          const instrumentName = _.get(msg, 'instrument.name', 'piano');
          if(instrumentName === 'piano') {
            if (this.webAudioFont) {
              this.webAudioFont.playNote(msg.note, msg.volume);
            }
          } else if(instrumentName === 'drums') {
            if (this.webAudioFont) {
              this.webAudioFont.playDrumsWithLabel(msg.note, msg.volume);
            }
          }

          //Data Viz
          const newNote = { ... msg, 
            noteColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
            size: (Math.floor(Math.random() * 40) + 10),
            timestamp: (new Date()).getTime()
          };
          const oldMember = _.get(this.state.members, msg.user.name, { name: msg.user.name, notes: []});
          let newNotes = _.concat(oldMember.notes, newNote);
          if(newNotes.length > 30) {
            newNotes.splice(0, newNotes.length - 30);
          }
          const modifiedMember = {... oldMember, notes: newNotes};
          this.setState({ members: 
            {... this.state.members, [msg.user.name]: modifiedMember }
          });

        }

        
        
        // Add to dataviz layer
      });
      
    });

    presenceChannel.on("rtm/subscription/data", (pdu) => {
      const members = this.state.members;
      const { messages } = pdu.body;
      _.map(messages, (msg) => {
        if(!_.has(members, msg.user.name)){
          const newMember = {
            name: msg.user.name,
            notes: []
          };
          this.setState({ members: {... members, [msg.user.name]: newMember }});
        }
      });
    });

    // client enters 'connected' state
    rtm.on("enter-connected", () => {
      this.setState({ clientConnected: true });
      //rtm.publish("your-channel", {key: "value"});
      this.sendPresenceMessage();
      setInterval(() => {
        this.sendPresenceMessage();
      }, PRESENCE_MESSAGE_INTERVAL)
    });

    // client receives any PDU and PDU is passed as a parameter
    rtm.on("data", (pdu) => {
      if (pdu.action.endsWith("/error")) {
        rtm.restart();
      }
    });

    // start the client
    rtm.start();
    this.rtm = rtm;
    this.channel = channel;

    // setInterval(() => {
    //   this.onMotionOrOrientationChanged(
    //     { 
    //       acceleration: { x: Math.random() * 10.0, y: Math.random() * 10.0, z: Math.random() * 10.0 },
    //       accelerationIncludingGravity: { x: Math.random() * 10.0, y: Math.random() * 10.0, z: Math.random() * 10.0 }
    //     }, 
    //     { alpha: Math.random() * 360.0, beta: Math.random() * 360.0 - 180.0, gamma: Math.random() * 360.0 - 180.0 }
    //   );
    // }, 10);

    this.setState({ currentUser: { name: username } });
  }

  onNotePushed(note) {
    const { currentUser, currentInstrument } = this.state;
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    const channelName = `airjam-${roomId}`
    if(this.rtm) {
      const msg = { type: 'note', user: currentUser, instrument: currentInstrument, note: note, volume: 0.5 };
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
      const msg = { type: 'note', user: currentUser, instrument: currentInstrument, note: label, volume: 0.5 };
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

  sendPresenceMessage() {
    const { currentUser, currentInstrument } = this.state;
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    const channelName = `airjam-${roomId}`
    const presenceMsg = {
        type: 'presence',
        user: currentUser,
        instrument: currentInstrument
      };
    console.log(presenceMsg);
    if(this.rtm) {
      rtm.publish(channelName, presenceMsg);
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

  onTuneCorrectionButtonClicked() {
    const { tuneCorrectionOn } = this.state;
    this.setState({ tuneCorrectionOn: !tuneCorrectionOn });
  }

  onMotionOrOrientationChanged(motion, orientation) {
    const drumFuncs = {
      bassdrum: () => { this.sendDrumNote('bassdrum'); },
      snare: () => { this.sendDrumNote('snare'); }, 
      ride: () => { this.sendDrumNote('ride'); }
    };
    const triggered = mapMotion(motion, orientation, this.history.motion, this.history.orientation, (new Date() - this.timeOfLastTrigger), drumFuncs);
    if(triggered) {
      this.timeOfLastTrigger = new Date();
    }
    this.updateMotionHistory(motion, orientation);
    
  }

  onSoundFontsLoaded() {
    if(this.webAudioFont) {
      // this.webAudioFont.startBeat();
    }
  }

  render() {
    const { clientConnected, currentInstrument, showInstrumentsBar, members, tuneCorrectionOn } = this.state; 
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    return (
      <Page>
        <InnerWrapper>
          <TopRight>
            <Row>
              <Col>
                <Button style={{ marginRight: '10px' }} onClick={this.onTuneCorrectionButtonClicked.bind(this)}>Auto Correction ({ tuneCorrectionOn ? 'On': 'Off'})</Button>
              </Col>
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
          <h2>Welcome to Room {roomId} 🎸</h2>
          <p>Start jamming right away</p>
          <UserTracks tracks={members}/>
        </InnerWrapper>
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