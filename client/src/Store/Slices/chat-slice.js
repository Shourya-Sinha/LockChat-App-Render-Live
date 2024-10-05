export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts:[],
  isUploading:false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgess:0,
  channels:[],
  setChannels:(channels)=>set({channels}),
  setIsUploading:(isUploading)=>set({isUploading}),
  setIsDownloading:(isDownloading)=>set({isDownloading}),
  setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
  setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
    setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
    addChannel:(channel)=>{
      const channels=get().channels;
      set({
        channels:[...channels,channel],
      })
    },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
    addMessage:(message)=>{
      const selectedChatMessages=get().selectedChatMessages;
      const selectedChatType=get().selectedChatType;

      set({
        selectedChatMessages:[...selectedChatMessages,{
          ...message,
          recipient:selectedChatType === "channel" ? message.recipient : message.recipient._id,
          sender:selectedChatType === "channel" ? message.sender : message.sender._id,
        }],
      })
    },
    addChannelInChannelList:(message)=>{
      const channels=get().channels;
      const data = channels.find((channel)=>channel._id === message.channelId);
      const index = channels.findIndex(
        (channel)=>channel._iid === message.channelId
      );
      if(index !== -1 && index !== undefined){
        channels.splice(index,1);
        channels.unshift(data);
      }
    }
});

