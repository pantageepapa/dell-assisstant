import React, { ReactNode } from 'react';
import { RiChatAiFill, RiCloseCircleFill } from 'react-icons/ri';

const CornerButton = ({ isExpanded, onClick, children }: {
  isExpanded: boolean;
  onClick: () => void;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`fixed bottom-10 right-10 transition-all duration-500 ease-in-out transform origin-bottom-right
        ${isExpanded ? 'w-[94vw] h-[90vh] rounded-lg' : 'w-20 h-20 rounded-[50%]'}
        bg-blue-500 flex items-center justify-center cursor-pointer`}
      onClick={onClick} // Allow collapsing when the expanded button is clicked
      role="button" // Accessibility: Role is a button
      tabIndex={0} // Allow keyboard navigation
      aria-label={isExpanded ? 'Collapse Chat' : 'Expand Chat'} // Add a dynamic label
    >
      {!isExpanded ? (
        <RiChatAiFill size={40} color="white" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {children}

          <button
            className="absolute bottom-4 right-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent click handler from triggering
              onClick(); // Close the expanded state when the close button is clicked
            }}
            aria-label="Close Chat"
            role="button" // Accessibility: close button role
            tabIndex={0} // Allow keyboard navigation for the close button
          >
            <RiCloseCircleFill size={40} color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CornerButton;
