import React from 'react'
import styled, { css } from 'styled-components'
import { PANEL_SIZES } from '../../stores/ui'

const PANEL_ARIA_CONTROL = 'interactions_panel'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.alignY || 'center'};
  justify-content: ${props => props.alignX || 'center'};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  z-index: ${props => props.zIndex || 'auto'};
  flex-direction: column;
  align-items: space-between;
`

const StyledPanel = styled(FlexContainer).attrs({
  direction: 'column',
  alignY: 'space-between'
})`
  width: ${({ width = 0 }) => width}px;
  height: 100%;
  background: white;
  box-shadow: 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0px rgb(0 0 0 / 12%),
    0 3px 5px -1px rgb(0 0 0 / 20%);
  transition: width 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
  position: relative;
  z-index: 1301;
  flex-shrink: 0;

  ${({ $overlayContent, width }) =>
    $overlayContent &&
    width === PANEL_SIZES.expanded &&
    css`
      position: absolute;
      left: 0;
      top: 0;
    `}
`

const PanelElement = styled.aside`
  height: 100%;
  z-index: 1301;
`

const ModalPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1300;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: stretch;
`

const ModalContent = styled.div`
  background: white;
  width: 280px;
  height: 100%;
  box-shadow: 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0px rgb(0 0 0 / 12%),
    0 3px 5px -1px rgb(0 0 0 / 20%);
  display: flex;
  flex-direction: column;
  z-index: 1301;
`

const PanelComponent = ({
  children,
  shouldOverlayContent,
  panelWidth,
  isPanelOpen
}) => {
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

  return (
    <PanelElement
      data-testid={`conversations-panel-${isPanelOpen ? 'open' : 'closed'}`}
      id={PANEL_ARIA_CONTROL}
      role="region"
      tabIndex={-1}
    >
      {isSmallViewport ? (
        <ModalPanel visible={isPanelOpen}>
          <ModalContent>
            {children}
          </ModalContent>
        </ModalPanel>
      ) : (
        <StyledPanel $overlayContent={shouldOverlayContent} width={panelWidth}>
          {children}
        </StyledPanel>
      )}
    </PanelElement>
  )
}

export default PanelComponent 