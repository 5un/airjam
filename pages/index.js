import React from 'react'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'

export default class Index extends React.Component {

  render() {
    return (
      <Page>
        <h1>Hello!</h1>
        <p>Airjam is a realtime music collaboration platform</p>
        <MidiMachine />
      </Page>
    );
  }

}