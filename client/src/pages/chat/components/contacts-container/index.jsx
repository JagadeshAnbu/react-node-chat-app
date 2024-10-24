import React, { useEffect } from "react";
import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_CONTACTS_WITH_MESSAGES_ROUTE,
  GET_USER_CHANNELS,
} from "@/lib/constants";
import { useAppStore } from "@/store";
import NewDM from "./components/new-dm/new-dm";
import CreateChannel from "./components/create-channel/create-channel";
import { toast } from "react-toastify"; // Make sure to import toast for notifications

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = useAppStore();

  // Fetch contacts and channels data
  useEffect(() => {
    const getContactsWithMessages = async () => {
      const response = await apiClient.get(GET_CONTACTS_WITH_MESSAGES_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    getContactsWithMessages();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getChannels();
  }, [setChannels]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full flex flex-col h-full">
      <div className="pt-3 px-4">
        <Logo />
      </div>
      <div className="my-5 flex-grow">
        <div className="flex items-center justify-between pr-4 mb-2">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[35vh] overflow-y-auto scrollbar-hidden mb-4">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5 flex-grow">
        <div className="flex items-center justify-between pr-4 mb-2">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[35vh] overflow-y-auto scrollbar-hidden pb-5">
          <ContactList contacts={channels} isChannel />
        </div>
      </div>
      <div className="mt-auto px-4">
        <ProfileInfo />
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;
