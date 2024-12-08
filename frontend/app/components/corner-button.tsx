import React, { ReactNode } from "react";
import { RiChatAiFill, RiCloseCircleFill } from "react-icons/ri";

const CornerButton = ({
  isExpanded,
  onClick,
  children,
}: {
  isExpanded: boolean;
  onClick: () => void;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`fixed bottom-10 right-10 transition-all duration-500 ease-in-out transform origin-bottom-right
        ${isExpanded ? "w-[94vw] h-[90vh] rounded-lg" : "w-20 h-20 rounded-[50%]"}
        bg-blue-500 flex items-center justify-center`}
    >
      {!isExpanded ? (
        <div onClick={onClick} role="button" tabIndex={0} aria-label="Expand Chat">
          <RiChatAiFill size={40} color="white" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {children}

          {/* Close button positioned at the bottom-right */}
          <button
            className="absolute bottom-4 right-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent any parent click handlers
              onClick(); // Collapse when the close button is clicked
            }}
            aria-label="Close Chat"
            role="button"
            tabIndex={0}
          >
            <RiCloseCircleFill size={40} color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CornerButton;
