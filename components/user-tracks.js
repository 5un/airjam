import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import UserTrack from './user-track'

export default class UserTracks extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    const { tracks } = this.props;
    console.log(tracks);
    return (
      <div>
        {_.map(tracks, (track, name) => (
          <UserTrack track={track} key={name} />
        ))}
      </div>
    );

  }

}