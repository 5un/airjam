import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import Avatar from 'react-avatar';

const Item = styled.div`
  margin: 10px;
  position: relative;
`;

const UsernameLabel = styled.h3`
  position: relative;
  margin: -20px 0 0 70px;
  width: 80%;
  top: -30px;
`;

const TrackLine = styled.div`
  position: relative;
  border: 1px solid white;
  margin-left: 70px;
  width: 80%;
  top: -30px;
`;

const NoteAnim = styled.div`
  width: ${props => (props.size + 'px' || '40px')};
  height: ${props => (props.size + 'px' || '40px')};
  border-radius: ${props => ((props.size / 2) + 'px' || '20px')};
  background-color: ${props => (props.noteColor || 'rgba(255,255,255,0.5)')};
  position: absolute;
  left: 110%;
  top: ${props => ( 30 - (props.size / 2) + 'px' || '10px')};;

  @keyframes example {
    0%   { left: 100%; }
    100% { left: 0; }
  }

  animation-name: example;
  animation-duration: 4s;
  animation-timing-function: linear;
`;

export default class UserTrack extends React.Component {

  constructor (props) {
    super(props);
  }

  mapNoteColor(note){
    if(note.instrument.name === 'piano') {
      return `rgba(${note.note, 0, 0, 0.5})`;
    } else if(note.instrument.name === 'drums') {
      if(note.label === 'snare') return 'orange';
      if(note.label === 'bassdrum') return 'purple';
      if(note.label === 'ride') return 'yellow';
      if(note.label === 'hihat') return 'cyan';
      if(note.label === 'tom') return 'blue';
    }
    
  }

  render() {
    const { track } = this.props;
    const name = _.get(track, 'name', 'Anonymous')
    const notes = _.get(track, 'notes', [])
    return (
      <Item>
        <Avatar name={name} round={true} size={60}/>
        <UsernameLabel>{name}</UsernameLabel>
        <TrackLine />
        {_.map(notes, note => (
          <NoteAnim size={note.size} noteColor={note.noteColor}>
          </NoteAnim>
        ))}
      </Item>
    );

  }

}