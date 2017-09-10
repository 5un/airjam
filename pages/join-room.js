import React from 'react'
import Link from 'next/link'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import PianoPad from '../components/piano-pad'
import RTM from 'satori-rtm-sdk';
import styled from 'styled-components'
import { CenterPageWrapper, Button, InputText } from '../components/elements'
import _ from 'lodash'


const ClientConnectedIndicator = styled.div `
  display: inline-block;
  background-color: #00ff00;
  width: 20px;
  height: 20px;
  border-radius: 10px;
`

export default class JoinRoom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  onInputChanged(e) {
    this.setState({ username: e.target.value })
  }

  render() {
    const { username } = this.state; 
    const roomId = _.get(this.props, 'url.query.id', 'Unknown');
    return (
      <Page>
        <CenterPageWrapper>
          <h1>Joining Room {roomId}</h1>
          <p>Please enter your name</p>
          <div>
          <InputText onChange={this.onInputChanged.bind(this)} style={{ width: '280px' }}/>
          </div>
          <Link href={`/rooms?id=${roomId}&username=${username}`}>
            <Button style={{ width: '280px' }}>Join</Button>
          </Link>
        </CenterPageWrapper>
      </Page>
    );
  }

}