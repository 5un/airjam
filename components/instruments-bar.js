import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Button } from './elements'

const instruments = [
  {
    name: 'piano',
    label: 'Piano'
  },
  {
    name: 'drums',
    label: 'Drums'
  },
  {
    name: 'synth',
    label: 'Synth'
  },
  {
    name: 'More',
    label: '+'
  }
];

const InstrumentsBarContainer = styled.div `
  background-color: #2A1E4A;
  text-align: center;
  padding: 20px;
`

const InstrumentButton = Button.extend`
  display: inline-block;
  margin: 5px;
`;

export default class InstrumentsBar extends React.Component {

  constructor(props) {
    super(props);
  }

  onInstrumentSelected(instrument) {
    if(this.props.onInstrumentSelected) {
      this.props.onInstrumentSelected(instrument);
    }
  }

  render() {
    return (
      <InstrumentsBarContainer>
        {_.map(instruments, instrument => (
          <InstrumentButton onClick={this.onInstrumentSelected.bind(this, instrument)}>
            {instrument.label}
          </InstrumentButton>
        ))}
      </InstrumentsBarContainer>
    );
  }

}