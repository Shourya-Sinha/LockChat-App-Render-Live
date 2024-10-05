import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/Store";
import { useSocket } from "@/Context/SocketContext";
import { apiClient } from "@/lib/api_client";
import { UPLOAD_FILE_ROUTES } from "@/Utils/Constant";

const MessageBar = ({ onFileSelect, resetSelectedFile }) => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  useEffect(() => {
    function handleClickOut(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      // console.log('Sending channel message:', message);
      socket.emit("send-channel-message", {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,

      });
      // console.log('Sending channel message', {
      //   sender: userInfo._id,
      //   content: message,
      //   messageType: "text",
      //   fileUrl: undefined,
      //   channelId: selectedChatData._id,
      // });
    }

    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        onFileSelect(file);
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,

          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);

          resetSelectedFile();
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
      console.log("Attachment changed", file);
    } catch (error) {
      setIsUploading(false);
      console.log("error in chnage", error);
    }
  };

  return (
    <>
      <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
          <input
            type="text"
            className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleAttachmentClick}
          >
            <GrAttachment className="text-2xl" />
          </button>
          <input
            className="hidden"
            type="file"
            accept="image/*,application/pdf,application/zip"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
          />
          <div className="relative">
            <button
              className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
              onClick={() => setEmojiPickerOpen(true)}
            >
              <RiEmojiStickerLine className="text-2xl" />
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>
        <button
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda]  focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleSendMessage}
        >
          <IoSend className="text-2xl" />
        </button>
      </div>
    </>
  );
};

// const MessageBar = ({setSelectedFile }) => {
//   const [message, setMessage] = useState("");
//   // const [selectedFile, setSelectedFile] = useState(null);
//   const emojiRef = useRef();
//   const fileInputRef = useRef();
//   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
//   const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress, } = useAppStore();
//   const socket = useSocket();

//   useEffect(() => {
//     function handleClickOut(e) {
//       if (emojiRef.current && !emojiRef.current.contains(e.target)) {
//         setEmojiPickerOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOut);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOut);
//     };
//   }, [emojiRef]);

//   const handleAddEmoji = (emoji) => {
//     setMessage((msg) => msg + emoji.emoji);
//   };

//   const handleSendMessage = async () => {
//     if (selectedChatType === "contact") {
//       socket.emit("sendMessage", {
//         sender: userInfo._id,
//         content: message,
//         recipient: selectedChatData._id,
//         messageType: "text",
//         fileUrl: undefined,
//       });
//       setMessage(""); // Clear message after sending
//     }
//   };

//   const handleAttachmentClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleAttachmentChange = async (e) => {
//     try {
//       const file = e.target.files[0];
//       if (file) {
//         setSelectedFile(file); // Store selected file for preview
//         const formData = new FormData();
//         formData.append("file", file);
//         setIsUploading(true);
//         const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
//           withCredentials: true,
//           onUploadProgress: (data) => {
//             setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
//           },
//         });

//         if (response.status === 200 && response.data) {
//           setIsUploading(false);
//           if (selectedChatType === "contact") {
//             socket.emit("sendMessage", {
//               sender: userInfo._id,
//               content: undefined,
//               recipient: selectedChatData._id,
//               messageType: "file",
//               fileUrl: response.data.filePath,
//             });
//           }
//         }
//       }
//     } catch (error) {
//       setIsUploading(false);
//       console.log("Error uploading file", error);
//     }
//   };

//   return (
//     <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
//       <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 relative">
//         {/* Message Input */}
//         <input
//           type="text"
//           className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
//           placeholder="Enter Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         {/* Attachment Button */}
//         <button
//           className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//           onClick={handleAttachmentClick}
//         >
//           <GrAttachment className="text-2xl" />
//         </button>

//         {/* Hidden File Input */}
//         <input
//           className="hidden"
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleAttachmentChange}
//         />

//         {/* Emoji Picker */}
//         <div className="relative">
//           <button
//             className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//             onClick={() => setEmojiPickerOpen(true)}
//           >
//             <RiEmojiStickerLine className="text-2xl" />
//           </button>
//           {emojiPickerOpen && (
//             <div className="absolute bottom-16 right-0" ref={emojiRef}>
//               <EmojiPicker
//                 theme="dark"
//                 onEmojiClick={handleAddEmoji}
//                 autoFocusSearch={false}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Send Button */}
//       <button
//         className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//         onClick={handleSendMessage}
//       >
//         <IoSend className="text-2xl" />
//       </button>
//     </div>
//   );
// };

export default MessageBar;
