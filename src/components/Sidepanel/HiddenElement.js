import React from 'react'
import styled from 'styled-components'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  height: ${props => props.height || 'auto'};
  width: ${props => props.width || 'auto'};
  overflow: ${props => props.overflow || 'visible'};
`

const HiddenElement = ({ visible, children, testId }) => (
  <FlexContainer
    data-testid={testId}
    direction="column"
    height="inherit"
    style={{
      display: visible ? 'flex' : 'none',
      overflow: 'hidden'
    }}
    width="100%"
  >
    {children}
  </FlexContainer>
)

export default HiddenElement 