import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./blogComponent.css"

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert("Blog submitted successfully!");
        setTitle("");
        setContent("");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit blog: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to submit blog.");
    }
  };

  return (
    <main className="hero-section">
        <div className="content-wrapper">
      <h2 className="main-title">Create a Blog</h2>
      <div className="description">This page is for writing a blog and then submitting it to the backend where this gets converted to podcast and is stored in NAS</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <Editor
            apiKey='ibz4z4yihltvid9pvs2l2vl15fpvbgjd86v1id51eju887vt'
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        <button className="cta-button" type="submit">Submit</button>
      </form>
      </div>
    </main>
  );
};

export default BlogEditor;
