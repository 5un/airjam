import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

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
  }
];

const InstrumentsBarContainer = styled.div `
  background-color: #444444;
  text-align: center;
  padding: 20px;
`

const InstrumentButton = styled.button`
  display: inline-block;
  width: 80px;
  height: 80px;
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