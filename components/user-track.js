import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import Avatar from 'react-avatar';

const Item = styled.div`
  margin: 10px;
`;

const TrackLine = styled.div`
  position: relative;
  border: 1px solid white;
  margin-left: 70px;
  width: 80%;
  top: -30px;
`;

export default class UserTrack extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    const { track } = this.props;
    const name = _.get(track, 'name', 'Anonymous')
    return (
      <Item>
        <Avatar name={name} round={true} size={60}/>
        <TrackLine />
      </Item>
    );

  }

}