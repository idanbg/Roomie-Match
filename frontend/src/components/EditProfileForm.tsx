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

const EditProfileForm = ({ currentData, onCancel, onUpdated }: EditProfileFormProps) => {
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
    <form className="mt-3" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Profile Image</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Bio</label>
        <textarea
          className="form-control"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
