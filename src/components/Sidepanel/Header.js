import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  &:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`

const StyledIcon = styled.span`
  font-family: 'Material Icons';
  font-size: 20px;
  color: #374151;
  line-height: 1;
`

const StyledHeading = styled.h3`
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  color: #111827;
  line-height: 1.2;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => props.alignY || 'center'};
  justify-content: ${props => props.alignX || 'center'};
  flex-direction: ${props => props.direction || 'row'};
  width: ${props => props.width || 'auto'};
  min-height: ${props => props.minHeight || 'auto'};
  padding: ${props => props.padding || '0'};
  padding-top: ${props => props.paddingTop || '0'};
  padding-bottom: ${props => props.paddingBottom || '0'};
  padding-left: ${props => props.paddingLeft || '0'};
  padding-right: ${props => props.paddingRight || '0'};
  border-bottom: ${props => props.borderBottom || 'none'};
  flex-grow: ${props => props.grow ? 1 : 0};
`

const getTitleFontSize = (viewport) => {
  let level

  switch (viewport) {
    case 'small':
      level = '1.125'
      break
    case 'medium':
      level = '1.25'
      break
    default:
      level = '1.375'
  }

  return `${level}rem`
}

const Header = ({ togglePanel, isPanelOpen, title = 'Cloud Campaign' }) => {
  // Simple viewport detection
  const [viewport, setViewport] = React.useState('medium');
  
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewport('small');
      } else {
        setViewport('medium');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallViewport = viewport === 'small'
  const isPanelExpanded = isPanelOpen || isSmallViewport
  const icon = isPanelExpanded ? 'first_page' : 'panel_open'

  const iconAccessibilityLabel = `conversations_panel.nav_bar.${
    isPanelOpen ? 'close' : 'open'
  }`

  const Button = (
    <StyledButton
      aria-controls="interactions_panel"
      aria-expanded={isPanelOpen}
      data-bi="pi-close-button"
      data-testid="conversations-panel-toggle"
      onClick={togglePanel}
    >
      <StyledIcon
        aria-label={iconAccessibilityLabel}
        role="img"
      >
        {icon === 'first_page' ? 'first_page' : 'panel_open'}
      </StyledIcon>
    </StyledButton>
  )

  return (
    <FlexContainer
      as="header"
      direction={isPanelExpanded ? 'row' : 'column'}
      style={{ 
        minHeight: 'auto',
        borderBottom: isPanelExpanded ? '1px solid #e5e7eb' : 'none'
      }}
      width="100%"
      padding={isPanelExpanded ? '12px 16px 24px' : '16px 4px 8px'}
    >
      {isPanelExpanded && (
        <FlexContainer grow>
          <StyledHeading
            data-testid="conversations-panel-title"
            style={{ fontSize: getTitleFontSize(viewport) }}
          >
            {title}
          </StyledHeading>
        </FlexContainer>
      )}

      {Button}
    </FlexContainer>
  )
}

export default Header 