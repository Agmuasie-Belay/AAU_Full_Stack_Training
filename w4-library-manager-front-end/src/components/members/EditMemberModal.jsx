import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function EditBookModal({ bookId, onClose, onUpdateSuccess }) {
  const token = localStorage.getItem("accessToken");
  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch book details
    const fetchBook = async () => {
      const res = await axios.get(`http://localhost:3000/members/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook(res.data);
    };
    fetchBook();
  }, [bookId]);

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/members/${bookId}`,
        {
          name: book.name,
          email: book.email,
          phone: book.phone,
          //join_date: Number(book.join_date),
        
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateSuccess?.(); // Refresh book list in parent
      onClose(); // Close modal
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Book</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="space-y-3">
            <label htmlFor="">Title</label>
          <input
            type="text"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="number"
            value={book.published_year}
            onChange={(e) =>
              setBook({ ...book, published_year: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="number"
            value={book.available_copies}
            onChange={(e) =>
              setBook({ ...book, available_copies: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
          />
          <select
            value={book.genre_id}
            onChange={(e) => setBook({ ...book, genre_id: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Book
          </button>
        </div>
      </div>
    </div>
  );
}
