import ProfileAvatar from "./ProfileAvatar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
  HomeIcon,
  BookOpen,
  ArrowLeftRightIcon,
  Users,
  UserSquare,
  LineChart,
  Folder,
  Menu,
  X,
} from "lucide-react";
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  console.log(role, username);
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const navLinkStyles = ({ isActive }) =>
    `flex p-2 pl-4 rounded transition duration-200 ${
      isActive ? "bg-blue-200 text-blue-900 font-semibold" : "hover:bg-gray-100"
    }`;
  return (
    <div className="flex min-h-screen p-0 m-0 w-full ">
      {sidebarOpen && (
        <div className="fixed inset-0 bg bg-gray-400 opacity-30 z-30 md:hidden"></div>
      )}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full w-64 sm:w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0  md:block`}
      >
        <div className="bg-white p-4 pl-0 h-16 text-[20px] font-bold border border-gray-200 box-border">
          <h2>Library Manager</h2>
        </div>

        <nav className="flex flex-col gap-0 p-4 mt-4 font-normal text-left space-y-2">
          <NavLink to="/login" />
          <NavLink
            to="/dashboard"
            className={navLinkStyles}
            onClick={() => setSidebarOpen(false)}
          >
            <HomeIcon /> <span className="pl-2">Dashboard</span>
          </NavLink>
          <NavLink
            to="/books"
            className={navLinkStyles}
            onClick={() => setSidebarOpen(false)}
          >
            <BookOpen /> <span className="pl-2">Books</span>
          </NavLink>
          <NavLink
            to="/borrow-return"
            className={navLinkStyles}
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeftRightIcon /> <span className="pl-2">Borrow/Return</span>
          </NavLink>
          {role === "admin" && (
            <>
              <NavLink
                to="/members"
                className={navLinkStyles}
                onClick={() => setSidebarOpen(false)}
              >
                <Users /> <span className="pl-2">Members</span>
              </NavLink>
              <NavLink
                to="/staff"
                className={navLinkStyles}
                onClick={() => setSidebarOpen(false)}
              >
                <UserSquare /> <span className="pl-2">Staff</span>
              </NavLink>
              <NavLink
                to="/reports"
                className={navLinkStyles}
                onClick={() => setSidebarOpen(false)}
              >
                <LineChart /> <span className="pl-2">Reports</span>
              </NavLink>
              <NavLink
                to="/genres"
                className={navLinkStyles}
                onClick={() => setSidebarOpen(false)}
              >
                <Folder /> <span className="pl-2">Genres</span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Main */}

      <main className={`flex flex-1  transition-all duration-300 ease-in-out`}>
        <header
          className={`fixed top-0 md:left-[16rem] md:w-[calc(100%-16rem)] w-full border bg-white border-gray-200 border-l-0np h-16 box-border z-30`}
        >
          <div className="flex justify-end mt-3 mr-3">
            <span className="pr-4 pt-2">
              Welcome, {capitalizeFirstLetter(username)}
            </span>
            <span>
              <ProfileAvatar name={username} className="mt-8" />
            </span>
          </div>
        </header>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="fixed w-10 stroke-1 h-10 md:hidden top-3 left-52 hover:bg-gray-200 hover:rounded-[4px] p-2 z-50" />
          ) : (
            <Menu className="w-10 z-50 text-gray-600 stroke-1 h-10 md:hidden fixed top-3 left-4 hover:bg-gray-200 hover:rounded-[4px] p-2" />
          )}
        </button>

        <div className={`flex flex-1  md:ml-[16rem] w-full mt-16`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
