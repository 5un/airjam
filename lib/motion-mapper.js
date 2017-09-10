import _ from 'lodash'

const mapMotion = (motion, orientation, motionHistory, orientationHistory, timeSinceLastTrigger, drumFuncs) => {
  const { absolute, alpha, beta, gamma } = orientation;
  const acceleration = motion.accelerationIncludingGravity;
  const accelerationHistory = motionHistory.accelerationIncludingGravity;

  const lastAcceleration = _.get(accelerationHistory, accelerationHistory.length - 1, {x: 0, y: 0, z: 0});
  //detect jerk
  var jerk = Math.sqrt((Math.pow(lastAcceleration.x - acceleration.x,2) + 
                          Math.pow(lastAcceleration.y - acceleration.y,2) + 
                          Math.pow(lastAcceleration.z - acceleration.z,2)));
  
  let triggerred = false;
  if(jerk>8 && timeSinceLastTrigger > 200) {
    if(orientation.alpha>=250 && orientation.alpha <330) {
      drumFuncs.snare();
      triggerred = true;
    }
    else if(orientation.alpha>=330 && orientation.alpha<20)
    {
      drumFuncs.ride();
      triggerred = true;
    }
    else {
      drumFuncs.tom();
      triggerred = true;
    }
  }

  return triggerred;
  
  // Set note from orientation
  
  // drumFuncs.tom();
  // drumFuncs.snare();
  // drumFuncs.ride();
}
export default mapMotion;