import React, { useEffect } from "react";
import Logo from "@/assets/logo.png";
import ProfileInfo from "./Profile_Info";
import NewDM from "./new-dm";
import { apiClient } from "@/lib/api_client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTES } from "@/Utils/Constant";
import { useAppStore } from "@/Store";
import ContactList from "@/components/Contact_list";
import CreateChannel from "./create-channel";

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts, channels ,setChannels} =
    useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTES, {
        withCredentials: true,
      });

      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels,setDirectMessagesContacts]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3 flex flex-row items-center px-3">
        <img src={Logo} alt="Logo" className="w-12 h-12 object-contain" />
        <span className="pb-3 text-3xl font-semibold pl-2">Lockchat</span>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-300 pl-10 font-thin text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
