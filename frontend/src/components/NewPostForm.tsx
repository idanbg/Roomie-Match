import { useState, ChangeEvent, FormEvent } from "react";
import api from "../services/api";
import "../styles/NewPostForm.css";

type Props = {
  onPostCreated: () => void;
};

const NewPostForm = ({ onPostCreated }: Props) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imagePath = uploadRes.data.imagePath;
      }

      await api.post("/posts", { text, image: imagePath });
      setText("");
      setImageFile(null);
      onPostCreated();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="new-post-heading">Share something with your future roommate 📝</h4>

      <form onSubmit={handleSubmit} className="new-post-form">
        <textarea
          className="new-post-textarea"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

<label htmlFor="file-upload" className="custom-file-label">
  {imageFile ? imageFile.name : "Attach image"}
</label>
<input
  id="file-upload"
  type="file"
  className="new-post-file"
  accept="image/*"
  onChange={handleFileChange}
/>
        <button className="new-post-button" type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </>
  );
};

export default NewPostForm;
