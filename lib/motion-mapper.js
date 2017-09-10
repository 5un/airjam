const mapMotion = (motion, orientation, motionHistory, orientationHistory) => {
  const { absolute, alpha, beta, gamma } = orientation;
  const acceleration = motion.accelerationIncludingGravity;
  const accelerationHistory = motionHistory.accelerationIncludingGravity;

  var val = [];
  for(var j=44; j<=86; j++) {
    val.push(j);
  }

  var vol;
  if(accelerationHistory.length > 0) {
    var lastAcceleration = accelerationHistory[accelerationHistory.length - 1];
    vol = (128.0) * (Math.pow(lastAcceleration.x - acceleration.x,2) + 
                          Math.pow(lastAcceleration.y - acceleration.y,2) + 
                          Math.pow(lastAcceleration.z - acceleration.z,2)) / 
                        (Math.pow(lastAcceleration.x,2) + 
                          Math.pow(lastAcceleration.y,2) + 
                          Math.pow(lastAcceleration.z,2));
  } else {
    vol = 50.0;
  }
  vol = Math.floor(vol); 

  // midi code example
  var delay = 0; // play one note every quarter second
  // var note = Math.floor(Math.abs(orientation.alpha)); // the MIDI note 

  // Mute if orientation does not change enough
  if (orientationHistory.length > 0) {
    var lastAlpha = orientationHistory[orientationHistory.length - 1];
    var dAlpha = orientation.alpha - lastAlpha;
    if(dAlpha > 180 || dAlpha < 20) {
      vol = 0;
    }
  }

  // Set note from orientation
  var note = val[Math.floor((Math.abs(orientation.alpha))%43)]; // the MIDI note
  
  return { note: note, volume: vol, rawValues: { motion, orientation } };
}
export default mapMotion;