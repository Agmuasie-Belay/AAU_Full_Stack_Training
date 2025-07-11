import React from "react";
import axios from "axios";

export default function DeleteBookButton({ id, token, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Book deleted successfully");
      onDeleted(id); // notify parent
    } catch (error) {
      //console.error("Failed to delete book:", error);
      //alert("Failed to delete book");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
    >
      Delete
    </button>
  );
}
