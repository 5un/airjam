import React from 'react'
import Link from 'next/link'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import PianoPad from '../components/piano-pad'
import RTM from 'satori-rtm-sdk';
import styled from 'styled-components'

const rtm = new RTM('wss://q5241z7b.api.satori.com', 'CD3108D6a79CAE30b8E8C37ebad877A6');
const channelName = 'jam-session-1'

const ClientConnectedIndicator = styled.div `
  display: inline-block;
  background-color: #00ff00;
  width: 20px;
  height: 20px;
  border-radius: 10px;
`

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clientConnected: false
    };
  }

  render() {
    const { clientConnected } = this.state; 
    return (
      <Page>
        <h1>Hello!</h1>
        <p>Airjam is a realtime music collaboration platform</p>
        
        <h2>Rooms</h2>
        <ul>
          <li>
            <Link href="/rooms?id=1">
              <a>Room 1</a>
            </Link>
          </li>
          <li>
            <Link href="/rooms?id=2">
              <a>Room 2</a>
            </Link>
          </li>
          <li>
            <Link href="/rooms?id=3">
              <a>Room 3</a>
            </Link>
          </li>
        </ul>
      </Page>
    );
  }

}