import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type EditProfileFormProps = {
  currentData: {
    username: string;
    profileImage?: string;
    bio?: string;
  };
  onCancel: () => void;
  onUpdated: () => void | Promise<void>;
};

const EditProfileForm = ({
  currentData,
  onCancel,
  onUpdated,
}: EditProfileFormProps) => {
  const { updateUser } = useAuth();

  const [username, setUsername] = useState(currentData.username);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState(currentData.bio || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(res.data.user);

      if (onUpdated) await onUpdated();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="profileImage">Profile Image</label>
        <input
          id="profileImage"
          type="file"
          onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="form-actions-centered">
        <button
          type="button"
          className="btn-primry equal-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary equal-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
