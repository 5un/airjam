import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'


const PianoWhiteKey = styled.button`
  display: inline-block;
  background-color: white;
  border: 2px solid bold;
  height: 200px;
  width: 50px;
  vertical-align: top;
  z-index: 1;
`;

const PianoBlackKey = styled.button`
  display: inline-block;
  background-color: black;
  border: 2px solid bold;
  height: 100px;
  width: 50px;
  margin: 0 -25px;
  vertical-align: top;
  z-index: 2;
`;

const blackKeys = [1, 3, 6, 8, 10]

export default class PianoPad extends React.Component {

  constructor(props) {
    super(props);
    // numOctaves
    // startingOctave
  }

  onKeyPushed(note) {
    console.log(note);
    if(this.props.onNotePushed) {
      this.props.onNotePushed(note);
    }
  }

  render() {
    const numOctaves = this.props.numOctaves || 2;
    const startingOctave = this.props.startingOctave || 3;
    const keys = _.range(12 * startingOctave, 12 * (startingOctave + numOctaves));

    return (
      <div>
        {_.map(keys, k => (
          _.indexOf(blackKeys, k % 12) > -1 ?
            <PianoBlackKey onClick={this.onKeyPushed.bind(this, k)}></PianoBlackKey>:
            <PianoWhiteKey onClick={this.onKeyPushed.bind(this, k)}></PianoWhiteKey>
        ))}
      </div>
    );
  }

}