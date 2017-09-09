import React from 'react'
import Script from 'react-load-script'

export default class MidiMachine extends React.Component {

  constructor(props) {
    super(props);
    this.scriptLatch = 11;
  }

  handleScriptLoad() {
    if(this.scriptLatch - 1 > 0) {
      this.scriptLatch -= 1;
    } else {
      if(window) {
        console.log('checking scripts');
        console.log(window.MIDI);

        const MIDI = window.MIDI;
        MIDI.loadPlugin({
          soundfontUrl: "/static/soundfont/",
          instrument: "acoustic_grand_piano",
          onprogress: function(state, progress) {
            console.log(state, progress);
          },
          onsuccess: function() {
            console.log('load soundfont succeeded!')
            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits
            // play the note
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);
          }
        });
      }
    }
  }

  render() {
    return (
      <div>
        <Script url="/static/js/midijs/inc/shim/WebMIDIAPI.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/inc/shim/Base64.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/inc/shim/Base64binary.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/audioDetect.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/gm.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/loader.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/plugin.audiotag.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/plugin.webaudio.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/midi/plugin.webmidi.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/util/dom_request_xhr.js" onLoad={this.handleScriptLoad.bind(this)} />
        <Script url="/static/js/midijs/js/util/dom_request_script.js" onLoad={this.handleScriptLoad.bind(this)} />
      </div>
    );
  }

}