"use client";

import React, { useState } from "react";
import LandingPage from "./components/landing-page";
import CornerButton from "./components/corner-button";
import ChatUI from "./components/chat-ui";
import TopNavigationBar from "./components/top-navigation-bar";
import ConsultantsPage from "./components/ConsultantsPage";
import VirtualAssistantUI from "./components/virtual-assistant-page";
import VoiceAssistantPage from "./components/voice-assistant-page";

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [activePage, setActivePage] = useState("text"); // Track the active page

  const handleClick = () => {
    setIsExpanded((prevState) => {
      const newState = !prevState;
      if (newState) {
        // When expanding, set the delay for ChatUI to appear
        setTimeout(() => {
          setShowChatUI(true);
        }, 200); // Delay
      } else {
        setActivePage("text"); // Reset active page to "text" when collapsing
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
      case "text":
        return <ChatUI />;
      case "voice":
        return <VoiceAssistantPage />;
      case "virtual":
        return <VirtualAssistantUI />; // Replace with your actual component or content
      case "consulting":
        return <ConsultantsPage />;
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