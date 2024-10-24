import React, { useState } from "react";
import { toast } from "react-toastify";

const EditChannelModal = ({
    channelName,
    setChannelName,
    selectedMembers,
    setSelectedMembers,
    availableContacts,
    onClose,
    onSubmit,
}) => {
    const [newMember, setNewMember] = useState("");

    // Function to add a member
    const handleAddMember = () => {
        if (newMember) {
            if (selectedMembers.includes(newMember)) {
                // Show toast message if the member is already in the selected members
                toast.warning("This member is already added.");
            } else {
                setSelectedMembers([...selectedMembers, newMember]);
                setNewMember(""); // Clear the input field after adding
                toast.success("Member added successfully."); // Show success message
            }
        } else {
            toast.warning("Please select a member to add."); // Show warning if no member is selected
        }
    };

    // Function to remove a member
    const handleRemoveMember = (memberId) => {
        setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        toast.success("Member removed successfully."); // Show success message on removal
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="modal-container bg-slate-600 rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-semibold">Edit Channel</h2>

                {/* Channel Name */}
                <div className="field my-4">
                    <label className="block text-white-700">Channel Name:</label>
                    <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        className="input border rounded w-full p-2 text-black"
                    />
                </div>

                {/* Add Member */}
                <div className="field my-4">
                    <label className="block text-white-700">Add Member:</label>
                    <select
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        className="select border rounded w-full p-2 text-black bg-white"
                    >
                        <option value="">Select a user</option>
                        {availableContacts.map((user) => (
                            <option
                                key={user.value}
                                value={user.value}
                            >
                                {user.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddMember} className="btn mt-2">
                        Add Member
                    </button>
                </div>

                {/* Current Members */}
                <div className="members-list">
                    <h3 className="font-semibold">Current Members:</h3>
                    {selectedMembers.map((memberId) => {
                        // Find the corresponding contact
                        const memberContact = availableContacts.find(contact => contact.value === memberId);
                        return (
                            <div key={memberId} className="member-item flex justify-between items-center my-2">
                                <span>{memberContact ? memberContact.label : "Unknown Member"}</span>
                                <button
                                    onClick={() => handleRemoveMember(memberId)}
                                    className="btn-remove text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="modal-actions flex justify-between mt-4">
                    <button onClick={onClose} className="btn border-gray-500">
                        Cancel
                    </button>
                    <button onClick={onSubmit} className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditChannelModal;
