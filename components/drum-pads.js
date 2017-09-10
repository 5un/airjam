import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const DrumPadContainer = styled.div`
  background-color: #222222;
  padding: 20px;
  text-align: center;
`;

const DrumPad = styled.div`
  background-color: #444444;
  border: 2px solid red;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  display: inline-block;
  margin: 20px;
`;

const RedDrumPad = DrumPad.extend`
  border: 2px solid red;
`;

const GreenDrumPad = DrumPad.extend`
  border: 2px solid #00ff00;
`;

const BlueDrumPad = DrumPad.extend`
  border: 2px solid blue;
`;

const YellowDrumPad = DrumPad.extend`
  border: 2px solid yellow;
`;

export default class DrumPads extends React.Component {

  constructor (props) {
    super(props);
  }

  onButtonPushed(label) {
    const { onButtonPushed } = this.props;
    if(onButtonPushed) {
      onButtonPushed(label);
    }
  }

  render() {

    return (
      <DrumPadContainer>
        <RedDrumPad onClick={this.onButtonPushed.bind(this, 'bassdrum')}>

        </RedDrumPad>
        <GreenDrumPad onClick={this.onButtonPushed.bind(this, 'snare')}>
          
        </GreenDrumPad>
        <BlueDrumPad onClick={this.onButtonPushed.bind(this, 'tom')}>
          
        </BlueDrumPad>
        <YellowDrumPad onClick={this.onButtonPushed.bind(this, 'ride')}>
          
        </YellowDrumPad>
      </DrumPadContainer>
    );

  }

}