import React, { useState } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import SaveConfirmationModal from "../SaveConfirmationModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const AudioResource = ({
  resource,
  handleLike,
  handleDislike,
  handleDeleteResource,
  handleEditResource,
  isAdmin,
  isLoggedIn,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState({ ...resource });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedResource((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    handleEditResource(resource._id, editedResource);
    setIsEditing(false);
    setShowSaveModal(false);
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditedResource({ ...resource });
    setIsEditing(false);
  };

  // Confirm delete
  const handleDelete = () => {
    handleDeleteResource(resource._id);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex gap-2 mb-4">
          {isEditing ? (
            <div className="flex justify-center gap-80 md:gap-60 lg:gap-40">
              <button
                onClick={() => setShowSaveModal(true)}
                className="text-green-500 hover:text-green-700"
              >
                <FaSave />
              </button>
              <button
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-64 md:gap-60 lg:gap-40">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing ? (
        // Edit Mode
        <div className="w-full">
          <input
            type="text"
            name="title"
            value={editedResource.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Title"
          />
          <input
            type="text"
            name="src"
            value={editedResource.src}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Source URL"
          />
          <textarea
            name="description"
            value={editedResource.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Description"
          />
        </div>
      ) : (
        // View Mode
        <>
          <div className="w-24 h-24 mb-4">
            <img
              className="w-full h-full object-contain"
              src={resource.img}
              alt="Audio Icon"
            />
          </div>
          <audio controls className="w-full">
            <source src={resource.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Like, Dislike, and Comment Buttons */}
          {isLoggedIn && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleLike(resource._id)}
                className="flex items-center gap-2 text-blue-500"
              >
                <FaThumbsUp /> {resource.likes?.length || 0}
              </button>
              <button
                onClick={() => handleDislike(resource._id)}
                className="flex items-center gap-2 text-red-500"
              >
                <FaThumbsDown /> {resource.dislikes?.length || 0}
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/resources/${resource._id}`)
                }
                className="flex items-center gap-2 text-green-500"
              >
                <FaComment /> {resource.comments?.length || 0}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          handleDelete={handleDelete}
          setShowDeleteModal={setShowDeleteModal}
          message="Are you sure you want to delete this audio resource?"
        />
      )}

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <SaveConfirmationModal
          handleSaveChanges={handleSave}
          setShowSaveModal={setShowSaveModal}
          message="Are you sure you want to save changes?"
        />
      )}
    </div>
  );
};

export default AudioResource;
