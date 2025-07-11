import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function ProfileAvatar({ name = "User", imageUrl = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleDropdown}
        className={`w-10 h-10 rounded-full ${
          role === "admin"
            ? "bg-red-200 text-red-900"
            : "bg-green-200 text-green-900"
        } font-bold text-lg flex items-center justify-center overflow-hidden`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          firstLetter
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-0 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
          <div className=" text-gray-800 border-b py-2 font-bold text-center">
            {name}
          </div>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 font-semibold"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-800 font-semibold"
            onClick={() => {
              localStorage.removeItem("accessToken");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
