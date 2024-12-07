'use client';

import React, { useState } from 'react';
import LandingPage from './components/landing-page';
import CornerButton from './components/corner-button';
import ChatUI from './components/chat-ui';
import TopNavigationBar from './components/top-navigation-bar';

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [activePage, setActivePage] = useState('text'); // Track the active page

  const handleClick = () => {
    setIsExpanded((prevState) => {
      const newState = !prevState;
      if (newState) {
        // When expanding, set the delay for ChatUI to appear
        setTimeout(() => {
          setShowChatUI(true);
        }, 100); // Delay
      } else {
        // When collapsing, hide ChatUI immediately
        setShowChatUI(false);
      }
      return newState;
    });
  };

  // Handle navigation change
  const handleNavigationChange = (newPage: string) => {
    setActivePage(newPage); // Update active page based on navigation selection
  };

  // Render different content based on activePage
  const renderPageContent = () => {
    switch (activePage) {
      case 'text':
        return <ChatUI />
      case 'voice':
        return <div>Voice Assistant Content</div>; // Replace with your actual component or content
      case 'virtual':
        return <div>Virtual Assistant Content</div>; // Replace with your actual component or content
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <LandingPage>
      <CornerButton isExpanded={isExpanded} onClick={handleClick}>
        {showChatUI && (
          <>
            <TopNavigationBar onNavigationChange={handleNavigationChange} />
            {renderPageContent()}
          </>
        )}
      </CornerButton>
    </LandingPage>
  );
};

export default Home;
