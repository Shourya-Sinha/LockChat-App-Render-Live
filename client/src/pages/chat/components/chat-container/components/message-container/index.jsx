import { apiClient } from "@/lib/api_client";
import { useAppStore } from "@/Store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTES,
  HOST,
} from "@/Utils/Constant";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderOpen, MdFolderZip } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = ({ selectedFile, progress }) => {
  const scrollRef = useRef();
  const chatEndRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
    fileDownloadProgress, // Track download progress from the store
    isDownloading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false); // Track cancellation
  const [downloadId, setDownloadId] = useState(null);
  const [downloadController, setDownloadController] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false); // Track if the file has been downloaded
  const [downloadPath, setDownloadPath] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      // For image files
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewContent(
            <img
              src={e.target.result}
              alt="File preview"
              style={{ maxWidth: "80px", maxHeight: "80px" }}
            />
          );
          setShowPreview(true);
        };
        reader.readAsDataURL(selectedFile);
      }
      // For PDF files
      else if (selectedFile.type === "application/pdf") {
        setPreviewContent(
          <span className="px-5 py-7">{selectedFile.name}</span>
        );
        setShowPreview(true);
      }
      // For ZIP files or other types
      else if (selectedFile.type === "application/zip") {
        setPreviewContent(<span>{selectedFile.name}</span>);
        setShowPreview(true);
      }
      // Handle unsupported file types
      else {
        setPreviewContent(<span>{selectedFile.name}</span>);
        setShowPreview(true);
      }
    } else {
      // Reset preview if no file is selected
      setPreviewContent(null);
      setShowPreview(false);
    }
  }, [selectedFile]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {}
    };
    // const getChannelMessages = async () => {
    //   try {
    //     const response = await apiClient.get(
    //       `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
    //       { withCredentials: true }
    //     );

    //     if (response.data.messages) {
    //       setSelectedChatMessages(response.data.messages);
    //     }
    //     console.log('channel message',response.data.messages);
    //   } catch (error) {
    //     console.log("error in get channel message", error);
    //   }
    // };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    } //else if (selectedChatType === "channel") getChannelMessages();
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
useEffect(()=>{
  // console.log('selectedChatType',selectedChatType);
  const getChannelMessages = async () => {
    try {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
      // console.log('channel message',response.data.messages);
    } catch (error) {
      // console.log("error in get channel message", error);
    }
  };

  if(selectedChatType === "channel"){
    getChannelMessages();
  }
},[selectedChatType,selectedChatData,setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
      // chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    // Retrieve downloaded files information from localStorage
    const downloadedFiles =
      JSON.parse(localStorage.getItem("downloadedFiles")) || {};

    // Check if the current message file is already downloaded
    if (imageURL) {
      const fileName = imageURL.split("/").pop();
      if (downloadedFiles[fileName]) {
        setIsDownloaded(true); // Set to true if file is downloaded
        setDownloadPath(downloadedFiles[fileName].downloadPath); // Restore download path
      }
    }
  }, [imageURL]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const handleFileDownloadComplete = (fileUrl) => {
    const fileName = fileUrl.split("/").pop();

    // Update localStorage with download information
    const downloadedFiles =
      JSON.parse(localStorage.getItem("downloadedFiles")) || {};
    downloadedFiles[fileName] = { isDownloaded: true, downloadPath: fileName };
    localStorage.setItem("downloadedFiles", JSON.stringify(downloadedFiles));

    // Update the component state to reflect the download
    setIsDownloaded(true);
    setDownloadPath(fileName);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDtae = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDtae && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    const controller = new AbortController(); // Create a new AbortController
    setDownloadController(controller);
    setIsDownloading(true);
    setFileDownloadProgress(0);
    setImageURL(url);
    setDownloadId(url);

    try {
      const response = await apiClient.get(`${HOST}/${url}`, {
        responseType: "blob",
        signal: controller.signal,
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted); // Update progress

          if (isCancelled) {
            // Cancel the download if necessary
            // console.log("Download cancelled");
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            setIsDownloading(false);
            setFileDownloadProgress(0); // Reset progress
            setDownloadId(null); // Reset download ID
            setIsCancelled(false); // Reset cancellation flag
            return;
          }
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);

      setIsDownloaded(true);
      setDownloadPath(url.split("/").pop());

      // Call the function to update localStorage and state after download is complete
      handleFileDownloadComplete(url);
    } catch (error) {
      if (error.name === "AbortError") {
        // console.log("Download was cancelled");
      } else {
        console.error("Download error:", error);
      }
    } finally {
      setIsDownloading(false); // Set downloading to false regardless of success or failure
      setFileDownloadProgress(0); // Reset progress after download
      setIsCancelled(false); // Reset cancellation state
      setDownloadId(null); // Clear download ID
      setDownloadController(null);
    }
  };

  const cancelDownload = () => {
    if (downloadController) {
      downloadController.abort(); // Cancel the download
    }
  };

  const renderDMMessages = (message) => {
    // const isCurrentFileDownloading = isDownloading && message.fileUrl === imageURL;
    const fileUrl = message.fileUrl || "";
    const isCurrentFileDownloading =
      isDownloading && message.fileUrl === imageURL;

    const downloadedFiles =
      JSON.parse(localStorage.getItem("downloadedFiles")) || {};
    const fileName = fileUrl ? fileUrl.split("/").pop() : "Unknown File";
    const isDownloadComplete =
      downloadedFiles[fileName] && downloadedFiles[fileName].isDownloaded;
    // const isDownloadComplete = isDownloaded && downloadPath === fileUrl.split("/").pop();

    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/90 text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33]/80 text-white/80 border-[#ffffff]/50"
            } border inline-block px-2 py-1 rounded my-1 max-w-[50%] break-words text-sm`}
            style={{ fontSize: "12px" }}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/90 text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33]/80 text-white/80 border-[#ffffff]/50"
            } border inline-block px-2 py-1 rounded my-1 max-w-[50%] break-words text-sm`}
            style={{ fontSize: "12px" }}
          >
            {/* Check if the file is an image */}
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={150}
                  width={150}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {/* After download is complete, show folder icon along with filename */}
                {isDownloadComplete ? (
                  <>
                    <span>{message.fileUrl.split("/").pop()}</span>{" "}
                    {/* Show filename */}
                    <span
                      className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() =>
                        window.open(`${HOST}/${message.fileUrl}`, "_blank")
                      }
                    >
                      <MdFolderOpen />
                    </span>
                  </>
                ) : (
                  <>
                    {/* Show the file download icon and filename */}
                    <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>

                    {/* Show download/cancel button based on state */}
                    {isCurrentFileDownloading ? (
                      <div>
                        <span
                          className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                          onClick={cancelDownload}
                        >
                          <ImCancelCircle />
                        </span>
                      </div>
                    ) : (
                      <span
                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        onClick={() => downloadFile(message.fileUrl)}
                      >
                        <IoMdArrowRoundDown />
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Show download progress bar if downloading */}
            {isCurrentFileDownloading && (
              <div className="mt-2">
                <div className="h-1 bg-gray-300 rounded-full overflow-hidden w-full">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${fileDownloadProgress}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1">
                  {fileDownloadProgress}%
                </div>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600" style={{ fontSize: "10px" }}>
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const fileUrl = message.fileUrl || "";
    const isCurrentFileDownloading =
      isDownloading && message.fileUrl === imageURL;

    const downloadedFiles =
      JSON.parse(localStorage.getItem("downloadedFiles")) || {};
    const fileName = fileUrl ? fileUrl.split("/").pop() : "Unknown File";
    const isDownloadComplete =
      downloadedFiles[fileName] && downloadedFiles[fileName].isDownloaded;
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-[#8417ff]/90 text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33]/80 text-white/80 border-[#ffffff]/50"
            } border inline-block px-2 py-1 rounded my-1 max-w-[50%] break-words text-sm ml-9`}
            style={{ fontSize: "12px" }}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-[#8417ff]/90 text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33]/80 text-white/80 border-[#ffffff]/50"
            } border inline-block px-2 py-1 rounded my-1 max-w-[50%] break-words text-sm`}
            style={{ fontSize: "12px" }}
          >
            {/* Check if the file is an image */}
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={150}
                  width={150}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {/* After download is complete, show folder icon along with filename */}
                {isDownloadComplete ? (
                  <>
                    <span>{message.fileUrl.split("/").pop()}</span>{" "}
                    {/* Show filename */}
                    <span
                      className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() =>
                        window.open(`${HOST}/${message.fileUrl}`, "_blank")
                      }
                    >
                      <MdFolderOpen />
                    </span>
                  </>
                ) : (
                  <>
                    {/* Show the file download icon and filename */}
                    <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>

                    {/* Show download/cancel button based on state */}
                    {isCurrentFileDownloading ? (
                      <div>
                        <span
                          className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                          onClick={cancelDownload}
                        >
                          <ImCancelCircle />
                        </span>
                      </div>
                    ) : (
                      <span
                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        onClick={() => downloadFile(message.fileUrl)}
                      >
                        <IoMdArrowRoundDown />
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Show download progress bar if downloading */}
            {isCurrentFileDownloading && (
              <div className="mt-2">
                <div className="h-1 bg-gray-300 rounded-full overflow-hidden w-full">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${fileDownloadProgress}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1">
                  {fileDownloadProgress}%
                </div>
              </div>
            )}
          </div>
        )}

        {message.sender._id !== userInfo._id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="Profile image"
                  className="object-contain w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {" "}
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}{" "}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}{" "}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}{" "}
          </div>
        )}
      </div>
    );
  };

  return (
    // <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[55vw] lg:w-[55vw] xl:w-[65vw] w-full">
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5 ">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setShowImage(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
      {showPreview && (
        <div className=" bg-[#8417ff]/90 text-white/80 border-[#8417ff]/50 border inline-block px-2 py-3 rounded my-1 max-w-[50%] break-words text-sm">
          {previewContent}
          <div className="h-1 bg-gray-300 rounded-full overflow-hidden w-full">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1">{progress}%</div>
          {/* <span className="mt-2 text-white font-semibold">{progress}% </span> */}
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
