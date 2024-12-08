"use client";
import { useEffect } from "react";

interface VirtualAssistantProps {
  speaking?: boolean;
  text?: string;
}

export default function VirtualAssistant({
  speaking = false,
}: VirtualAssistantProps) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const animationUrls = {
    idle: "/animations/Idle.fbx",
    talking: "/animations/Talking.fbx",
  };

  return (
    <model-viewer
      src="/models/675510da1cc2d47e42c02782.glb"
      alt="3D Avatar"
      camera-controls
      auto-rotate={false}
      camera-orbit="0deg 90deg 1.5m"
      camera-target="0m 1.5m 0m"
      field-of-view="35deg"
      min-camera-orbit="auto 45deg auto"
      max-camera-orbit="auto 120deg auto"
      style={{ width: "100%", height: "100%" }}
    >
      <animation-mixer
        clip={speaking ? "/animations/Talking.fbx" : "/animations/Idle.fbx"}
      />
    </model-viewer>
  );
}
