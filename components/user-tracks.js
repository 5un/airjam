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
    return (
      <div>
        {_.map(tracks, track => (
          <UserTrack track={track} />
        ))}
      </div>
    );

  }

}