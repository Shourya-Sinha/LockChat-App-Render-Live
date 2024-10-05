import React, { useState } from "react";
import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";
import { useAppStore } from "@/Store";

const ChatContainer = () => {
  const { fileUploadProgress,isUploading } = useAppStore();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file); // Update selected file when a file is chosen
  };

  const resetSelectedFile = () => {
    setSelectedFile(null); // Reset the selected file
  };
  return (
<>

    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer selectedFile={selectedFile} progress={fileUploadProgress} />
      <MessageBar onFileSelect={handleFileSelect} resetSelectedFile={resetSelectedFile} />
    </div>
</>
   
  );
}; 

export default ChatContainer;
