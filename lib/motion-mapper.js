const mapMotion = (motion, orientation, MIDI) => {
  const { acceleration, accelerationIncludingGravity, rotationRate } = motion;
  const { absolute, alpha, beta, gamma } = orientation;

  // const { ax, ay, az } = acceleration;
  
  // midi code example
  var delay = 0; // play one note every quarter second
  // var note = Math.floor(Math.abs(orientation.alpha)); // the MIDI note
  var note = Math.floor((Math.abs(orientation.alpha) * 60.0 / 180.0) + 30); // the MIDI note
  var velocity = 127; // how hard the note hits
  // // play the note
  // MIDI.setVolume(0, 127);
  // MIDI.noteOn(0, note, velocity, delay);
  // MIDI.noteOff(0, note, delay + 0.75);
  if (MIDI) {
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
  }

}

export default mapMotion;