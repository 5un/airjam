import React from 'react'
import styled from 'styled-components'
import { slide as Menu } from 'react-burger-menu'
import globalCss from '../css/global.css.js'
import Head from 'next/head'

const Wrapper = styled.div`
  background-color: #423072; 
  min-height: 100vh;
`

const Nav = styled.nav `
  background: #674cb2;
  color: white;
  padding: 10px 60px;
`;

const MenuItem = styled.div `
  margin: 20px 0;
`

const Branding = styled.h1`
  letter-spacing: 10px;
`;

const Section = styled.section `
  padding: 20px;
`;

export default class Page extends React.Component {

  render() {
    return (
      <Wrapper>
        <Head>
          <title>AirJam</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <style jsx global>{globalCss}</style>
        <Nav>
          <a href="/"><Branding>🎛️ AIRJAM</Branding></a>
        </Nav>
        {this.props.children}
      </Wrapper>
    );
  }

}