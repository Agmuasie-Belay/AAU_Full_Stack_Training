import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import MemberCard from "./MemberCard";
import { X, Search } from "lucide-react";
export default function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const modalRef = useRef(null);
  const handleAddBookClick = () => setShowForm(true);
  const handleClose = () => setShowForm(false);
  const token = localStorage.getItem("accessToken");
  const [genres, setGenres] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [join_date, setJoinDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingBook, setEditingBook] = useState(null);

  const handleDelete = (deletedId) => {
    setMembers((prevMembers) => prevMembers.filter((book) => book.id !== deletedId));
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/members", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const memberData = res.data.map((member) => ({
          name:member.name,
          email:member.email,
          phone:member.phone,
          join_date:member.join_date
        }));

        setMembers(memberData);
      } catch (error) {
        console.error("Error fetching members", error);
      }
    };
    fetchMembers();
  }, []);

  console.log(members)

 

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
        "http://localhost:3000/members",
        {
          name,
          email,
          phone, 
          join_date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, //refer
          },
        }
      );
      console.log("Book added:", response.data);
      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setJoinDate("");

      setSuccessMessage("Member added successfully");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-row justify-between m-6 ">
        <div className="flex flex-col text-left">
          <span className="text-2xl font-bold mt-4">Members</span>
          <span className="text-gray-600">
            Manage library members
          </span>
        </div>
        <button
          onClick={handleAddBookClick}
          className="bg-black h-fit text-white p-2 pl-4 pr-4 mt-6 rounded-md hover:bg-gray-700"
        >
          + Add Member
        </button>
      </div>
      <div className="ml-6 mr-6 z-10">
        <span className=" relative w-10 flex bg-white inset-y-8 left-1 pl-3 items-center pointer-events-none">
          <Search className="w-5 h-5  text-gray-400" />
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search members by name, email, or phone..."
          className="pl-12 pr-4 py-2 w-full z-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="p-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {members
          .filter((member) => {
            const term = searchTerm.toLowerCase().trim();
            return (
              member.name?.toLowerCase().includes(term) ||
              member.email?.toLowerCase().includes(term) ||
              member.phone?.toLowerCase().includes(term)||
              member.join_date?.toLowerCase().includes(term)
            );
          })
          .map((member, index) => (
            <MemberCard
              key={index}
              {...member}
              token={token}
              onDeleted={handleDelete}
              borrows
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
                <h2 className="text-lg font-semibold">Add New Member</h2>
                <p className="text-gray-600">
                  Enter the details for the new member
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
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-left font-medium mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  value={join_date}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  min="1"
                  required
                />
              </div>
            

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
