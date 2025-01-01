import React, { useRef, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        muted={isMuted}
        autoPlay
        loop
        preload="metadata"
        poster="https://i.ibb.co/PrgKnHV/lightpmr.png"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "16px",
          cursor: "pointer",
        }}
      >
        <source src="https://www.ari.tf/0101.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "8px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
};

export default VideoPlayer;
