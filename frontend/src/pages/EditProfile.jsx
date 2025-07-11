import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "../components/editProfile/ProfileImageUpload";
import EditForm from "../components/editProfile/EditForm";

function EditProfile() {
  const [user, setUser] = useState({});
  const [initialUserState, setInitialUserState] = useState({}); // Store initial user state
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [languageInput, setLanguageInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("User not found in local storage.");
        }

        const userId = JSON.parse(storedUser).currentUser._id;
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUser(data);
        setInitialUserState(data); // Store the initial user state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle input change for non-array fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle language input
  const handleLanguageInput = (e) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      const newLanguage = languageInput.trim();
      setUser((prevUser) => ({
        ...prevUser,
        language: [...prevUser.language, newLanguage],
      }));
      setLanguageInput("");
    }
  };

  // Handle specialization input
  const handleSpecializationInput = (e) => {
    if (e.key === "Enter" && specializationInput.trim()) {
      e.preventDefault();
      const newSpecialization = specializationInput.trim();
      setUser((prevUser) => ({
        ...prevUser,
        specialization: [...prevUser.specialization, newSpecialization],
      }));
      setSpecializationInput("");
    }
  };

  // Remove a language
  const removeLanguage = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      language: prevUser.language.filter((_, i) => i !== index),
    }));
  };

  // Remove a specialization
  const removeSpecialization = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      specialization: prevUser.specialization.filter((_, i) => i !== index),
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (imageUrl) => {
    setUploadingImage(true);
    setUser((prevUser) => ({ ...prevUser, profileImage: imageUrl }));
    setUploadingImage(false);
  };

  // Validate form fields
  const validateForm = () => {
    if (user.password && user.password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      // Create an object with only the updated fields
      const fieldsToUpdate = {};
      for (const key in user) {
        if (user[key] !== initialUserState[key]) {
          fieldsToUpdate[key] = user[key];
        }
      }

      // Remove password if it's empty
      if (!fieldsToUpdate.password) {
        delete fieldsToUpdate.password;
      }

      // If no fields were updated, show a message and return
      if (Object.keys(fieldsToUpdate).length === 0) {
        setSuccessMessage("No changes detected.");
        setLoading(false);
        return;
      }

      const updateResponse = await fetch(`/api/users/${user._id}`, {
        method: "PATCH", // Use PATCH for partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsToUpdate),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update user data.");
      }

      const updatedUser = await updateResponse.json();
      setSuccessMessage("Profile updated successfully!");

      // Update local storage
      localStorage.setItem("user", JSON.stringify({ currentUser: updatedUser }));

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/profile");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        {/* Cover Image */}
        <div className="relative h-48 bg-gray-200 rounded-t-lg">
          <img
            src="/homeimage.jpeg"
            alt="Cover"
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Profile Image Upload */}
        <ProfileImageUpload
          profileImage={user.profileImage}
          onImageUpload={handleImageUpload}
          uploadingImage={uploadingImage}
          userId={user._id}
          setError={setError}
          setSuccessMessage={setSuccessMessage}
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
        {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}

        {/* Edit Form */}
        <EditForm
          user={user}
          handleChange={handleChange}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          languageInput={languageInput}
          setLanguageInput={setLanguageInput}
          handleLanguageInput={handleLanguageInput}
          removeLanguage={removeLanguage}
          specializationInput={specializationInput}
          setSpecializationInput={setSpecializationInput}
          handleSpecializationInput={handleSpecializationInput}
          removeSpecialization={removeSpecialization}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between p-6">
          <button
            onClick={handleCancel}
            disabled={loading || uploadingImage}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={loading || uploadingImage}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;