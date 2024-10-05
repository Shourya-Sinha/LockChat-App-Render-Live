import { useAppStore } from "@/Store";
import { HOST } from "@/Utils/Constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

// export const SocketProvider = ({ children }) => {
//   const socket = useRef();
//   const { userInfo } = useAppStore();

//   const selectedChatDataRef = useRef();
//   const selectedChatTypeRef = useRef();
//   const messageadd = useRef();

//   useEffect(() => {
//     if (userInfo && userInfo._id) {
//       socket.current = io(HOST, {
//         withCredentials: true,
//         query: { userId: userInfo._id },
//       });
//       socket.current.on("connect", () => {
//         console.log("Connected to socket server");
//       });
//       // console.log('user info in context',userInfo);
//       const updateRefs = () => {
//         const { selectedChatData, selectedChatType,addMessage } = useAppStore.getState();
//         selectedChatDataRef.current = selectedChatData;
//         selectedChatTypeRef.current = selectedChatType;
//         messageadd.current = addMessage;
//       };

//       const unsubscribe = useAppStore.subscribe(updateRefs);

//       const handleRecieveMessage = (message) => {
//         const { selectedChatData, selectedChatType ,addMessage} = selectedChatDataRef.current;
//         if (
//           (selectedChatType !== undefined &&
//             selectedChatData._id === message.sender._id) ||
//           selectedChatData._id === message.recipient._id
//         ) {
//             console.log('message rcv',message);
//           addMessage(message);
//         }
//       };
//       const handleRecieveChannelMessage=(message)=>{
//         const selectedChatData = selectedChatDataRef.current;
//         const selectedChatType = selectedChatTypeRef.current;
//         const addMessage =  messageadd.current;

//         if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
//           console.log("Channel message matched, adding message.");
//           addMessage(message);
//         }else {
//           console.log("Channel message did not match.");
//         }
//         console.log("Selected chat data:", selectedChatData);
//         console.log("Selected chat type:", selectedChatType);
//         console.log("Message channelId:", message.channelId);
//       }

//       socket.current.on("recieveMessage", handleRecieveMessage);
//       socket.current.on("recieve-channel-message",handleRecieveChannelMessage);

//       return () => {
//         socket.current.disconnect();
//         // socket.current = null;
//       };
//     }
//   }, [userInfo]);

//   return (
//     <SocketContext.Provider value={socket.current}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  const selectedChatDataRef = useRef();
  const selectedChatTypeRef = useRef();
  const messageadd = useRef();

  useEffect(() => {
    if (userInfo && userInfo._id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const updateRefs = () => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();
        selectedChatDataRef.current = selectedChatData;
        selectedChatTypeRef.current = selectedChatType;
        messageadd.current = addMessage;
      };

      const unsubscribe = useAppStore.subscribe(updateRefs);

      const handleRecieveMessage = (message) => {
        const selectedChatData = selectedChatDataRef.current;
        const selectedChatType = selectedChatTypeRef.current;
        const addMessage = messageadd.current;

        // Check if selectedChatData and addMessage are defined
        if (selectedChatData && addMessage) {
          if (
            (selectedChatType !== undefined &&
              selectedChatData._id === message.sender._id) ||
            selectedChatData._id === message.recipient._id
          ) {
            console.log("message rcv", message);
            addMessage(message);
          }
        } else {
          console.warn("selectedChatData or addMessage is undefined.");
        }
      };

      const handleRecieveChannelMessage = (message) => {
        const selectedChatData = selectedChatDataRef.current;
        const selectedChatType = selectedChatTypeRef.current;
        const addMessage = messageadd.current;
        // const { addChannelInChannelList } = useAppStore().getState();
        // Check if selectedChatData and addMessage are defined
        if (selectedChatData && addMessage) {
          if (
            selectedChatType !== undefined &&
            selectedChatData._id === message.channelId
          ) {
            // console.log("Channel message matched, adding message.");
            addMessage(message);
            // addChannelInChannelList(message);
          } else {
            console.log("Channel message did not match.");
          }
        } else {
          console.warn("selectedChatData or addMessage is undefined.");
        }

        // console.log("Selected chat data:", selectedChatData);
        // console.log("Selected chat type:", selectedChatType);
        // console.log("Message channelId:", message.channelId);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

      return () => {
        unsubscribe(); // Cleanup the subscription
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
