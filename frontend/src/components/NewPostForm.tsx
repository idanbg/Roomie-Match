import { useState, ChangeEvent, FormEvent } from "react";
import api from "../services/api";

type Props = {
  onPostCreated: () => void; // Trigger a refresh after new post
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
      onPostCreated(); // refresh posts
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default NewPostForm;
