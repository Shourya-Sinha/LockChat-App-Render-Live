import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDurations, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api_client";
import {
  CREATE_CHANNEL_ROUTES,
  GET_ALL_CONTACTS_ROUTES,
  HOST,
  SEARCH_CONTACTS_ROUTES,
} from "@/Utils/Constant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/Store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/MultipleSelect";
import CustomMultiSelector from "@/components/ui/CustomeMultipleSelect";
import { toast } from "sonner";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData,addChannel } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        setAllContacts(response.data.contacts);
        // console.log('all contacts in response api', response.data.contacts);
      } catch (error) {
        console.log("error in getall contacts create channel paghe", error);
      }
    };
    getData();
  }, []);

  // const createChannel = async () => {
  //   try {
  //     if(channelName.length >=  0 && selectedContacts.length >0){
  //       const response = await apiClient.post(CREATE_CHANNEL_ROUTES,{
  //         name:channelName,
  //         members:selectedContacts.map((contact)=>contact.value),
  //       },{withCredentials: true})
  //       if(response.status ===201){
  //         setChannelName("");
  //         setSelectedContacts([]);
  //         setNewChannelModel(false);
  //         addChannel(response.data.channel);
  //         toast.success(response.data.message);
  //       } 
  //     }
  //     console.log('response');
  //   } catch (error) {
  //     console.log('error in page channel',error);
  //     if(error.response && error.response.data){
  //       toast.error(error.response.data.message || "An error occured during logout");
  //   }else {
  //       toast.error("An unexpected error occurred.");
  //     }
  //   }
  // };
  
  const createChannel = async () => {
    try {
      if (channelName.length >= 0 && selectedContacts.length > 0) {
        // console.log("Selected contacts:", selectedContacts); // Debug log
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTES,
          {
            name: channelName,
            members: selectedContacts,  // Pass selectedContacts directly if they are IDs
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      // console.log("error in page channel", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  
  
  // console.log('selected contacts',selectedContacts);
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-1 p-2 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[450px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
          <div>
          <CustomMultiSelector
              allContacts={allContacts} // Pass all contacts to CustomMultiSelector
              onContactsChange={setSelectedContacts} // Handle selected contacts
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            />
          </div>
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
