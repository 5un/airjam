
import React from 'react'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import PianoPad from '../components/piano-pad'
import MotionController from '../components/motion-controller'
import RTM from 'satori-rtm-sdk';
import styled from 'styled-components'
import mapMotion from '../lib/motion-mapper'

const rtm = new RTM('wss://q5241z7b.api.satori.com', 'CD3108D6a79CAE30b8E8C37ebad877A6');
const channelName = 'jam-session-1'

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

  }

  onNotePushed(note) {
    // if(this.midiMachine) {
    //   this.onMotionOrOrientationChanged(
    //     { acceleration: { x: 5.0, y: 0.0, z: 0.0 } }, 
    //     { alpha: -180.0, beta: 45.35, gamma: -24.45 }
    //   );
    // }
    if(this.midiMachine) {
      this.midiMachine.playNote(note);

      if(this.rtm) {
        const msg = { note: note };
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
  }

  onMotionOrOrientationChanged(motion, orientation) {
    if(this.midiMachine) {
      mapMotion(motion, orientation, this.midiMachine.MIDIInstance());
    }
  }

  render() {
    const { clientConnected } = this.state; 
    return (
      <Page>
        <h1>Welcome to Room 1</h1>
        <p>Start jamming right away</p>
        {clientConnected &&
          <div>Connected <ClientConnectedIndicator/></div>
        }
        {!clientConnected &&
          <div>Not Connected</div>
        }
        <MidiMachine ref={(midiMachine) => { this.midiMachine = midiMachine; }}/>
        <PianoPad onNotePushed={this.onNotePushed.bind(this)}/>
        <MotionController onMotionOrOrientationChanged={this.onMotionOrOrientationChanged.bind(this)}/>
      </Page>
    );
  }

}