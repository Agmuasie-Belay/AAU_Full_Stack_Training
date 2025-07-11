import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import { X, Search } from "lucide-react";
export default function Book() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const modalRef = useRef(null);
  const handleAddBookClick = () => setShowForm(true);
  const handleClose = () => setShowForm(false);
  const token = localStorage.getItem("accessToken");
  const [genres, setGenres] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published_year, setPublishedYear] = useState(null);
  const [available_copies, setAvailableCopies] = useState(null);
  const [genreId, setGenreId] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingBook, setEditingBook] = useState(null);

  const handleDelete = (deletedId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedId));
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const booksData = res.data.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          published_year: book.published_year,
          available_copies: book.available_copies,
          genre_name: book.genre.name,
        }));

        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, []);

  const handleUpdate = () => {
    fetchBooks(); // refresh books
    setEditingBook(null); // close modal
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/genres", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const genresCol = response.data.map((genre) => ({
          id: genre.id,
          name: genre.name,
        }));
        setGenres(genresCol);
      } catch (error) {
        console.error("Can not fetch genres", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //refer

    try {
      const response = await axios.post(
        "http://localhost:3000/books",
        {
          title,
          author,
          published_year: Number(published_year),
          available_copies: Number(available_copies),
          genre_id: Number(genreId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, //refer
          },
        }
      );
      console.log("Book added:", response.data);
      setShowForm(false);
      setTitle("");
      setAuthor("");
      setPublishedYear("");
      setAvailableCopies("");
      setGenreId("");
      setSuccessMessage("Book added successfully", <Book />);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-row justify-between m-6 ">
        <div className="flex flex-col text-left">
          <span className="text-2xl font-bold mt-4">Books</span>
          <span className="text-gray-600">
            Manage your library's book collection
          </span>
        </div>
        <button
          onClick={handleAddBookClick}
          className="bg-black h-fit text-white p-2 pl-4 pr-4 mt-6 rounded-md hover:bg-gray-700"
        >
          + Add Book
        </button>
      </div>
      <div className="ml-6 mr-6 z-10">
        <span className=" relative w-10 flex bg-white inset-y-8 left-1 pl-3 items-center pointer-events-none">
          <Search className="w-5 h-5  text-gray-400" />
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search books by title, author, genre..."
          className="pl-12 pr-4 py-2 w-full z-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="p-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books
          .filter((book) => {
            const term = searchTerm.toLowerCase().trim();
            return (
              book.title?.toLowerCase().includes(term) ||
              book.author?.toLowerCase().includes(term) ||
              book.genre_name?.toLowerCase().includes(term)
            );
          })
          .map((book, index) => (
            <BookCard
              key={index}
              {...book}
              token={token}
              onDeleted={handleDelete}
            />
          ))}
      </div>

      {showForm && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 px-4 rounded-md shadow-lg w-full max-w-md z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col pl-16">
                <h2 className="text-lg font-semibold">Add New Book</h2>
                <p className="text-gray-600">
                  Enter the details for the new book
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Published year
                </label>
                <input
                  type="number"
                  value={published_year}
                  onChange={(e) => setPublishedYear(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Year (min 1800)"
                  min="1800"
                  max="2025"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Available copies
                </label>
                <input
                  type="number"
                  value={available_copies}
                  onChange={(e) => setAvailableCopies(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  min="1"
                  placeholder="Copies (min 1)"
                  required
                />
              </div>
              <label className="block text-left font-medium mb-1">Genre</label>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="mr-2 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div className="fixed top-1/2 right-1/3 z-50 bg-green-600 text-white px-10 py-15 rounded shadow-lg transition-opacity w-100   duration-300">
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
}
