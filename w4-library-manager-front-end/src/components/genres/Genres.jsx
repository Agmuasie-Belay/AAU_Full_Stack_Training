import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Book,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [newGenre, setNewGenre] = useState({ name: "" });
  const [expandedGenre, setExpandedGenre] = useState(null);
  const [genreToDelete, setGenreToDelete] = useState(null); // NEW

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/genres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch genres");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      if (editingGenre) {
        await axios.patch(
          `http://localhost:3000/genres/${editingGenre.id}`,
          { name: newGenre.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/genres",
          { name: newGenre.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setShowForm(false);
      setEditingGenre(null);
      setNewGenre({ name: "" });
      fetchGenres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save genre");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:3000/genres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGenres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete genre");
    }
  };

  const startEditing = (genre) => {
    setEditingGenre(genre);
    setNewGenre({ name: genre.name });
    setShowForm(true);
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" w-full ">
      <div className="flex flex-row justify-between m-6 ">
        <div className="flex flex-col text-left">
          <span className="text-2xl font-bold mt-4">Genres</span>
          <span className="text-gray-600">Manage book genres (Admin Only)</span>
        </div>
        <button
          onClick={() => {
            setEditingGenre(null);
            setNewGenre({ name: "" });
            setShowForm(true);
          }}
          className="bg-black h-fit text-white p-2 pl-4 pr-4 mt-6 rounded-md hover:bg-gray-700"
        >
          + Add Genre
        </button>
      </div>

      <div className="ml-6 mr-6 z-10">
        <span className=" relative w-10 flex bg-white inset-y-8 left-1 pl-3 items-center pointer-events-none">
          <Search className="w-5 h-5  text-gray-400" />
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search genres..."
          className="pl-12 pr-4 py-2 w-full z-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <button onClick={()=>{setError(false)}}><X className="mr-2" size={18} /></button>
          <span>{error}</span>
        </div>
        </div>
      )}

      {showForm && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-md border border-gray-200 w-100 ">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div>
                  <div className="text-xl font-semibold">Add New Genre</div>
                  <div>Enter the name for the new genre.</div>
                  <div className="relative float-end -mt-10 right-0 top-0">
                    <button onClick={() => setShowForm(false)}>
                      <X />
                    </button>
                  </div>
                </div>
                <label className="block mt-4 text-left text-sm font-medium text-gray-700 mb-1">
                  Genre Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newGenre.name}
                  onChange={(e) => setNewGenre({ name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4 space-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGenre(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {editingGenre ? "Update" : "Create"} Genre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6 mx-6">
          {filteredGenres.length > 0 ? (
            filteredGenres.map((genre) => (
              <div
                key={genre.id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium text-left">{genre.name}</h3>
                      <p className="text-sm text-left text-gray-500">
                        Genre ID: {genre.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(genre)}
                      className="p-2 text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-md"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setGenreToDelete(genre)}
                      className="p-2 text-red-600 bg-gray-100 hover:bg-red-50 rounded-md"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No genres match your search" : "No genres found"}
            </div>
          )}
        </div>
      )}

      {genreToDelete && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-md border border-gray-200 w-96">
            <div className="text-xl font-semibold mb-2">Confirm Deletion</div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the genre "<strong>{genreToDelete.name}</strong>"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setGenreToDelete(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(genreToDelete.id);
                  setGenreToDelete(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
