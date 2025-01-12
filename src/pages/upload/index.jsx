import { Navigate } from "react-router";
import { useSupabase } from "../../context/useSupabase";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

const Upload = () => {
  const { session, isLoading, upload } = useSupabase();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // To track upload status
  const [uploadStatus, setUploadStatus] = useState(""); // Message for upload status

  if (!session) return <Navigate to="/login" />;

  const handleFileChange = (e) => {
    toast.dismiss();
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check if file is a video
    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Please select a video file");
      setFile(null);
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true); // Set uploading state to true
      setUploadStatus("Uploading..."); // Show uploading status in the toast
      toast.loading("Uploading your video...");

      // Send the video file to the backend
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploading(false); // Reset uploading state
      setUploadStatus("Upload successful!");
      toast.success("Video uploaded successfully!");
      toast.dismiss();
      console.log("Video URL:", response.data.videoUrl);
    } catch (error) {
      setUploading(false);
      setUploadStatus("Upload failed. Please try again.");
      toast.error("Upload failed. Please check the console for details.");
      console.error("Error uploading video:", error);
    }

    setFile(null); // Clear the selected file after upload
  };

  return (
    <div className="min-h-screen bg-[#242424] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
            <p className="mt-2 text-sm text-gray-600">Maximum file size: 10MB</p>
          </div>

          <div className="space-y-4">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload video"
              />
              <div className="space-y-2">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {file ? (
                    <span className="text-green-600 font-medium">{file.name}</span>
                  ) : (
                    <span>Drag and drop or click to upload video</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || uploading} // Disable if uploading or loading
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 text-white ${
                  uploading ? "bg-gray-600" : "bg-gray-600"
                }`}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
