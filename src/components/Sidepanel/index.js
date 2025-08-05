import React from 'react'
import { useViewport } from '@talkdesk/cobalt-react-viewport-provider'
import Header from './Header'
import HiddenElement from './HiddenElement'
import PanelComponent from './PanelComponent'
import styled from 'styled-components'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  height: ${props => props.height || 'auto'};
  width: ${props => props.width || 'auto'};
  overflow: ${props => props.overflow || 'visible'};
  flex-grow: ${props => props.grow ? 1 : 0};
  padding-top: ${props => props.paddingTop || '0'};
`

const MenuItem = styled.div`
  padding: 8px 260px 8px 32px;
  border-radius: 0;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  background: ${({ $isActive }) => $isActive ? '#f3f4f6' : 'transparent'};
  border: none;
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  line-height: 1.3;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-weight: ${({ $isActive }) => $isActive ? '500' : '400'};
  color: ${({ $isActive }) => $isActive ? '#6366f1' : '#374151'};

  &:hover {
    background: ${({ $isActive }) => $isActive ? '#f3f4f6' : '#f9fafb'};
    color: ${({ $isActive }) => $isActive ? '#6366f1' : '#1f2937'};
  }
`

const MenuTitle = styled.div`
  font-weight: inherit;
  color: inherit;
  white-space: nowrap;
  line-height: 1.3;
`

const SectionHeader = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  margin-top: 20px;
  padding: 0 20px 0 20px;
`

const Sidepanel = ({
  shouldOverlayContent,
  panelWidth,
  isPanelOpen,
  setPanelStatus,
  togglePanel,
  onClickInbox,
  title = 'Cloud Campaign',
  children,
  currentView = 'dashboard',
  onItemClick
}) => {
  const viewport = useViewport()
  const isSmallViewport = viewport === 'small'

  // Convert your existing menu structure to a flat list
  const getMenuItems = () => {
    const menuSections = [
      {
        title: "OVERVIEW",
        items: [
          { key: "dashboard", label: "Dashboard" }
        ]
      },
      {
        title: "CREATE",
        items: [
          { key: "library", label: "Content Library" },
          { key: "approvals", label: "Approvals" },
          { key: "content_recommendations", label: "Recommendations" },
          { key: "content_auto_import", label: "Auto Import" }
        ]
      },
      {
        title: "PUBLISH",
        items: [
          { key: "schedules", label: "Schedules" },
          { key: "calendar", label: "Calendar" }
        ]
      },
      {
        title: "MONITOR",
        items: [
          { key: "activity_feed", label: "Activity Feed" },
          { key: "recent_posts", label: "Recent Posts" },
          { key: "direct_messages", label: "Direct Messages" },
          { key: "mentions", label: "Mentions" },
          { key: "listening", label: "Social Listening" },
          { key: "inbox", label: "Social Inbox" },
          { key: "analytics", label: "Analytics" },
          { key: "account_analytics", label: "Account Analytics" },
          { key: "analytics_post_type", label: "Post Analytics" },
          { key: "analytics_insights", label: "Insights" },
          { key: "analytics_community", label: "Community" },
          { key: "hashtag_analytics", label: "Hashtag Analytics" },
          { key: "category_analytics", label: "Content Tag Analytics" },
          { key: "analytics_reports", label: "Reports" }
        ]
      },
      {
        title: "SETTINGS",
        items: [
          { key: "brand_settings", label: "Brand Settings" }
        ]
      }
    ]

    return menuSections.map(section => ({
      id: section.title.toLowerCase().replace(/\s+/g, '_'),
      label: section.title,
      items: section.items.map(item => ({
        id: item.key,
        title: item.label,
        isActive: currentView === item.key
      }))
    }))
  }

  const menuItems = getMenuItems()

  return (
    <PanelComponent
      isPanelOpen={isPanelOpen}
      panelWidth={panelWidth}
      shouldOverlayContent={shouldOverlayContent}
    >
      <Header isPanelOpen={isPanelOpen} togglePanel={togglePanel} title={title} />

      <HiddenElement visible={isPanelOpen || isSmallViewport}>
        <FlexContainer direction="column" height="100%" style={{ overflow: 'hidden' }}>
          <FlexContainer direction="column" grow style={{ overflow: 'auto', paddingTop: '16px' }}>
            {menuItems.map((section, index) => (
              <div key={section.id}>
                <SectionHeader>
                  {section.label}
                </SectionHeader>
                {section.items.map(item => (
                  <MenuItem
                    key={item.id}
                    $isActive={item.isActive}
                    onClick={() => onItemClick?.(item.id)}
                  >
                    <MenuTitle>{item.title}</MenuTitle>
                  </MenuItem>
                ))}
              </div>
            ))}
          </FlexContainer>
        </FlexContainer>
      </HiddenElement>
      
      <HiddenElement
        testId="active-tab-collapsed"
        visible={!(isPanelOpen || isSmallViewport)}
      >
        <div style={{ padding: '16px' }}>
          {/* Empty when collapsed */}
        </div>
      </HiddenElement>
    </PanelComponent>
  )
}

export default Sidepanel 