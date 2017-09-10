import styled from 'styled-components'

export const PageWrapper = styled.div`
  padding: 40px 20px;
`

export const CenterPageWrapper = PageWrapper.extend`
  text-align: center;
`

export const Row = styled.div`
  display: block;
`

export const Col = styled.div`
  display: inline-block;
`

export const Button = styled.button `
  appearance: none;
  background-color: transparent;
  color: white;
  padding: 10px 20px;
  border: 2px solid white;
  border-radius: 4px;
  font-family: Montserrat;
  font-size: 18px;
`

export const InputText = styled.input`
  backgrond: white;
  border: 0;
  border-radius: 4px;
  font-size: 18px;
  padding: 10px;
  margin-bottom: 10px;
`