import React, { useState } from "react";
import { toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons
import apiClient from "@/lib/api-client";
import { UPDATE_CHANNEL, DELETE_CHANNEL, GET_ALL_CONTACTS } from "@/lib/constants";
import EditChannelModal from "../../../contacts-container/components/EditChannelModal/EditChannelModal.jsx";
import { useAppStore } from "@/store/index.js";

const ChatHeader = () => {
  const { selectedChatData, setChannels, closeChat, selectedChatType } = useAppStore();
  const [editChannelModal, setEditChannelModal] = useState(false);
  const [channelName, setChannelName] = useState(selectedChatData?.name || "");
  const [selectedMembers, setSelectedMembers] = useState(selectedChatData?.members || []);
  const [availableContacts, setAvailableContacts] = useState([]);
  
  const userId = useAppStore().userId // Assuming this is where you store the current user's ID

  const isAdmin = selectedChatData?.adminId === userId/* current user ID */; // Check if the user is the admin

  const openEditModal = async () => {
    if (!isAdmin) {
      toast.warn("Only the channel admin can add new members.");
      return;
    }
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true });
      if (response.status === 200) {
        setAvailableContacts(response.data.contacts);
        setEditChannelModal(true);
      } else {
        toast.error("Failed to fetch contacts. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Error fetching contacts.");
    }
  };

  const updateChannel = async () => {
    try {
      const response = await apiClient.put(
        `${UPDATE_CHANNEL}/${selectedChatData?._id}`,
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
        setEditChannelModal(false);
      } else {
        toast.error("Failed to update the channel.");
      }
    } catch (error) {
      console.error("Error updating channel:", error);
      toast.error("Error updating the channel.");
    }
  };

  const deleteChannel = async () => {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      try {
        const response = await apiClient.delete(`${DELETE_CHANNEL}/${selectedChatData?._id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setChannels((prev) => prev.filter((channel) => channel._id !== selectedChatData?._id));
          toast.success("Channel deleted successfully.");
          closeChat();
        } else {
          toast.error("Failed to delete the channel.");
        }
      } catch (error) {
        console.error("Error deleting channel:", error);
        toast.error("Error deleting the channel.");
      }
    }
  };

  return (
    <div className="header-container flex justify-between items-center p-4 bg-blue-500 shadow-md">
      <div className="channel-info">
        <span className="text-white font-semibold">
          {selectedChatType === "channel" ? channelName : `${selectedChatData?.firstName} ${selectedChatData?.lastName}`}
        </span>
      </div>

      {selectedChatType === "channel" && (
        <div className="header-actions flex space-x-2">
          <button onClick={openEditModal} title="Edit Channel" className="btn">
            <FaEdit className="mr-1" />
          </button>
          <button onClick={deleteChannel} title="Delete Channel" className="btn btn-danger">
            <FaTrash className="mr-1" />
          </button>
        </div>
      )}

      {editChannelModal && (
        <EditChannelModal
          channelName={channelName}
          setChannelName={setChannelName}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          availableContacts={availableContacts}
          onClose={() => setEditChannelModal(false)}
          onSubmit={updateChannel}
        />
      )}
    </div>
  );
};

export default ChatHeader;
