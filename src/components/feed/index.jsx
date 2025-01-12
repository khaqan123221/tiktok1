import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSupabase } from "../../context/useSupabase";

const Feed = () => {
  const { reels } = useSupabase(); // Assuming reels is an array of video URLs
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef();

  // Get the current video from the reels array
  const video = reels[currentIndex].url;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentIndex]);

  // Handle navigation to the next video
  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handle navigation to the previous video
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center gap-4">
      <div className="relative h-5/6">
        {/* Video Container */}
        <div className="h-full aspect-[9/16] rounded-2xl relative overflow-hidden">
          <video
            controls
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
            ref={videoRef}
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute flex flex-col gap-4 top-1/2 transform -translate-y-1/2 right-[-5rem]">
          {/* Up Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <FaChevronUp className="text-gray-800" />
          </button>

          {/* Down Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg ${
              currentIndex === reels.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <FaChevronDown className="text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
