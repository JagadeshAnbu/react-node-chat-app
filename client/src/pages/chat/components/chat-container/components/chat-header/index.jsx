import React, { useState } from "react";
import { toast } from "react-toastify"; // For notifications
import apiClient from "@/lib/api-client"; // Handles your API calls
import { UPDATE_CHANNEL, DELETE_CHANNEL, GET_ALL_CONTACTS } from "@/lib/constants"; // Import your API routes
import EditChannelModal from "../../../contacts-container/components/EditChannelModal/EditChannelModal.jsx"; // Modal component for editing channels
import { useAppStore } from "@/store/index.js"; // Using store

const ChatHeader = () => {
  const { selectedChatData, setChannels, closeChat, selectedChatType } = useAppStore();

  const [editChannelModal, setEditChannelModal] = useState(false);
  const [channelName, setChannelName] = useState(selectedChatData?.name || ""); // Optional chaining ensures no crash
  const [selectedMembers, setSelectedMembers] = useState(selectedChatData?.members || []); 
  const [availableContacts, setAvailableContacts] = useState([]); // To hold the list of contacts

  // Function to open the modal and fetch contacts
  const openEditModal = async () => {
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true, // Include credentials for authentication
      }); // Fetch all contacts
      if (response.status === 200) {
        setAvailableContacts(response.data.contacts);
        setEditChannelModal(true); // Open modal after fetching contacts
      } else {
        toast.error("Failed to fetch contacts. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error); // Log the error
      toast.error("Error fetching contacts.");
    }
  };

  // Function to update the channel details
  const updateChannel = async () => {
    try {
      const response = await apiClient.put(
        `${UPDATE_CHANNEL}/${selectedChatData?._id}`, // Optional chaining for safety
        { name: channelName, members: selectedMembers },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setChannels((prev) =>
          prev.map((channel) =>
            channel._id === selectedChatData?._id ? response.data.channel : channel
          )
        );
        toast.success("Channel updated successfully.");
        setEditChannelModal(false); // Close modal on success
      } else {
        toast.error("Failed to update the channel.");
      }
    } catch (error) {
      console.error("Error updating channel:", error); // Log the error
      toast.error("Error updating the channel.");
    }
  };

  // Function to delete the channel
  const deleteChannel = async () => {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      try {
        const response = await apiClient.delete(`${DELETE_CHANNEL}/${selectedChatData?._id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          // Update the channels state by filtering out the deleted channel
          setChannels((prev) => prev.filter((channel) => channel._id !== selectedChatData?._id));
          toast.success("Channel deleted successfully.");
          closeChat(); // Close the chat after deletion
        } else {
          toast.error("Failed to delete the channel.");
        }
      } catch (error) {
        console.error("Error deleting channel:", error); // Log the error
        toast.error("Error deleting the channel.");
      }
    }
  };

  return (
    <div className="header-container flex justify-between items-center p-4 bg-blue-500 shadow-md">
      <div className="channel-info">
        <span className="text-white font-semibold">
          {selectedChatType === "channel" ? channelName : "Direct Chat"}
        </span>
      </div>

      <div className="header-actions flex space-x-2">
        <button onClick={openEditModal} className="btn">Edit Channel</button>
        <button onClick={deleteChannel} className="btn btn-danger">Delete Channel</button>
      </div>

      {editChannelModal && (
        <EditChannelModal
          channelName={channelName}
          setChannelName={setChannelName}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers} // Make sure to pass the setter function
          availableContacts={availableContacts}
          onClose={() => setEditChannelModal(false)}
          onSubmit={updateChannel} // Submit the update
        />
      )}
    </div>
  );
};

export default ChatHeader;
