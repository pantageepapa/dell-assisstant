"use client";

import React, { useState } from "react";
import LandingPage from "./components/landing-page";
import CornerButton from "./components/corner-button";
import ChatUI from "./components/chat-ui";
import TopNavigationBar from "./components/top-navigation-bar";
import ConsultantsPage from "./components/ConsultantsPage";

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [activePage, setActivePage] = useState("text"); // Track the active page

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
      case "text":
        return <ChatUI />;
      case "voice":
        return <div>Voice Assistant Content</div>; // Replace with your actual component or content
      case "virtual":
        return <div>Virtual Assistant Content</div>; // Replace with your actual component or content
      case "consulting":
        return <ConsultantsPage />;
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
