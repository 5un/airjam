import React from 'react'
import styled from 'styled-components'
import { slide as Menu } from 'react-burger-menu'
import globalCss from '../css/global.css.js'

const Wrapper = styled.div`
  background-color: #4c3782; 
`

const Nav = styled.nav `
  background: #8268ca;
  color: white;
  padding: 10px 100px;
`;

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
        <style jsx global>{globalCss}</style>
        <Menu>
          <a id="home" className="menu-item" href="/">Home</a>
          <a id="about" className="menu-item" href="/about">About</a>
          <a id="contact" className="menu-item" href="/contact">Contact</a>
          <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
        </Menu>
        <Nav>
          <a href="/"><Branding>AIRJAM</Branding></a>
        </Nav>
        {this.props.children}
      </Wrapper>
    );
  }

}