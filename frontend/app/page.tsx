'use client';

import React, { useState, useRef, useEffect } from 'react';
import LandingPage from './components/landing-page';
import CornerButton from './components/corner-button';
import TopNavigationBar from './components/top-navigation-bar';
import AudioVisualizer from './components/audio-visualizer';

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [activePage, setActivePage] = useState('text'); // Track the active page
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref for CornerButton

  const handleClick = () => {
    setIsExpanded((prevState) => {
      const newState = !prevState;
      if (newState) {
        setTimeout(() => {
          setShowChatUI(true);
        }, 100); // Delay
      } else {
        setShowChatUI(false);
      }
      return newState;
    });
  };

  const handleCloseClick = () => {
    setIsExpanded(false);
    setShowChatUI(false);
  };

  const handleNavigationChange = (newPage: string) => {
    setActivePage(newPage); // Update active page based on navigation selection
  };

  const renderPageContent = () => {
    switch (activePage) {
      case 'text':
        return <div>Text Assistant Content</div>;
      case 'voice':
        return <AudioVisualizer />; // This renders your visualizer
      case 'virtual':
        return <div>Virtual Assistant Content</div>;
      case 'scheduling':
        return <div>Scheduling Content</div>;
      default:
        return <div>Default Content</div>;
    }
  };

  // Close the expanded button if a click happens outside of the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowChatUI(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <LandingPage>
      <CornerButton isExpanded={isExpanded} onClick={handleClick} onCloseClick={handleCloseClick}>
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
