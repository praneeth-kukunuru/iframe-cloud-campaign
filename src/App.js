import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from 'styled-components';
import Sidepanel from './components/Sidepanel';
import { useUIActions, useIsPanelOpen, PANEL_SIZES } from './stores/ui';
import './App.css';

// --- Cloud Campaign Configuration ---
const CLOUD_CAMPAIGN_BASE_URL = "https://talkdesk.cldportal.com";
const CLOUD_CAMPAIGN_WORKSPACE_ID = 'db0d5f9d-b987-4cfa-87dc-95eaeab5c453';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
`

const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  background: #f8f9fa;
  padding: 0;
  margin: 0;
  min-width: 0;
`

const ContentArea = styled.div`
  padding: 0;
  min-height: 100%;
  height: 100%;
  width: 100%;
`

export default function App() {
  return (
    <AppContent />
  );
}

function AppContent() {
  const { setIsPanelOpen } = useUIActions()
  const isPanelOpen = useIsPanelOpen()
  const [panelWidth, setPanelWidth] = useState(isPanelOpen ? PANEL_SIZES.expanded : PANEL_SIZES.collapsed)
  const [subView, setSubView] = useState("dashboard");
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [urlCache, setUrlCache] = useState(new Map()); // Cache for iframe URLs

  const [token, setToken] = useState(null);

  // Initialize with mock user info
  useEffect(() => {
    const mockUserInfo = {
      sub: 'user-123',
      email: 'user@example.com',
      name: 'Demo User'
    };
    setUserInfo(mockUserInfo);
    setToken('demo-token'); // Use demo authentication
  }, []);

  // Generate iframe URL with caching
  const generateIframeUrl = useCallback((page) => {
    const cacheKey = `${page}-${token}`;
    
    // Check cache first
    if (urlCache.has(cacheKey)) {
      return urlCache.get(cacheKey);
    }

    let src = `${CLOUD_CAMPAIGN_BASE_URL}/embedded-dashboard/page=${page}`;
    const params = new URLSearchParams();
    
    if (CLOUD_CAMPAIGN_WORKSPACE_ID && CLOUD_CAMPAIGN_WORKSPACE_ID !== 'YOUR_CLOUD_CAMPAIGN_WORKSPACE_ID') {
      params.append('client', CLOUD_CAMPAIGN_WORKSPACE_ID);
    }
    params.append('sso_token', token);
    
    if (userInfo) {
      params.append('user_email', userInfo.email);
      params.append('user_name', userInfo.name);
      params.append('user_id', userInfo.sub);
    }
    
    const paramString = params.toString();
    if (paramString) {
      src += `?${paramString}`;
    }

    // Cache the URL
    setUrlCache(prev => new Map(prev).set(cacheKey, src));
    
    return src;
  }, [token, userInfo, urlCache]);

  // Preload iframe URLs for faster switching
  const preloadIframeUrls = useCallback(() => {
    if (!token) return;
    
    const pages = ['dashboard', 'analytics', 'campaigns', 'reports', 'settings'];
    pages.forEach(page => {
      const url = generateIframeUrl(page);
      // Create a hidden iframe to preload the content
      const preloadIframe = document.createElement('iframe');
      preloadIframe.style.display = 'none';
      preloadIframe.src = url;
      document.body.appendChild(preloadIframe);
      
      // Remove after a short delay
      setTimeout(() => {
        if (document.body.contains(preloadIframe)) {
          document.body.removeChild(preloadIframe);
        }
      }, 5000);
    });
  }, [token, generateIframeUrl]);

  // Post message to iframe to navigate (fastest method)
  const navigateDashboard = useCallback((page) => {
    // First try to communicate with the iframe to change the page
    if (iframeRef.current?.contentWindow && iframeReady) {
      try {
        iframeRef.current.contentWindow.postMessage({ 
          type: 'NAVIGATE', 
          page: page 
        }, CLOUD_CAMPAIGN_BASE_URL);
        console.log('Sent navigation message to iframe:', page);
        setSubView(page);
        return; // Exit early if postMessage succeeds
      } catch (e) {
        console.log('Could not send message to iframe, falling back to URL change');
      }
    }
    
    // Fallback to URL change if postMessage fails
    console.log('Iframe not ready, using URL change for navigation');
    const newSrc = generateIframeUrl(page);
    setIframeSrc(newSrc);
    setSubView(page);
  }, [iframeReady, generateIframeUrl]);



  useEffect(() => {
    if (token) {
      // Set initial iframe src
      const src = generateIframeUrl(subView);
      setIframeSrc(src);
      console.log("Setting iframe src to embedded dashboard:", src);

      // Preload other pages for faster switching
      preloadIframeUrls();

      // Listen for the iframe's navigation
      const handleIframeLoad = () => {
        try {
          const iframeUrl = iframeRef.current?.contentWindow?.location.href;
          console.log("Iframe URL changed to:", iframeUrl);
        } catch (e) {
          console.log("Could not access iframe location due to CORS:", e);
        }
      };

      const handleMessage = (event) => {
        if (event.origin === CLOUD_CAMPAIGN_BASE_URL) {
          console.log('Received message from iframe:', event.data);
          
          if (event.data.type === 'NAVIGATION_COMPLETE') {
            // Handle navigation completion
            console.log('Navigation completed:', event.data.page);
            setSubView(event.data.page);
          } else if (event.data.type === 'IFRAME_READY') {
            // Handle iframe ready signal
            console.log('Iframe is ready');
            setIframeReady(true);
          }
        }
      };

      window.addEventListener('message', handleMessage);
      const currentIframe = iframeRef.current;
      if (currentIframe) {
        currentIframe.addEventListener('load', handleIframeLoad);
      }

      return () => {
        window.removeEventListener('message', handleMessage);
        if (currentIframe) {
          currentIframe.removeEventListener('load', handleIframeLoad);
        }
      };
    } else {
      setIframeSrc('');
      setIframeReady(false);
    }
  }, [token, generateIframeUrl, preloadIframeUrls, subView]); // Added subView back to dependencies

  // Sidepanel event handlers
  const handleToggle = useCallback(() => {
    const newState = !isPanelOpen
    setIsPanelOpen(newState)
    setPanelWidth(newState ? PANEL_SIZES.expanded : PANEL_SIZES.collapsed)
  }, [isPanelOpen, setIsPanelOpen])

  const handlePanelStatus = useCallback((isOpen) => {
    setIsPanelOpen(isOpen)
    setPanelWidth(isOpen ? PANEL_SIZES.expanded : PANEL_SIZES.collapsed)
  }, [setIsPanelOpen])

  const handleClickInbox = useCallback(() => {
    console.log('Inbox clicked')
  }, [])

  const handleSidebarItemClick = useCallback((itemId) => {
    console.log('Sidebar item clicked:', itemId)
    navigateDashboard(itemId)
  }, [navigateDashboard])

  // Main content area
  const renderMainContent = () => (
    <div style={{ height: '100%', width: '100%' }}>
      {iframeSrc ? (
        <iframe
          ref={iframeRef}
          title="Cloud Campaign Dashboard"
          src={iframeSrc}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            display: 'block'
          }}
        />
      ) : (
        <div style={{
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#5f6368',
          fontSize: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <p>Loading Cloud Campaign...</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      border: 'none',
      fontFamily: "'Roboto', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <LayoutContainer>
        <Sidepanel
          isPanelOpen={isPanelOpen}
          panelWidth={panelWidth}
          setPanelStatus={handlePanelStatus}
          togglePanel={handleToggle}
          onClickInbox={handleClickInbox}
          shouldOverlayContent={false}
          title="Cloud Campaign"
          currentView={subView}
          onItemClick={handleSidebarItemClick}
        />
        <MainContent>
          <ContentArea>
            {renderMainContent()}
          </ContentArea>
        </MainContent>
      </LayoutContainer>
    </div>
  );
}
