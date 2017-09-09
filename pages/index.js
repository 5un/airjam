import React from 'react'
import Page from '../components/page'
import MidiMachine from '../components/midi-machine'
import PianoPad from '../components/piano-pad'

export default class Index extends React.Component {

  onNotePushed(note) {
    if(this.midiMachine) {
      this.midiMachine.playNote(note);
    }
  }

  render() {
    return (
      <Page>
        <h1>Hello!</h1>
        <p>Airjam is a realtime music collaboration platform</p>
        <MidiMachine ref={(midiMachine) => { this.midiMachine = midiMachine; }}/>
        <PianoPad onNotePushed={this.onNotePushed.bind(this)}/>
      </Page>
    );
  }

}